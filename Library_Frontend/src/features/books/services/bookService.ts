import api from '@/lib/axios'
import type { BookResponse, BookAvailabilityResponse, BookRequest, ReviewResponse } from '../types'
import type { ApiResponse, PagedResponse } from '@/types/api'

export const bookService = {
  getAll: async (params?: { 
    page?: number; 
    size?: number; 
    sortBy?: string; 
    sortDir?: string;
    title?: string;
    author?: string;
    category?: string;
    subject?: string;
  }): Promise<ApiResponse<PagedResponse<BookResponse>>> => {
    return api.get('/books', { params });
  },
  getById: async (id: number): Promise<ApiResponse<BookResponse>> => {
    return api.get(`/books/${id}`);
  },
  getByCategory: async (category: string, page = 0, size = 10): Promise<ApiResponse<PagedResponse<BookResponse>>> => {
    return api.get(`/books/category/${category}`, { params: { page, size } });
  },
  search: async (q: string, page = 0, size = 10): Promise<ApiResponse<PagedResponse<BookResponse>>> => {
    return api.get(`/books/search?q=${q}&page=${page}&size=${size}`);
  },
  getPopular: async (): Promise<ApiResponse<BookResponse[]>> => {
    return api.get('/books/popular');
  },
  getTrending: async (): Promise<ApiResponse<BookResponse[]>> => {
    return api.get('/books/trending');
  },
  getNewArrivals: async (): Promise<ApiResponse<BookResponse[]>> => {
    return api.get('/books/new-arrivals');
  },
  getAvailability: async (id: number): Promise<ApiResponse<BookAvailabilityResponse>> => {
    return api.get(`/books/${id}/availability`);
  },
  getReviews: async (id: number): Promise<ApiResponse<ReviewResponse[]>> => {
    return api.get(`/books/${id}/reviews`);
  },
  submitReview: async (id: number, data: { rating: number, reviewText: string }): Promise<ApiResponse<ReviewResponse>> => {
    return api.post(`/books/${id}/reviews`, data);
  },
  createBook: async (data: BookRequest): Promise<ApiResponse<BookResponse>> => {
    return api.post('/books', data);
  },
  updateBook: async (id: number, data: BookRequest): Promise<ApiResponse<BookResponse>> => {
    return api.put(`/books/${id}`, data);
  },
  deleteBook: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/books/${id}`);
  },
  updateReview: async (bookId: number, reviewId: number, data: { rating: number; reviewText: string }): Promise<ApiResponse<ReviewResponse>> => {
    return api.put(`/books/${bookId}/reviews/${reviewId}`, data);
  },
  deleteReview: async (bookId: number, reviewId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/books/${bookId}/reviews/${reviewId}`);
  },
}
