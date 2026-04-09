export type Role = 'SUPER_ADMIN' | 'LIBRARIAN' | 'FACULTY' | 'STUDENT'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  phone?: string
  role: Role
  department?: string
  enrollmentNo?: string
  employeeId?: string
  branchId?: number
}

export interface UserProfileResponse {
  data: {
    id: number
    fullName: string
    email: string
    role: Role
    phone?: string
    department?: string
    enrollmentNo?: string
    employeeId?: string
    profileImage?: string
    isActive: boolean
    isEmailVerified: boolean
    createdAt: string
    memberSince: string
  }
  success: boolean
  message: string
}

export interface User {
  id: number
  fullName: string
  email: string
  role: Role
  phone?: string
  department?: string
  enrollmentNo?: string
  employeeId?: string
  profileImage?: string
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  memberSince: string
}
