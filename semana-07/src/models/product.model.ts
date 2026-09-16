import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: 'planes' | 'dispositivos' | 'accesorios' | 'lineas';
  price: number;
  stock: number;
  active: boolean;
  addedBy: Types.ObjectId; // referencia al usuario que lo creó
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    sku: {
      type: String,
      required: [true, 'El SKU es requerido'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      enum: ['planes', 'dispositivos', 'accesorios', 'lineas'],
      required: [true, 'La categoría es requerida'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProduct>('Product', productSchema);
