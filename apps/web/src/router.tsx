import { createBrowserRouter } from 'react-router-dom'
import RegisterPage from './pages/public/RegisterPage'
import LoginPage from './pages/admin/LoginPage'
import AdminHomePage from './pages/admin/AdminHomePage'

export const router = createBrowserRouter([
    { path: '/', element: <RegisterPage /> },
    { path: '/admin/login', element: <LoginPage /> },
    { path: '/admin', element: <AdminHomePage /> },
])
