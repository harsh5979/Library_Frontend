export interface BookResponse {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  year: number;
  category: string;
  subject: string;
  description: string;
  coverImageUrl: string;
  language: string;
  totalPages: number;
  totalCopies: number;
  availableCopies: number;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  featuredOrder: number;
  createdAt: string;
}

export interface BookRequest {
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  edition?: string;
  year?: number;
  category: string;
  subject?: string;
  description?: string;
  coverImageUrl?: string;
  language?: string;
  totalPages?: number;
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

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}
