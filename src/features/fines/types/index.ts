import type { ApiResponse, PagedResponse } from '@/types/api'

export interface FineResponse {
  id: number
  user_id: number
  transaction_id: number
  days_overdue: number
  amount_per_day: number
  total_amount: number
  paid_amount: number
  status: string
  paid_at?: string | null
  created_at: string
}

export type FinePagedResponse = ApiResponse<PagedResponse<FineResponse>>
