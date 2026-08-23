export interface Product {
  id: number;
  name: string;
  category: string; // 'planes' | 'dispositivos' | 'accesorios' | 'lineas'
  price: number;
  stock: number;
  active: boolean;
}

export type CreateProductDto = Omit<Product, 'id'>;
export type UpdateProductDto = Partial<CreateProductDto>;
