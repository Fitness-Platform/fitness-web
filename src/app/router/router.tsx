import { createBrowserRouter } from 'react-router-dom'

import RootPage from '../../routes/RootPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
  },
])