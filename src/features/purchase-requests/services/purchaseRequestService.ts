import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { PurchaseRequestRequest, PurchaseRequestResponse } from '../types'

export const purchaseRequestService = {
  getMyRequests: async (): Promise<ApiResponse<PurchaseRequestResponse[]>> => {
    return api.get('/purchase-requests/my')
  },
  create: async (data: PurchaseRequestRequest): Promise<ApiResponse<PurchaseRequestResponse>> => {
    return api.post('/purchase-requests', data)
  },
  getAll: async (): Promise<ApiResponse<PurchaseRequestResponse[]>> => {
    return api.get('/purchase-requests/all')
  },
  approve: async (id: number): Promise<ApiResponse<PurchaseRequestResponse>> => {
    return api.put(`/purchase-requests/${id}/approve`)
  },
  reject: async (id: number, reason: string): Promise<ApiResponse<PurchaseRequestResponse>> => {
    return api.put(`/purchase-requests/${id}/reject`, null, { params: { reason } })
  },
}
