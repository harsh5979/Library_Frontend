import type { PageResponse } from '@/types/api';

export type ReservationStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'READY'
  | 'COLLECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export const RESERVATION_STATUS = {
  PENDING: 'PENDING' as const,
  APPROVED: 'APPROVED' as const,
  READY: 'READY' as const,
  COLLECTED: 'COLLECTED' as const,
  CANCELLED: 'CANCELLED' as const,
  EXPIRED: 'EXPIRED' as const,
};

export interface ReservationResponse {
  id: number;
  bookId: number;
  userId: number;
  bookName: string;
  userName: string;
  status: ReservationStatus;
  reservedAt: string;
  expiryDate?: string;
}

export interface CreateReservationRequest {
  bookId: number;
  userId?: number;
}

// Backend PageResponse uses 'page'/'size' (not 'pageNumber'/'pageSize')
export type ReservationPagedResponse = PageResponse<ReservationResponse>;
