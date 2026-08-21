import { createClient } from '@supabase/supabase-js'

// Lemos as chaves do arquivo .env (nunca escrevemos elas direto aqui)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltam as variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY no arquivo .env'
  )
}

// Esse "supabase" é o objeto que vamos usar em todo o site
// para buscar exercícios, fazer login, salvar favoritos, etc.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)