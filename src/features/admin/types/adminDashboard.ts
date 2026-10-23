export type AdminProgram = {
  id: string
  name: string
  description: string | null
  status: 'DRAFT' | 'PUBLISHED'
  priceCents: number | null
  currency: string | null
  createdAt: string
  updatedAt: string
}

export type AdminProgramAccess = {
  id: string
  userId: string
  programId: string
  startsAt: string
  expiresAt: string | null
  revokedAt: string | null
  createdAt: string
  updatedAt: string
}

export type AdminPurchaseStatus =
  | 'PENDING'
  | 'PAID'
  | 'EXPIRED'

export type AdminPurchase = {
  purchaseId: string
  userId: string
  programId: string
  programName: string
  status: AdminPurchaseStatus
  amountCents: number
  currency: string
  createdAt: string
  paidAt: string | null
}

export type AdminDashboardData = {
  programs: AdminProgram[]
  accesses: AdminProgramAccess[]
  purchases: AdminPurchase[]
}