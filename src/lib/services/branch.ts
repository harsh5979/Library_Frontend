import api from "@/lib/api";

export interface BranchResponse {
  id: number;
  name: string;
  location: string;
  department: string;
  phone: string;
  email?: string;
  isActive: boolean;
  totalBooks?: number;
  availableBooks?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const branchService = {
  getAllBranches: async (): Promise<ApiResponse<BranchResponse[]>> => {
    return api.get("/branches");
  },
  getBranchById: async (id: number): Promise<ApiResponse<BranchResponse>> => {
    return api.get(`/branches/${id}`);
  },
};
