import { createBrowserRouter } from 'react-router-dom'

import LoginPage from '../../features/auth/pages/LoginPage'
import RootPage from '../../routes/RootPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
])