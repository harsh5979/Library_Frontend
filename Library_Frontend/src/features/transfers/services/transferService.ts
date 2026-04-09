import api from '@/lib/axios'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { CreateTransferRequest, TransferResponse } from '../types'

export const transferService = {
  create: async (data: CreateTransferRequest): Promise<ApiResponse<TransferResponse>> => {
    return api.post('/transfers', data)
  },
  getMyTransfers: async (page = 0, size = 10): Promise<ApiResponse<PagedResponse<TransferResponse>>> => {
    return api.get('/transfers/my', { params: { page, size } })
  },
  getOutgoing: async (branchId: number, page = 0, size = 10): Promise<ApiResponse<PagedResponse<TransferResponse>>> => {
    return api.get(`/transfers/outgoing/${branchId}`, { params: { page, size } })
  },
  getIncoming: async (branchId: number, page = 0, size = 10): Promise<ApiResponse<PagedResponse<TransferResponse>>> => {
    return api.get(`/transfers/incoming/${branchId}`, { params: { page, size } })
  },
  approve: async (id: number): Promise<ApiResponse<TransferResponse>> => {
    return api.put(`/transfers/${id}/approve`)
  },
  dispatch: async (id: number): Promise<ApiResponse<TransferResponse>> => {
    return api.put(`/transfers/${id}/dispatch`)
  },
  receive: async (id: number): Promise<ApiResponse<TransferResponse>> => {
    return api.put(`/transfers/${id}/receive`)
  },
  reject: async (id: number, reason: string): Promise<ApiResponse<TransferResponse>> => {
    return api.put(`/transfers/${id}/reject`, null, { params: { reason } })
  },
  getAll: async (page = 0, size = 10): Promise<ApiResponse<PagedResponse<TransferResponse>>> => {
    return api.get('/transfers/all', { params: { page, size } })
  },
  getById: async (id: number): Promise<ApiResponse<TransferResponse>> => {
    return api.get(`/transfers/${id}`)
  },
}
