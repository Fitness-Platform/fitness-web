import { Navigate, Outlet } from 'react-router-dom'

import { useAuthSession } from '../hooks/useAuthSession'

function ProtectedRoute() {
  const {
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

  if (isAuthenticated) {
    return <Outlet />
  }

  return null
}

export default ProtectedRoute