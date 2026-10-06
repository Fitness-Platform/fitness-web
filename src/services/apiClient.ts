const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

if (!API_URL) {
  throw new Error('VITE_API_URL is not configured')
}

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown, message: string) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${API_URL}${normalizedPath}`
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')

  const isJson =
    contentType?.includes('application/json') ||
    contentType?.includes('+json')

  if (isJson) {
    return response.json()
  }

  return response.text()
}

function getErrorMessage(payload: unknown, status: number) {
  if (typeof payload === 'object' && payload !== null) {
    if (
      'detail' in payload &&
      typeof payload.detail === 'string'
    ) {
      return payload.detail
    }

    if (
      'message' in payload &&
      typeof payload.message === 'string'
    ) {
      return payload.message
    }
  }

  return `Request failed with status ${status}`
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    credentials: 'include',
    headers,
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload,
      getErrorMessage(payload, response.status),
    )
  }

  return payload as T
}