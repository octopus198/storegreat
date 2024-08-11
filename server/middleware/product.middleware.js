import { checkSchema } from "express-validator";
import ProductModel from "../models/product.model.js";
import { PRODUCT_MESSAGE } from "../constants/message.js";
import { validator } from "../utils/validator.js";

export const createProductValidator = validator(
  checkSchema(
    {
      productName: {
        exists: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_NAME_REQUIRED,
        }
      }
    },
    ["body"]
  )
);

