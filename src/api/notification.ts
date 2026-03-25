import apiClient from './client';
import type { ApiResponse, PagedResponse } from './auth';

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'DANGER' | 'DUE_DATE' | 'RESERVATION_READY' | 'FINE_ALERT';
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getMy: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<NotificationResponse>>>(`/notifications/my?page=${page}&size=${size}`);
    return response.data;
  },
  markAsRead: async (id: number) => {
    const response = await apiClient.put<ApiResponse<NotificationResponse>>(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await apiClient.put<ApiResponse<any>>('/notifications/read-all');
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<number>>('/notifications/unread-count');
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/notifications/${id}`);
    return response.data;
  },
};
