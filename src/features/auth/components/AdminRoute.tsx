import { Navigate, Outlet } from 'react-router-dom'

import { useAuthSession } from '../hooks/useAuthSession'

function AdminRoute() {
  const {
    user,
    isPending,
    isError,
    isUnauthenticated,
    isAuthenticated,
  } = useAuthSession()

  if (isPending) {
    return <p>Checking session...</p>
  }

  if (isError) {
    return <p>Unable to check session.</p>
  }

  if (isUnauthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isAuthenticated && user?.role !== 'ADMIN') {
    return <p>Forbidden</p>
  }

  if (isAuthenticated && user?.role === 'ADMIN') {
    return <Outlet />
  }

  return null
}

export default AdminRoute