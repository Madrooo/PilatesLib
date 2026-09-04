import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Header() {
  const { user, signOut } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-bold text-teal-800" onClick={fecharMenu}>
          PilatesLib
        </Link>

        {/* Menu normal (lado a lado): visível a partir de telas médias (tablet/desktop) */}
        <nav className="hidden sm:flex items-center gap-4 text-sm">
          <NavLinks user={user} signOut={signOut} />
        </nav>

        {/* Botão hambúrguer: visível só em telas pequenas (celular) */}
        <button
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="sm:hidden p-2 -mr-2 text-gray-700"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
        >
          {menuAberto ? (
            // Ícone "X" (fechar)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Ícone "☰" (três linhas, hambúrguer)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Painel do menu mobile: só aparece quando "menuAberto" é true.
          O onClick aqui fecha o menu automaticamente sempre que qualquer
          link dentro dele for clicado (aproveitando que o clique "sobe"
          do link até este elemento pai). */}
      {menuAberto && (
        <nav
          className="sm:hidden flex flex-col gap-3 pt-4 pb-2 text-sm border-t border-gray-100 mt-3"
          onClick={fecharMenu}
        >
          <NavLinks user={user} signOut={signOut} />
        </nav>
      )}
    </header>
  )
}

// Extraído como componente separado porque os mesmos links aparecem tanto
// no menu normal (desktop) quanto no painel mobile — evita escrever tudo duas vezes
function NavLinks({
  user,
  signOut,
}: {
  user: ReturnType<typeof useAuth>['user']
  signOut: ReturnType<typeof useAuth>['signOut']
}) {
  return (
    <>
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
          className="text-gray-600 hover:text-gray-900 text-left"
        >
          Sair ({user.nome ?? user.email})
        </button>
      ) : (
        <Link to="/login" className="text-gray-600 hover:text-gray-900">
          Entrar
        </Link>
      )}
    </>
  )
}