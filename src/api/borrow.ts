import apiClient from './client';
import type { ApiResponse, PagedResponse } from './auth';

export interface BorrowResponse {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  userId: number;
  userName?: string;
  issueDate: string;
  returnDate: string;
  actualReturnDate: string | null;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  fine: number;
}

export const borrowApi = {
  issueBook: async (data: { bookId: number; userId: number }) => {
    const response = await apiClient.post<ApiResponse<BorrowResponse>>('/borrow/issue', data);
    return response.data;
  },
  returnBook: async (data: { transactionId: number }) => {
    const response = await apiClient.post<ApiResponse<BorrowResponse>>('/borrow/return', data);
    return response.data;
  },
  renewBook: async (id: number) => {
    const response = await apiClient.post<ApiResponse<BorrowResponse>>(`/borrow/renew/${id}`);
    return response.data;
  },
  getMyBorrowed: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<BorrowResponse>>>(`/borrow/my?page=${page}&size=${size}`);
    return response.data;
  },
  getMyHistory: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<BorrowResponse>>>(`/borrow/my/history?page=${page}&size=${size}`);
    return response.data;
  },
  getAllTransactions: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<BorrowResponse>>>(`/borrow/all?page=${page}&size=${size}`);
    return response.data;
  },
  getAllOverdue: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<BorrowResponse>>>(`/borrow/overdue?page=${page}&size=${size}`);
    return response.data;
  },
  markAsLost: async (id: number) => {
    const response = await apiClient.put<ApiResponse<BorrowResponse>>(`/borrow/${id}/lost`);
    return response.data;
  },
};
