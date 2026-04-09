import api from '@/lib/axios'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { FineResponse } from '../types'

export const fineService = {
  getMyFines: async (page = 0, size = 10): Promise<ApiResponse<PagedResponse<FineResponse>>> => {
    return api.get('/fines/my', { params: { page, size } })
  },
  getMyTotal: async (): Promise<ApiResponse<number>> => {
    return api.get('/fines/my/total')
  },
  getAllFines: async (page = 0, size = 10): Promise<ApiResponse<PagedResponse<FineResponse>>> => {
    return api.get('/fines/all', { params: { page, size } })
  },
  getPendingFines: async (page = 0, size = 10): Promise<ApiResponse<PagedResponse<FineResponse>>> => {
    return api.get('/fines/pending', { params: { page, size } })
  },
  getFinesByBranch: async (id: number, page = 0, size = 10): Promise<ApiResponse<PagedResponse<FineResponse>>> => {
    return api.get(`/fines/branch/${id}`, { params: { page, size } })
  },
  payFine: async (id: number): Promise<ApiResponse<FineResponse>> => {
    return api.put(`/fines/${id}/pay`)
  },
  waiveFine: async (id: number, reason: string): Promise<ApiResponse<FineResponse>> => {
    return api.put(`/fines/${id}/waive`, null, { params: { reason } })
  },
  partialPayFine: async (id: number, amount: number): Promise<ApiResponse<FineResponse>> => {
    return api.put(`/fines/${id}/partial-pay`, { amount })
  },
  getFinesByUser: async (userId: number, page = 0, size = 10): Promise<ApiResponse<PagedResponse<FineResponse>>> => {
    return api.get(`/fines/user/${userId}`, { params: { page, size } })
  },
  getFineSummary: async (): Promise<ApiResponse<Record<string, number>>> => {
    return api.get('/fines/summary')
  },
}
