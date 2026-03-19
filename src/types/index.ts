export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  createdAt: string;
  updatedAt?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
