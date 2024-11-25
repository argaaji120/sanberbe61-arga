import mongoose, { Types } from 'mongoose';

export enum OrderStatus {
  Pending = 'pending',
  Delivered = 'delivered',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface Order {
  grandTotal: number;
  status: OrderStatus;
  createdBy: Types.ObjectId;
  items: Types.ObjectId[];
  createdAt?: string;
  updatedAt?: string;
  _id?: Types.ObjectId;
}

const Schema = mongoose.Schema;

const OrderSchema = new Schema<Order>(
  {
    grandTotal: {
      type: Schema.Types.Number,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: OrderStatus,
      default: OrderStatus.Pending,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order_Items',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model('Orders', OrderSchema);

export default OrderModel;
