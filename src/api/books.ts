import api from "@/lib/api";
import type { Book, BookRequest } from "@/types/book";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export const booksApi = {
  // Public Access
  getAll: (params?: any) => 
    api.get<ApiResponse<PagedResponse<Book>>>("/books", { params }),
  
  getById: (id: number) => 
    api.get<ApiResponse<Book>>(`/books/${id}`),

  search: (q: string, page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Book>>>("/books/search", { params: { q, page, size } }),

  getPopular: () =>
    api.get<ApiResponse<Book[]>>("/books/popular"),

  getTrending: () =>
    api.get<ApiResponse<Book[]>>("/books/trending"),

  getNewArrivals: () =>
    api.get<ApiResponse<Book[]>>("/books/new-arrivals"),

  getFeatured: () =>
    api.get<ApiResponse<Book[]>>("/books/featured"),

  setFeatured: (id: number, featured: boolean, order: number) =>
    api.patch<ApiResponse<Book>>(`/books/${id}/feature`, null, { params: { featured, order } }),

  getByCategory: (category: string, page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Book>>>(`/books/category/${category}`, { params: { page, size } }),

  // Librarian/Admin Access
  create: (data: BookRequest) =>
    api.post<ApiResponse<Book>>("/books", data),

  update: (id: number, data: BookRequest) =>
    api.put<ApiResponse<Book>>(`/books/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/books/${id}`),
};
