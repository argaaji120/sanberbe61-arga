import { Request, Response } from 'express';
import {
  create,
  findAll,
  findOne,
  update,
  remove,
  countDocuments,
} from '../services/product.service';
import { IPaginationQuery } from '../utils/interfaces';
import * as Yup from 'yup';

const createValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  images: Yup.array().of(Yup.string()).required().min(1),
  price: Yup.number().required(),
  qty: Yup.number().required().min(1),
  category: Yup.string().required(),
});

export default {
  async create(req: Request, res: Response) {
    try {
      await createValidationSchema.validate(req.body);

      const result = await create(req.body);

      res.status(201).json({
        message: 'Success create product',
        data: result,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(422).json({
          message: 'The given data was invalid',
          error: error.errors,
        });
      }

      const err = error as Error;
      res.status(500).json({
        message: 'Failed create product',
        error: err.message,
      });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query = {};

      if (search) {
        Object.assign(query, {
          name: { $regex: search, $options: 'i' },
        });
      }

      const result = await findAll(query, limit, page);
      const total = await countDocuments(query);

      res.status(200).json({
        message: 'Success get all products',
        page: +page,
        limit: +limit,
        total,
        totalPage: Math.ceil(total / limit),
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed get all products',
        error: err.message,
      });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const result = await findOne(req.params?.id);
      res.status(200).json({
        message: 'Success get one product',
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed get one product',
        error: err.message,
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const result = await update(req.params?.id, req.body);
      res.status(200).json({
        message: 'Success update product',
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed update product',
        error: err.message,
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const result = await remove(req.params?.id);
      res.status(200).json({
        message: 'Success delete product',
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed delete product',
        error: err.message,
      });
    }
  },
};
