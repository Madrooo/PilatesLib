import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-teal-800">
        PilatesLib
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          Biblioteca
        </Link>

        {user?.papel === 'admin' && (
          <>
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
            <Link to="/admin/categorias" className="text-gray-600 hover:text-gray-900">
              Categorias
            </Link>
          </>
        )}

        {user ? (
          <button
            onClick={() => signOut()}
            className="text-gray-600 hover:text-gray-900"
          >
            Sair ({user.nome ?? user.email})
          </button>
        ) : (
          <Link to="/login" className="text-gray-600 hover:text-gray-900">
            Entrar
          </Link>
        )}
      </nav>
    </header>
  )
}