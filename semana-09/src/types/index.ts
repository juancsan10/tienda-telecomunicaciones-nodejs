export type UserRole = 'user' | 'admin';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

// ============================================================
// Dominio: Tienda de Telecomunicaciones — recurso Product
// (mismo dominio usado en las semanas 05-08)
// ============================================================

export type ProductCategory = 'planes' | 'dispositivos' | 'accesorios' | 'lineas';

export interface CreateProductDto {
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stock?: number;
  active?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  sku?: string;
  category?: ProductCategory;
  price?: number;
  stock?: number;
  active?: boolean;
}
