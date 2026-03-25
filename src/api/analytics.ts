import apiClient from './client';
import type { ApiResponse } from './auth';

export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  totalMembers: number;
  activeBorrowings: number;
  overdueBooks: number;
  totalFinesCollected: number;
  pendingFines: number;
}

export interface PopularBook {
  bookId: number;
  title: string;
  author: string;
  category: string;
  borrowCount: number;
}

export interface BorrowingTrend {
  month: string;
  count: number;
}

export interface BranchComparison {
  branchName: string;
  totalBooks: number;
  availableBooks: number;
  activeBorrowings: number;
}

export const analyticsApi = {
  getDashboard: async () => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/analytics/dashboard');
    return response.data;
  },
  getPopularBooks: async (limit = 10) => {
    const response = await apiClient.get<ApiResponse<PopularBook[]>>(`/analytics/popular-books?limit=${limit}`);
    return response.data;
  },
  getBorrowingTrends: async (year?: number) => {
    const response = await apiClient.get<ApiResponse<{ trends: BorrowingTrend[] }>>(`/analytics/borrowing-trends${year ? `?year=${year}` : ''}`);
    return response.data;
  },
  getBranchComparison: async () => {
    const response = await apiClient.get<ApiResponse<BranchComparison[]>>('/analytics/branch-comparison');
    return response.data;
  },
  getCategoryBreakdown: async () => {
    const response = await apiClient.get<ApiResponse<Array<{ category: string, count: number }>>>('/analytics/category-breakdown');
    return response.data;
  },
};
