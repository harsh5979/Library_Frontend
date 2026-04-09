import api from '@/lib/axios'
import type { ApiResponse, PageResponse } from '@/types/api'

export interface TransactionResponse {
  id: number
  userId: number
  userName: string
  bookId: number
  bookTitle: string
  bookAuthor: string
  coverImageUrl: string | null
  issueDate: string
  dueDate: string
  returnDate: string | null
  status: 'BORROWED' | 'RETURN_REQUESTED' | 'RETURNED' | 'OVERDUE' | 'LOST'
  fineAmount?: number
}

export const borrowService = {
  issueBook: async (data: { bookId: number; userId: number }): Promise<ApiResponse<TransactionResponse>> => {
    return api.post('/borrow/issue', data)
  },
  returnBook: async (transactionId: number): Promise<ApiResponse<TransactionResponse>> => {
    return api.post('/borrow/return', { transactionId })
  },
  acceptReturn: async (id: number): Promise<ApiResponse<TransactionResponse>> => {
    return api.put(`/borrow/${id}/accept-return`)
  },
  getMyBorrowings: async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TransactionResponse>>> => {
    return api.get('/borrow/my', { params: { page, size } })
  },
  getMyHistory: async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TransactionResponse>>> => {
    return api.get('/borrow/my/history', { params: { page, size } })
  },
  getAllTransactions: async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TransactionResponse>>> => {
    return api.get('/borrow/all', { params: { page, size } })
  },
  getAllOverdue: async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TransactionResponse>>> => {
    return api.get('/borrow/overdue', { params: { page, size } })
  },
  getOverdueByBranch: async (id: number, page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TransactionResponse>>> => {
    return api.get(`/borrow/overdue/branch/${id}`, { params: { page, size } })
  },
  getTransactionById: async (id: number): Promise<ApiResponse<TransactionResponse>> => {
    return api.get(`/borrow/${id}`)
  },
  renewBook: async (id: number): Promise<ApiResponse<TransactionResponse>> => {
    return api.post(`/borrow/renew/${id}`)
  },
  markAsLost: async (id: number): Promise<ApiResponse<TransactionResponse>> => {
    return api.put(`/borrow/${id}/lost`)
  },
  getUserHistory: async (userId: number, page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<TransactionResponse>>> => {
    return api.get(`/borrow/user/${userId}`, { params: { page, size } })
  }
}
