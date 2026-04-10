import type { BookResponse } from '@/features/books/types'

export interface ReadingListRequest {
  title: string
  subject: string
  semester?: string
  description?: string
  isPublic?: boolean
}

export interface ReadingListResponse {
  id: number
  facultyId: number
  facultyName: string
  title: string
  subject: string
  semester?: string
  description?: string
  isPublic: boolean
  bookCount: number
  books?: BookResponse[]
  createdAt: string
}
