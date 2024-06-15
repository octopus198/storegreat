import mongoose from "mongoose";
import Collections from "../constants/collection.js";

const customerSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: String,
    image: String,
    deletedAt: {
      type: Date,
      default: null,
    },
    creation_date: {
        type: Date,
        default: Date.now,
      },
  },
  { versionKey: false }
);

const CustomerModel = mongoose.model(Collections.CUSTOMER, customerSchema, "customer");
export default CustomerModel;
