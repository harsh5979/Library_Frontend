import api from '@/lib/axios'
import type { User } from '@/types/user'
import type { ApiResponse, PagedResponse } from '@/types/api'

export const userService = {
  getAllUsers: async (page: number = 0, size: number = 50, role?: string): Promise<ApiResponse<PagedResponse<User>>> => {
    let url = `/users?page=${page}&size=${size}`
    if (role) url += `&role=${role}`
    return api.get(url)
  },

  searchUsers: async (searchTerm: string): Promise<ApiResponse<PagedResponse<User>>> => {
    return api.get(`/users/search?q=${searchTerm}`)
  },
  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    return api.get(`/users/${id}`)
  },
  createUser: async (data: Record<string, unknown>): Promise<ApiResponse<User>> => {
    return api.post('/users', data)
  },
  updateUser: async (id: number, data: Record<string, unknown>): Promise<ApiResponse<User>> => {
    return api.put(`/users/${id}`, data)
  },
  deactivateUser: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/users/${id}`)
  },
  changeRole: async (id: number, role: string): Promise<ApiResponse<User>> => {
    return api.put(`/users/${id}/role`, { role })
  },

  blockUser: async (id: number) => {
    return api.put(`/users/${id}/block`)
  },

  unblockUser: async (id: number) => {
    return api.put(`/users/${id}/unblock`)
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return api.get('/auth/profile')
  },
  getUserActivity: async (id: number): Promise<ApiResponse<User>> => {
    return api.get(`/users/${id}/activity`)
  },
  bulkImport: async (users: Record<string, unknown>[]): Promise<ApiResponse<void>> => {
    return api.post('/users/bulk-import', users)
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return api.put('/auth/profile', data)
  }
}
