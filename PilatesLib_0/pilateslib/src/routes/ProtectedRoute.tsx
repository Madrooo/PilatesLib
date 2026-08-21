import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

type Props = {
  children: ReactNode
}

// Envolve qualquer página que só admin pode ver.
// Uso: <ProtectedRoute><Admin /></ProtectedRoute>
export function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth()

  // Enquanto ainda não sabemos se há sessão salva, evita "piscar" a tela de login
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Carregando...</div>
    )
  }

  // Não logado, ou logado mas sem papel admin -> manda para o login
  if (!user || user.papel !== 'admin') {
    return <Navigate to="/login" replace />
  }

  // Logado e é admin -> mostra a página normalmente
  return <>{children}</>
}