export interface Book {
  id: number;
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
  language: string;
  totalPages?: number;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
  averageRating: number;
  reviewCount: number;
  isFeatured?: boolean;
  featuredOrder?: number;
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
