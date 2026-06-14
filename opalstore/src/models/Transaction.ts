import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  orderId: string;
  userId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  whatsappNumber: string;
  email: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  midtransToken?: string;
  midtransStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  variantName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true, default: 'pending', enum: ['pending', 'success', 'failed', 'cancelled'] },
  midtransToken: { type: String },
  midtransStatus: { type: String },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
