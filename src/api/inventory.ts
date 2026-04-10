import api from "@/lib/api";

export interface InventoryRequest {
  bookId: number;
  branchId: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface InventoryResponse {
  id: number;
  bookId: number;
  branchId: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export const inventoryApi = {
  add: (request: InventoryRequest) => api.post<InventoryResponse>("/inventory", request),
  update: (id: number, request: Partial<InventoryRequest>) => api.put<InventoryResponse>(`/inventory/${id}`, request),
  delete: (id: number) => api.delete(`/inventory/${id}`),
};
