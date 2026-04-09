import api from '@/lib/api'
import type { ApiResponse, PagedResponse } from '@/types/api'

export interface NotificationResponse {
  id: number
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' | 'DUE_DATE' | 'FINE_ALERT' | 'RESERVATION_READY'
  isRead: boolean
  createdAt: string
}

export const notificationService = {
  getMy: async (): Promise<ApiResponse<PagedResponse<NotificationResponse>>> => {
    return api.get('/notifications/my')
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    return api.get('/notifications/unread-count')
  },

  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    return api.put(`/notifications/${id}/read`)
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return api.put('/notifications/read-all')
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/notifications/${id}`)
  }
}
