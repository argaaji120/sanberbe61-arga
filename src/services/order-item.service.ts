import OrderItemModel, { OrderItem } from '../models/order-item.model';
import OrderModel from '../models/order.model';

export const create = async (payload: OrderItem): Promise<OrderItem> => {
  const result = await OrderItemModel.create(payload);
  return result;
};
