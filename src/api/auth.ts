import apiClient from './client';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'STUDENT' | 'FACULTY' | 'LIBRARIAN' | 'SUPER_ADMIN';
  department?: string;
  enrollmentNo?: string;
  employeeId?: string;
  profileImage?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  memberSince?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'FACULTY' | 'LIBRARIAN' | 'SUPER_ADMIN';
  userId: number;
  department: string;
  isEmailVerified: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  department?: string;
  profileImage?: string;
}

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/register', data);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/logout');
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  },
  changePassword: async (data: any) => {
    const response = await apiClient.put<ApiResponse<any>>('/auth/change-password', data);
    return response.data;
  },
  getAllUsers: async (page = 0, size = 10, role?: string) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<User>>>('/users', { params: { page, size, role } });
    return response.data;
  },
  getUserById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },
  blockUser: async (id: number) => {
    const response = await apiClient.put<ApiResponse<any>>(`/users/${id}/block`);
    return response.data;
  },
  unblockUser: async (id: number) => {
    const response = await apiClient.put<ApiResponse<any>>(`/users/${id}/unblock`);
    return response.data;
  },
  searchUsers: async (q: string, page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<User>>>(`/users/search?q=${q}&page=${page}&size=${size}`);
    return response.data;
  },
};
