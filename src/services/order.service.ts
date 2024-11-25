import OrderModel, { Order, OrderStatus } from '../models/order.model';

export const create = async (payload: Order): Promise<Order> => {
  const result = await OrderModel.create(payload);
  return result;
};

export const countUserOrders = async (userId: string): Promise<number> => {
  const result = await OrderModel.countDocuments({ createdBy: userId });
  return result;
};

export const findUserOrders = async (
  userId: string,
  limit: number = 10,
  page: number = 1
): Promise<Order[]> => {
  const result = await OrderModel.find({ createdBy: userId })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .populate('createdBy', '_id email fullName')
    .populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Products',
        select: '_id name description images',
      },
    });

  return result;
};
