import { createBrowserRouter } from 'react-router-dom'

import LoginPage from '../../features/auth/pages/LoginPage'
import RootPage from '../../routes/RootPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'
import AdminRoute from '../../features/auth/components/AdminRoute'
import ProtectedRoute from '../../features/auth/components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  {
  path: '/app',
  element: <ProtectedRoute />,
  children: [
    {
      index: true,
      element: <p>Member area</p>,
    },
  ],
},
{
  path: '/admin',
  element: <AdminRoute />,
  children: [
    {
      index: true,
      element: <p>Admin area</p>,
    },
  ],
},
])