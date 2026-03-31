import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { DashboardStats, PopularBook, CategoryStat } from '../types'

export const adminService = {
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    return api.get('/analytics/dashboard')
  },
  getPopularBooks: async (limit: number = 5): Promise<ApiResponse<PopularBook[]>> => {
    return api.get(`/analytics/popular-books?limit=${limit}`)
  },
  getCategoryStats: async (): Promise<ApiResponse<CategoryStat[]>> => {
    return api.get('/analytics/category-breakdown')
  }
}
