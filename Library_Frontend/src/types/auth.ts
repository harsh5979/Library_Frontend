// Re-export from features/auth for backward compatibility
export type { Role, LoginRequest, RegisterRequest, UserProfileResponse, User } from '@/features/auth/types'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  userId: number
  fullName: string
  email: string
  role: import('@/features/auth/types').Role
  department?: string
  isEmailVerified: boolean
}
