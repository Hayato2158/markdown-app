import { supabase } from '../utils/supabaseClient'
import { NoteInfo } from '@main/contents/ipc'
import { readNotesInfo } from './noteInfoRepository'


// Supabase にノートをアップロード（id が同じなら更新）
export const uploadNoteToSupabase = async (note: {
  id: string
  title: string
  content: string
  updated_at: string
}) => {
  const { data, error } = await supabase
    .from('notes')
    .upsert([note], { onConflict: 'id' }) // id が一致すれば更新

  if (error) {
    console.error('[Supabase] ノートアップロード失敗:', error.message)
    return false
  }

  console.log('[Supabase] ノートアップロード成功:', data)
  return true
}

export const fetchNotesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('notes')      // テーブル名。Supabase側で "notes" にしてある前提
    .select('*')         // 全カラム取得

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
