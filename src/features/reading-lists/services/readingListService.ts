import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { ReadingListRequest, ReadingListResponse } from '../types'

export const readingListService = {
  getAllPublic: async (): Promise<ApiResponse<ReadingListResponse[]>> => {
    return api.get('/reading-lists')
  },
  getById: async (id: number): Promise<ApiResponse<ReadingListResponse>> => {
    return api.get(`/reading-lists/${id}`)
  },
  getMyLists: async (): Promise<ApiResponse<ReadingListResponse[]>> => {
    return api.get('/reading-lists/my')
  },
  create: async (data: ReadingListRequest): Promise<ApiResponse<ReadingListResponse>> => {
    return api.post('/reading-lists', data)
  },
  update: async (id: number, data: ReadingListRequest): Promise<ApiResponse<ReadingListResponse>> => {
    return api.put(`/reading-lists/${id}`, data)
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/reading-lists/${id}`)
  },
  addBook: async (id: number, bookId: number): Promise<ApiResponse<ReadingListResponse>> => {
    return api.post(`/reading-lists/${id}/books`, null, { params: { bookId } })
  },
  removeBook: async (id: number, bookId: number): Promise<ApiResponse<ReadingListResponse>> => {
    return api.delete(`/reading-lists/${id}/books/${bookId}`)
  },
}
