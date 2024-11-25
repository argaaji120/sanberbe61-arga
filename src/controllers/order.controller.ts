import { Request, Response } from 'express';
import * as Yup from 'yup';
import { Order, OrderStatus } from '../models/order.model';

import {
  countUserOrders,
  findUserOrders,
  create as placeOrder,
} from '../services/order.service';

import {
  findOne as findProduct,
  update as updateProduct,
} from '../services/product.service';

import { create as createOrderItems } from '../services/order-item.service';
import { IPaginationQuery } from '../utils/interfaces';
import { IRequestWithUser } from '../middlewares/auth.middleware';
import { Types } from 'mongoose';

const createOrderItemsSchema = Yup.object().shape({
  productId: Yup.string().required('Product Id is required'),
  name: Yup.string().required(),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  quantity: Yup.number()
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1')
    .max(5, 'Quantity must not exceed 5'),
});

const createOrderSchema = Yup.object().shape({
  grandTotal: Yup.number()
    .required('Grand total is required')
    .positive('Grand total must be positive'),
  orderItems: Yup.array()
    .of(createOrderItemsSchema)
    .required('Order items are required')
    .min(1, 'Order items must be at least 1'),
});

export default {
  async create(req: IRequestWithUser, res: Response) {
    try {
      await createOrderSchema.validate(req.body);

      const userId = req.user?.id;

      if (userId === undefined) {
        return res.status(403).json({
          message: 'unable to place orders, you are unauthorized',
          data: null,
        });
      }

      const { orderItems } = req.body;

      let createdItems = [];

      for (const orderItem of orderItems) {
        const productId = orderItem.productId;
        const product = await findProduct(productId);

        if (!product) {
          throw new Error(`Product with ID ${productId} is not found`);
        }

        if (product.qty < orderItem.quantity) {
          throw new Error(`Product with ID ${productId} is out of stock`);
        }

        const createOrderItem = await createOrderItems({
          product: productId,
          price: product.price,
          quantity: orderItem.quantity,
          subTotal: orderItem.quantity * product.price,
        });

        product.qty = product.qty - orderItem.quantity;

        await updateProduct(productId, product);

        createdItems.push(createOrderItem);
      }

      const grandTotal = createdItems.reduce(
        (total, value) => total + value.subTotal,
        0
      );

      const items = createdItems.map((item) => {
        return new Types.ObjectId(item._id);
      });

      const order = await placeOrder({
        grandTotal: grandTotal,
        status: OrderStatus.Pending,
        createdBy: userId,
        items: items,
      });

      res.status(201).json({
        message: 'Success create order',
        data: order,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(422).json({
          message: 'The given data was invalid',
          error: error.errors,
        });
      }

      const err = error as Error;
      return res.status(500).json({
        message: 'Failed create order',
        error: err.message,
      });
    }
  },

  async findAll(req: IRequestWithUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (userId === undefined) {
        return res.status(403).json({
          message: 'unable to get orders, you are unauthorized',
          data: null,
        });
      }

      const { limit = 10, page = 1 } = req.query as unknown as IPaginationQuery;

      const result = await findUserOrders(userId.toString());
      const total = await countUserOrders(userId.toString());

      res.status(200).json({
        message: 'Success get all user order',
        page: +page,
        limit: +limit,
        total,
        totalPage: Math.ceil(total / limit),
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed get all user order',
        error: err.message,
      });
    }
  },
};
