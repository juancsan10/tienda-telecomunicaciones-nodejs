// ============================================
// TYPES — Dominio: Tienda de Telecomunicaciones
// ============================================
export interface Product {
  id: number;
  name: string;
  category: string; // 'planes' | 'dispositivos' | 'accesorios' | 'lineas'
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
}

export type CreateProductDto = Omit<Product, 'id' | 'createdAt'>;
export type UpdateProductDto = Partial<CreateProductDto>;

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
}

export interface PaginationParams {
  page: number;
  limit: number;
}
