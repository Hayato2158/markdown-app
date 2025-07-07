import { createClient } from '@supabase/supabase-js'

// 環境変数から URL と KEY を取得
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('supabaseUrl or supabaseKey is not defined')
}

// クライアントを作成
export const supabase = createClient(supabaseUrl, supabaseKey)
