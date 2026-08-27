import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Biblioteca } from './pages/Biblioteca'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'
import { AdminNovo } from './pages/AdminNovo'
import { AdminEditar } from './pages/AdminEditar'
import { AdminCategorias } from './pages/AdminCategorias'
import { ExercicioDetalhe } from './pages/ExercicioDetalhe'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Biblioteca />} />
        <Route path="/exercicio/:slug" element={<ExercicioDetalhe />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/novo"
          element={
            <ProtectedRoute>
              <AdminNovo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:id/editar"
          element={
            <ProtectedRoute>
              <AdminEditar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <AdminCategorias />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App