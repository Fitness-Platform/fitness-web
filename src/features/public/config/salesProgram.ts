import {
  matchesSalesProgramId,
  readSalesProgramId,
} from "../utils/salesProgramIdentity";

export const salesProgramId = readSalesProgramId(
  import.meta.env.VITE_SALES_PROGRAM_ID,
);

export function isConfiguredSalesProgram(programId: string): boolean {
  return matchesSalesProgramId(programId, salesProgramId);
}
