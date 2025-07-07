import { supabase } from '../utils/supabaseClient'
import { readNotesInfo } from './noteInfoRepository'

export const uploadNoteToSupabase = async (note: {
  id: string
  title: string
  content: string
  updated_at: string
}) => {
  const {
    data: userData,
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    console.error('[Supabase] ユーザー取得エラー:', userError?.message)
    return false
  }

  const user_id = userData.user.id

  const { data, error } = await supabase
    .from('notes')
    .upsert([{ ...note, user_id }], { onConflict: 'id' }) // user_id を明示的に追加

  if (error) {
    console.error('[Supabase] ノートアップロード失敗:', error.message)
    return false
  }

  console.log('[Supabase] ノートアップロード成功:', data)
  return true
}

export const fetchNotesFromSupabase = async () => {
  const {
    data: userData,
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    console.error('[Supabase] ユーザー取得エラー:', userError?.message)
    return []
  }

  const user_id = userData.user.id

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user_id) // ユーザーごとのノートだけ取得

  if (error) {
    console.error('[Supabase] ノート取得エラー:', error.message)
    return []
  }

  console.log('[Supabase] ノート取得成功:', data)
  return data
}

export const syncAllLocalNotesToSupabase = async () => {
  const allNotes = await readNotesInfo()

  for (const note of allNotes) {
    await uploadNoteToSupabase({
      id: note.uuid,
      title: note.title,
      content: note.content ?? '',
      updated_at: note.lastEditTime.toISOString()
    })
  }

  console.log(`[同期完了] ローカルノート ${allNotes.length} 件を Supabase にアップロードしました`)
}

export const deleteNoteFromSupabase = async (uuid: string): Promise<void> => {
  const {
    data: userData,
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    console.error('[Supabase] ユーザー取得エラー:', userError?.message)
    throw userError
  }

  const user_id = userData.user.id

  const { error } = await supabase
    .from('notes')
    .delete()
    .match({ id: uuid, user_id }) // 自分のノートだけ削除可

  if (error) {
    console.error('[Supabase] ノート削除失敗:', error)
    throw error
  }

  console.log('[Supabase] ノート削除成功:', uuid)
}
