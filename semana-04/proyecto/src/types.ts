export interface Product {
  id: number;
  name: string;
  category: string; // 'planes' | 'dispositivos' | 'accesorios' | 'lineas'
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
}

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  issues?: unknown[];
}
