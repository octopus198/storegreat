import { checkSchema } from "express-validator";
import UserModel from "../models/user.model.js";
import { MESSAGE } from "../constants/message.js";
import { validator } from "../utils/validator.js";
import bcrypt from "bcrypt";

export const registerValidator = validator(
  checkSchema(
    {
      username: {
        exists: {
          errorMessage: MESSAGE.USERNAME_REQUIRED,
        },
        custom: {
          options: async (value, { req }) => {
            const existingUser = await UserModel.findOne({ username: value });
            if (existingUser) {
              throw new Error(MESSAGE.USERNAME_TAKEN);
            }
            return true;
          },
        },
      },
      email: {
        isEmail: true,
        errorMessage: MESSAGE.EMAIL_INVALID,
        custom: {
          options: async (_, { req }) => {
            const user = await UserModel.findOne({ email: req.body.email });
            if (user) {
              throw new Error(MESSAGE.USER_EXISTED);
            }
            return true;
          },
        },
      },
      password: {
        trim: true,
        isLength: {
          options: { min: 8 },
          errorMessage: MESSAGE.PASSWORD_MINIMUM,
        },
      },
      confirm_password: {
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(MESSAGE.CONFIRM_PASSWORD_NOT_MATCH);
            }
            return true;
          },
        },
      },
    },
    ["body"]
  )
);

export const loginValidator = validator(
  checkSchema(
    {
      password: {
        trim: true,
        isLength: {
          options: { min: 8 },
          errorMessage: "Password must be at least 8 characters",
        },
        custom: {
          options: async (_, { req }) => {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) {
              throw new Error(MESSAGE.USER_DOES_NOT_EXIST);
            }
            const hashPassword = user.password;
            const match = await bcrypt.compare(password, hashPassword);
            if (!match) {
              throw new Error(MESSAGE.YOUR_PASSWORD_IS_INVALID);
            }
            req.user = user;
          },
        },
      },
      email: {
        isEmail: true,
        errorMessage: MESSAGE.YOUR_EMAIL_IS_INVALID,
      },
    },
    ["body"]
  )
);
