import mongoose, { Types } from 'mongoose';

export interface OrderItem {
  product: Types.ObjectId;
  price: number;
  quantity: number;
  subTotal: number;
  _id?: Types.ObjectId;
}

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema<OrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Products',
    required: true,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
  },
  subTotal: {
    type: Schema.Types.Number,
    required: true,
  },
});

const OrderItemModel = mongoose.model('Order_Items', OrderItemSchema);

export default OrderItemModel;
