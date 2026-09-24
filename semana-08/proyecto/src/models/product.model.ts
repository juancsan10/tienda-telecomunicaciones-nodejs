import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: 'planes' | 'dispositivos' | 'accesorios' | 'lineas';
  price: number;
  stock: number;
  active: boolean;
  createdBy: string; // user ID — no eliminar
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    category: {
      type: String,
      enum: ['planes', 'dispositivos', 'accesorios', 'lineas'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true }, // user ID
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
