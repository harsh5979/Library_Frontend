import api from "@/lib/api";

export interface Reservation {
  id: number;
  userName: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  status: "PENDING" | "READY" | "COLLECTED" | "CANCELLED" | "EXPIRED";
  createdAt: string;
  expiryDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
}

export const reservationsApi = {
  getMy: () => api.get<ApiResponse<Reservation[]>>("/reservations/my"),
  
  create: (bookId: number) => api.post<ApiResponse<Reservation>>("/reservations", { bookId }),
  
  cancel: (id: number) => api.delete<ApiResponse<void>>(`/reservations/${id}`),

  // Admin Access
  getAll: (page = 0, size = 10) => 
    api.get<ApiResponse<PagedResponse<Reservation>>>("/reservations/all", { params: { page, size } }),

  approve: (id: number) => api.put<ApiResponse<Reservation>>(`/reservations/${id}/approve`),
  
  markReady: (id: number) => api.put<ApiResponse<Reservation>>(`/reservations/${id}/ready`),
  
  markCollected: (id: number) => api.put<ApiResponse<Reservation>>(`/reservations/${id}/collected`),
  
  expire: (id: number) => api.put<ApiResponse<Reservation>>(`/reservations/${id}/expire`),
};
