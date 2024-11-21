import ProductModel, { Product } from "../models/product.model";

export interface IFindAll {
    query?: unknown;
    limit: number;
    page: number;
}

export const create = async (payload: Product): Promise<Product> => {
    const result = await ProductModel.create(payload);
    return result;
};

export const findAll = async (query: any, limit: number = 10, page: number = 1): Promise<Product[]> => {
    const result = await ProductModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate("category");

    return result;
};

export const countDocuments = async (query: any): Promise<number> => {
    const result = await ProductModel.countDocuments(query);
    return result;
};

export const findOne = async (id: string): Promise<Product | null> => {
    const result = await ProductModel.findById(id);
    return result;
};

export const update = async (id: string, payload: Product): Promise<Product | null> => {
    const result = await ProductModel.findOneAndUpdate({ _id: id }, payload, { new: true });
    return result;
};

export const remove = async (id: string): Promise<Product | null> => {
    const result = await ProductModel.findOneAndDelete({ _id: id });
    return result;
};
