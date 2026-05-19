import api from '@/lib/axios'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { ReservationResponse } from '@/features/reservations/types'

export const reservationService = {
  create: async (data: { bookId: number; userId: number }): Promise<ApiResponse<ReservationResponse>> => {
    return api.post('/reservations', data)
  },
  getMyReservations: async (): Promise<ApiResponse<PagedResponse<ReservationResponse>>> => {
    return api.get('/reservations/my')
  },
  cancel: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/reservations/${id}`)
  }
}
