import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'

// Formato dos dados do usuário logado (vindos da nossa tabela "users",
// não só do login básico do Supabase)
type AppUser = {
  id: string
  nome: string | null
  email: string | null
  papel: 'admin' | 'usuario'
}

type AuthContextType = {
  user: AppUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Busca os dados extras do usuário (nome, papel) na nossa tabela "users"
async function fetchAppUser(userId: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, nome, email, papel')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar dados do usuário:', error.message)
    return null
  }
  return data
}

// O "Provider" envolve o site inteiro e disponibiliza o usuário logado
// para qualquer componente, via useAuth()
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ao carregar o site, verifica se já existe uma sessão salva (login anterior)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await fetchAppUser(session.user.id)
        setUser(appUser)
      }
      setIsLoading(false)
    })

    // Fica "escutando" mudanças de login/logout (ex: em outra aba)
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const appUser = await fetchAppUser(session.user.id)
        setUser(appUser)
      } else {
        setUser(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? error.message : null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook que qualquer componente usa para acessar o usuário logado:
// const { user, signIn, signOut } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>')
  }
  return context
}