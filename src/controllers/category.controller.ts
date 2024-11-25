import { Request, Response } from 'express';
import {
  create,
  findAll,
  findOne,
  update,
  remove,
  countDocuments,
} from '../services/category.service';
import { IPaginationQuery } from '../utils/interfaces';
import * as Yup from 'yup';

const createValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

export default {
  async create(req: Request, res: Response) {
    try {
      await createValidationSchema.validate(req.body);

      const result = await create(req.body);

      res.status(201).json({
        message: 'Success create category',
        data: result,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(422).json({
          message: 'Failed create category',
          data: error.errors,
        });
      } else {
        const err = error as Error;
        res.status(500).json({
          message: 'Failed create category',
          data: err.message,
        });
      }
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

      const total = await countDocuments(query);
      const result = await findAll(query, limit, page);

      res.status(200).json({
        message: 'Success get all category',
        page: +page, // + untuk convert ke number
        limit: +limit,
        total: total,
        totalPage: Math.ceil(total / limit),
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed get all category',
        data: err.message,
      });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const result = await findOne(req.params.id);
      res.status(200).json({
        message: 'Success get one category',
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed get one category',
        data: err.message,
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const result = await update(req.params.id, req.body);
      res.status(200).json({
        message: 'Success update category',
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed update category',
        data: err.message,
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const result = await remove(req.params.id);
      res.status(200).json({
        message: 'Success delete category',
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: 'Failed delete category',
        data: err.message,
      });
    }
  },
};
