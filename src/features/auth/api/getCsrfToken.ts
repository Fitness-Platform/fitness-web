import { apiRequest } from '../../../services/apiClient'

type CsrfResponse = {
  token: string
  headerName: string
  parameterName: string
}

export type CsrfToken = {
  token: string
  headerName: string
}

function getCookie(name: string): string | null {
  const prefix = `${name}=`

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefix))

  if (!cookie) {
    return null
  }

  return decodeURIComponent(cookie.substring(prefix.length))
}

export async function getCsrfToken(): Promise<CsrfToken> {
  const response = await apiRequest<CsrfResponse>('/api/auth/csrf')

  const token = getCookie('XSRF-TOKEN')

  if (!token) {
    throw new Error('CSRF token cookie was not created')
  }

  return {
    token,
    headerName: response.headerName,
  }
}