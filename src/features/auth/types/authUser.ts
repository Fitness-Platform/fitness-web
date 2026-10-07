export type UserRole = 'USER' | 'ADMIN'

export type AuthUser = {
  id: string
  email: string
  role: UserRole
}