import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// MODELO DE PRODUCT — dominio: Tienda de Telecomunicaciones
// ============================================================
// Mismo dominio usado en las semanas 05-08 del proyecto:
// catálogo de planes, dispositivos, accesorios y líneas.
// ============================================================

export type ProductCategory = 'planes' | 'dispositivos' | 'accesorios' | 'lineas';

export interface IProduct extends Document {
  name:        string;
  sku:         string;
  category:    ProductCategory;
  price:       number;
  stock:       number;
  active:      boolean;
  createdBy:   string;
  createdAt:   Date;
  updatedAt:   Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:      { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    sku:       { type: String, required: true, unique: true, trim: true, uppercase: true },
    category:  {
      type: String,
      enum: ['planes', 'dispositivos', 'accesorios', 'lineas'],
      required: true,
    },
    price:     { type: Number, required: true, min: 0 },
    stock:     { type: Number, required: true, min: 0, default: 0 },
    active:    { type: Boolean, default: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true },
);

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
