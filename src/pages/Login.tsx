import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)

    const { error } = await signIn(email, password)

    if (error) {
      setErrorMsg('E-mail ou senha incorretos.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg border border-gray-200"
      >
        <h1 className="text-xl font-bold text-gray-900 mb-4">Entrar</h1>

        {errorMsg && (
          <p className="text-sm text-red-600 mb-3">{errorMsg}</p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 text-sm"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-700 text-white rounded py-2 text-sm font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}