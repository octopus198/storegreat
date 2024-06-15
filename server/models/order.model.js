import mongoose from "mongoose";
import Collections from "../constants/collection.js";

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        variantId: { type: mongoose.Schema.Types.ObjectId },
        quantity: { type: Number },
      },
    ],
    amount: Number,
    cost: Number,
    status: {
      type: String,
      enum: ["pending", "paid"],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    creation_date: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const OrderModel = mongoose.model(Collections.ORDER, orderSchema, "order");
export default OrderModel;
