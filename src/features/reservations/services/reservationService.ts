import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { 
  ReservationResponse, 
  CreateReservationRequest, 
  ReservationPagedResponse 
} from '../types'

export const reservationService = {
  create: async (request: CreateReservationRequest): Promise<ApiResponse<ReservationResponse>> => {
    return api.post('/reservations', request);
  },

  getMy: async (page = 0, size = 10): Promise<ApiResponse<ReservationPagedResponse>> => {
    return api.get('/reservations/my', { params: { page, size } });
  },

  cancel: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/reservations/${id}`);
  },

  getAll: async (page = 0, size = 10): Promise<ApiResponse<ReservationPagedResponse>> => {
    return api.get('/reservations/all', { params: { page, size } });
  },

  getPendingByBranch: async (branchId: number, page = 0, size = 10): Promise<ApiResponse<ReservationPagedResponse>> => {
    return api.get('/reservations/pending', { params: { branchId, page, size } });
  },

  approve: async (id: number): Promise<ApiResponse<ReservationResponse>> => {
    return api.put(`/reservations/${id}/approve`);
  },

  markReady: async (id: number): Promise<ApiResponse<ReservationResponse>> => {
    return api.put(`/reservations/${id}/ready`);
  },

  markCollected: async (id: number): Promise<ApiResponse<ReservationResponse>> => {
    return api.put(`/reservations/${id}/collected`);
  },

  expire: async (id: number): Promise<ApiResponse<ReservationResponse>> => {
    return api.put(`/reservations/${id}/expire`);
  },

  getByBook: async (bookId: number, page = 0, size = 10): Promise<ApiResponse<ReservationPagedResponse>> => {
    return api.get(`/reservations/book/${bookId}`, { params: { page, size } });
  }
}
