import { getAdminPurchases } from './adminPurchases'
import { apiRequest } from '../../../services/apiClient'
import type {
  AdminDashboardData,
  AdminProgram,
  AdminProgramAccess,
} from '../types/adminDashboard'

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [programs, accesses, purchases] =
    await Promise.all([
      apiRequest<AdminProgram[]>(
        '/api/admin/programs',
      ),
      apiRequest<AdminProgramAccess[]>(
        '/api/admin/program-accesses',
      ),
      getAdminPurchases(),
    ])

  return {
    programs,
    accesses,
    purchases,
  }
}