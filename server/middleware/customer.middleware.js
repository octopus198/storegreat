import { checkSchema } from "express-validator";
import CustomerModel from "../models/customer.model.js";
import { CUSTOMER_MESSAGE } from "../constants/message.js";
import { validator } from "../utils/validator.js";

export const createCustomerValidator = validator(
  checkSchema(
    {
      name: {
        exists: {
          errorMessage: CUSTOMER_MESSAGE.NAME_REQUIRED,
        },
      },
    },
    ["body"]
  )
);
