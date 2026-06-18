import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
  name: string;
  price: number;
  stock: number;
  durationMonths?: number;
  description?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: string[];
  image: string;
  variants: IProductVariant[];
  isActive: boolean;
  outputType?: string;
  outputValue?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  durationMonths: { type: Number },
  description: { type: String },
});

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: [String], default: [] },
  image: { type: String, required: true },
  variants: [ProductVariantSchema],
  isActive: { type: Boolean, default: true },
  outputType: { type: String, enum: ["text", "link", "file", "email"], default: "text" },
  outputValue: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);