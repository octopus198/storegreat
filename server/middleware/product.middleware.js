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
        },
        custom: {
            options: async (value) => {
                const product = await ProductModel.findOne({productName: value})
                if (product) {
                    throw new Error(PRODUCT_MESSAGE.PRODUCT_ALREADY_EXISTED);
                }
                return true;
            } 
        }
      }
    },
    ["body"]
  )
);

