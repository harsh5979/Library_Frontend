import apiClient from './client';
import type { ApiResponse, PagedResponse } from './auth';

export interface ReservationResponse {
  id: number;
  bookId: number;
  bookTitle: string;
  userId: number;
  status: 'PENDING' | 'APPROVED' | 'READY' | 'COLLECTED' | 'EXPIRED' | 'CANCELLED';
  reservationDate: string;
  expiryDate: string;
}

export const reservationApi = {
  create: async (data: { bookId: number; userId: number }) => {
    const response = await apiClient.post<ApiResponse<ReservationResponse>>('/reservations', data);
    return response.data;
  },
  getMy: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<ReservationResponse>>>(`/reservations/my?page=${page}&size=${size}`);
    return response.data;
  },
  cancel: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/reservations/${id}`);
    return response.data;
  },
};
