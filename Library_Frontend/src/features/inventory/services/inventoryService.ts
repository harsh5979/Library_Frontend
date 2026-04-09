import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { InventoryRequest, InventoryResponse } from '../types'

export const inventoryService = {
  getAll: async (): Promise<ApiResponse<InventoryResponse[]>> => {
    return api.get('/inventory')
  },
  getByBranch: async (id: number): Promise<ApiResponse<InventoryResponse[]>> => {
    return api.get(`/inventory/branch/${id}`)
  },
  create: async (data: InventoryRequest): Promise<ApiResponse<InventoryResponse>> => {
    return api.post('/inventory', data)
  },
  update: async (id: number, data: Partial<InventoryRequest>): Promise<ApiResponse<InventoryResponse>> => {
    return api.put(`/inventory/${id}`, data)
  },
  remove: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/inventory/${id}`)
  },
  updateCondition: async (id: number, condition: string): Promise<ApiResponse<InventoryResponse>> => {
    return api.put(`/inventory/${id}/condition`, null, { params: { condition } })
  },
  getLowStock: async (): Promise<ApiResponse<InventoryResponse[]>> => {
    return api.get('/inventory/low-stock')
  },
  getOutOfStock: async (): Promise<ApiResponse<InventoryResponse[]>> => {
    return api.get('/inventory/out-of-stock')
  },
}
