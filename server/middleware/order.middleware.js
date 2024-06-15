import { checkSchema } from "express-validator";
import OrdertModel from "../models/order.model.js";
import { ORDER_MESSAGE } from "../constants/message.js";
import { validator } from "../utils/validator.js";

export const createOrderValidator = validator(
  checkSchema(
    {
      products: {
        exists: {
          errorMessage: ORDER_MESSAGE.PRODUCTS_REQUIRED,
        },
      },
    },
    ["body"]
  )
);
