import api from '@/lib/axios'
import type { LoginRequest, RegisterRequest, UserProfileResponse } from '../types'
import type { ApiResponse } from '@/types/api'
import type { AuthResponse } from '@/types/auth'

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/auth/login', data)
  },
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/auth/register', data)
  },
  getProfile: async (): Promise<UserProfileResponse> => {
    return api.get('/auth/profile')
  },
  updateProfile: async (data: Record<string, unknown>): Promise<ApiResponse<UserProfileResponse['data']>> => {
    return api.put('/auth/profile', data)
  },
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    return api.post('/auth/refresh-token', { refreshToken })
  },
  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    return api.post('/auth/forgot-password', { email })
  },
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    return api.post('/auth/reset-password', { token, newPassword })
  },
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    return api.put('/auth/change-password', { currentPassword, newPassword })
  },
  verifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    return api.get(`/auth/verify-email/${token}`)
  },
  logout: async () => {
    return api.post('/auth/logout')
  }
}
