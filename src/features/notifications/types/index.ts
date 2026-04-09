import type { ApiResponse, PagedResponse } from '@/types/api'

export interface NotificationResponse {
  id: number
  userId: number
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  readAt?: string | null
}

export interface SendNotificationRequest {
  userId?: number
  title: string
  message: string
  type: string
  sendEmail?: boolean
}

export type NotificationPagedResponse = ApiResponse<PagedResponse<NotificationResponse>>
