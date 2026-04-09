export interface PurchaseRequestRequest {
  bookTitle: string
  author?: string
  isbn?: string
  reason: string
  priority?: string
  branchId: number
}

export interface PurchaseRequestResponse {
  id: number
  requestedById: number
  requestedByName: string
  branchId: number
  branchName: string
  bookTitle: string
  author?: string
  isbn?: string
  reason: string
  priority: string
  status: string
  approvedById?: number | null
  approvedByName?: string | null
  adminNotes?: string | null
  createdAt: string
}
