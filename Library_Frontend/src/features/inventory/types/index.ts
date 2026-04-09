export interface InventoryRequest {
  bookId: number
  branchId: number
  totalCopies: number
  availableCopies?: number
  shelfLocation?: string
  condition?: string
}

export interface InventoryResponse {
  id: number
  bookId: number
  bookTitle: string
  bookAuthor: string
  isbn: string
  category: string
  branchId: number
  branchName: string
  totalCopies: number
  availableCopies: number
  borrowedCopies: number
  shelfLocation: string
  condition: string
  addedAt: string
}
