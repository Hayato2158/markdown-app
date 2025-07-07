import { supabase } from '../utils/supabaseClient'

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('[Supabase] ログイン失敗:', error.message)
    return null
  }

  console.log('[Supabase] ログイン成功:', data.user.email)
  return data.user
}
