import type { Role } from '@/features/auth/types'

export interface AuthResponse {
  data: {
    accessToken: string
    refreshToken: string
    userId: number
    fullName: string
    email: string
    role: Role
  }
  success: boolean
  message: string
}
