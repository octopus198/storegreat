import { Router } from "express";
import { authenticationValidator } from "../middleware/authenticationValidator.js";
import { createCustomerValidator } from "../middleware/customer.middleware.js";
import { createCustomerController, deleteCustomerController, getCustomerController, getCustomerDetailController, updateCustomerDetailController } from "../controller/customer.controller.js";


const customerRoute = Router();

customerRoute.post("/customer/new", createCustomerValidator, authenticationValidator, createCustomerController);

customerRoute.get("/customer", authenticationValidator, getCustomerController);

customerRoute.get("/customer/:id", authenticationValidator, getCustomerDetailController);

customerRoute.put("/customer/:id", authenticationValidator, updateCustomerDetailController);

customerRoute.patch("/customer/:id", authenticationValidator, deleteCustomerController);

export default customerRoute;