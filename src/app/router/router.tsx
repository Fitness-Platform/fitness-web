import { createBrowserRouter } from 'react-router-dom'

import LoginPage from '../../features/auth/pages/LoginPage'
import RootPage from '../../routes/RootPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'

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
])