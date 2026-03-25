import apiClient from './client';
import type { ApiResponse, PagedResponse } from './auth';

export interface BookResponse {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationYear: number;
  category: string;
  subject: string;
  description: string;
  coverImage: string;
  location: string;
  totalCopies: number;
  availableCopies: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookAvailabilityResponse {
  bookId: number;
  title: string;
  isbn: string;
  author: string;
  totalCopiesAllBranches: number;
  availableCopiesAllBranches: number;
  branches: Array<{
    branchId: number;
    branchName: string;
    location: string;
    totalCopies: number;
    availableCopies: number;
    shelfLocation: string;
    isAvailable: boolean;
  }>;
}

export const booksApi = {
  getAll: async (params?: { 
    page?: number; 
    size?: number; 
    sortBy?: string; 
    sortDir?: string;
    title?: string;
    author?: string;
    category?: string;
    subject?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<BookResponse>>>('/books', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<BookResponse>>(`/books/${id}`);
    return response.data;
  },
  search: async (q: string, page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<BookResponse>>>(`/books/search?q=${q}&page=${page}&size=${size}`);
    return response.data;
  },
  getPopular: async () => {
    const response = await apiClient.get<ApiResponse<BookResponse[]>>('/books/popular');
    return response.data;
  },
  getTrending: async () => {
    const response = await apiClient.get<ApiResponse<BookResponse[]>>('/books/trending');
    return response.data;
  },
  getNewArrivals: async () => {
    const response = await apiClient.get<ApiResponse<BookResponse[]>>('/books/new-arrivals');
    return response.data;
  },
  getByCategory: async (category: string, page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<BookResponse>>>(`/books/category/${category}?page=${page}&size=${size}`);
    return response.data;
  },
  getAvailability: async (id: number) => {
    const response = await apiClient.get<ApiResponse<BookAvailabilityResponse>>(`/books/${id}/availability`);
    return response.data;
  },
  getReviews: async (id: number) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/books/${id}/reviews`);
    return response.data;
  },
  submitReview: async (id: number, data: { rating: number, reviewText: string }) => {
    const response = await apiClient.post<ApiResponse<any>>(`/books/${id}/reviews`, data);
    return response.data;
  },
};
