import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { BookResponse } from '../types'
import type { PagedResponse } from '@/types/api'

export interface BranchResponse {
  id: number
  name: string
  location: string
  department: string
  phone: string
  email?: string
  isActive: boolean
  librarianId?: number
  librarianName?: string
  librarianEmail?: string
  totalBooks?: number
  availableBooks?: number
  activeBorrows?: number
  overdueCount?: number
  createdAt?: string
  operatingHours?: string
  maxBorrowDays?: number
  finePerDay?: number
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

export const branchService = {
  getAllBranches: async (): Promise<ApiResponse<BranchResponse[]>> => {
    return api.get('/branches')
  },
  getBranchById: async (id: number): Promise<ApiResponse<BranchResponse>> => {
    return api.get(`/branches/${id}`)
  },
  getBranchBooks: async (id: number, page = 0, size = 10): Promise<ApiResponse<PagedResponse<BookResponse>>> => {
    return api.get(`/branches/${id}/books`, { params: { page, size } })
  },
  getBranchInventory: async (id: number): Promise<ApiResponse<InventoryResponse[]>> => {
    return api.get(`/branches/${id}/inventory`)
  },
  getBranchStats: async (id: number): Promise<ApiResponse<BranchResponse>> => {
    return api.get(`/branches/${id}/stats`)
  },
  createBranch: async (data: Record<string, unknown>): Promise<ApiResponse<BranchResponse>> => {
    return api.post('/branches', data)
  },
  updateBranch: async (id: number, data: Record<string, unknown>): Promise<ApiResponse<BranchResponse>> => {
    return api.put(`/branches/${id}`, data)
  },
  deactivateBranch: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/branches/${id}`)
  },
  assignLibrarian: async (id: number, librarianId: number): Promise<ApiResponse<BranchResponse>> => {
    return api.put(`/branches/${id}/librarian`, null, { params: { librarianId } })
  },
  getBranchOverdue: async (id: number): Promise<ApiResponse<unknown[]>> => {
    return api.get(`/branches/${id}/overdue`)
  }
}
