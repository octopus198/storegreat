import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../middleware/user.middleware.js";
import {
  getMeController,
  loginController,
  registerController,
} from "../controller/user.controller.js";
import { authenticationValidator } from "../middleware/authenticationValidator.js";

const userRoute = Router();


userRoute.get("/getme", authenticationValidator, getMeController);

userRoute.post("/register", registerValidator, registerController);

userRoute.post("/login", loginValidator, loginController);

export default userRoute;
