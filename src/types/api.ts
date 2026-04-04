export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Used by books (authresponse/PagedResponse.java)
export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

// Used by borrow/reservations (PageResponse.java)
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
