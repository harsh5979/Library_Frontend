import api from "@/lib/api";

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
  title: string;
  author: string;
  borrowCount: number;
}

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  department?: string;
  phone?: string;
  lastLogin?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

export const adminService = {
  // Analytics Protocol
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    return api.get("/analytics/dashboard");
  },
  
  getPopularBooks: async (limit: number = 5): Promise<ApiResponse<PopularBook[]>> => {
    return api.get(`/analytics/popular-books?limit=${limit}`);
  },

  getBorrowingTrends: async (): Promise<ApiResponse<any>> => {
    return api.get("/analytics/borrowing-trends");
  },

  getMemberActivity: async (limit: number = 10): Promise<ApiResponse<any>> => {
    return api.get(`/analytics/member-activity?limit=${limit}`);
  },

  // User Governance Protocol
  getAllUsers: async (params: { page?: number; size?: number; role?: string } = {}): Promise<ApiResponse<PagedResponse<UserSummary>>> => {
    return api.get("/users", { params });
  },

  searchUsers: async (q: string, page = 0, size = 10): Promise<ApiResponse<PagedResponse<UserSummary>>> => {
    return api.get("/users/search", { params: { q, page, size } });
  },

  changeUserRole: async (id: number, role: string): Promise<ApiResponse<UserSummary>> => {
    return api.put(`/users/${id}/role`, { role });
  },

  blockUser: async (id: number): Promise<ApiResponse<void>> => {
    return api.put(`/users/${id}/block`);
  },

  unblockUser: async (id: number): Promise<ApiResponse<void>> => {
    return api.put(`/users/${id}/unblock`);
  },

  deactivateUser: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`/users/${id}`);
  }
};
