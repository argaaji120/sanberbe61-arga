import mongoose, { Types } from "mongoose";

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface OrderItem {
    name: string;
    productId: Types.ObjectId;
    price: number;
    quantity: number;
}

export interface Order {
    grandTotal: number;
    status: OrderStatus;
    createdBy: Types.ObjectId;
    orderItems: OrderItem[];
    createdAt?: string;
    updatedAt?: string;
    _id?: Types.ObjectId;
}

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema<OrderItem>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
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
});

const OrderSchema = new Schema<Order>(
    {
        grandTotal: {
            type: Schema.Types.Number,
            required: true,
        },
        status: {
            type: Schema.Types.String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        orderItems: {
            type: [OrderItemSchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const OrderModel = mongoose.model("Orders", OrderSchema);

export default OrderModel;
