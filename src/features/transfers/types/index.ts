export interface CreateTransferRequest {
  book_id: number
  from_branch_id: number
  to_branch_id: number
  requested_by: number
  notes?: string
}

export interface TransferResponse {
  id: number
  book_id: number
  book_name: string
  from_branch_id: number
  from_branch_name: string
  to_branch_id: number
  to_branch_name: string
  requested_by: number
  approved_by?: number | null
  status: string
  request_date: string
  completion_date?: string | null
  notes?: string | null
}
