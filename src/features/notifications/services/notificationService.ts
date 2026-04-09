import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { 
  NotificationResponse, 
  NotificationPagedResponse, 
  SendNotificationRequest 
} from '../types'

export const notificationService = {
  getMyNotifications: async (page = 0, size = 10): Promise<NotificationPagedResponse> => {
    return api.get('/notifications/my', { params: { page, size } })
  },

  markAsRead: async (id: number): Promise<ApiResponse<NotificationResponse>> => {
    return api.put(`/notifications/${id}/read`)
  },

  markAllAsRead: async (): Promise<ApiResponse<string>> => {
    return api.put('/notifications/read-all')
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    return api.delete(`/notifications/${id}`)
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    return api.get('/notifications/unread-count')
  },

  broadcast: async (data: SendNotificationRequest): Promise<ApiResponse<string>> => {
    return api.post('/notifications/broadcast', data)
  },

  sendToUser: async (data: SendNotificationRequest): Promise<ApiResponse<string>> => {
    return api.post('/notifications/send', data)
  }
}
