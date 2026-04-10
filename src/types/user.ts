export type Role = 'SUPER_ADMIN' | 'LIBRARIAN' | 'FACULTY' | 'STUDENT'

export interface User {
  id: number
  username: string
  email: string
  fullName: string
  role: Role
  firstName?: string
  lastName?: string
  profileImage?: string
  phone?: string
  department?: string
  enrollmentNo?: string
  employeeId?: string
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  memberSince: string
}
