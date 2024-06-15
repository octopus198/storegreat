import mongoose from "mongoose";
import Collections from "../constants/collection.js";

const productSchema = new mongoose.Schema(
  {
    productName: String,
    productDescription: String,
    brand: String,
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    imageURL: [String],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    stockQuantity: Number,
    retailPrice: Number,
    COGS: Number,
    hasVariants: {
      type: Boolean,
      default: false
    },
    variants: [
      {
        variantName: String,
        variantPrice: Number,
        variantQuantity: Number,
        variantCOGS: Number,
      },
    ],
    creation_date: {
      type: Date,
      default: Date.now,
    },
    warehouse_enter_date: Date,
    exp_date: Date,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { versionKey: false }
);

const ProductModel = mongoose.model(
  Collections.PRODUCT,
  productSchema,
  "product"
);
export default ProductModel;
