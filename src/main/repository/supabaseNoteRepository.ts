import { supabase } from '../utils/supabaseClient'

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
