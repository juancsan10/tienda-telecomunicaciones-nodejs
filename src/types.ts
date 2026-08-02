export interface Product {
  id: string;
  name: string;
  category: string; // 'planes' | 'dispositivos' | 'accesorios' | 'lineas'
  price: number;
  stock: number;
  active: boolean;
}

export interface ProductSummary {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: Product;
  cheapest: Product;
  categories: string[];
}

export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: ProductSummary;
  items: Product[];
}
