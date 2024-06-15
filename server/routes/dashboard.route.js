import { Router } from "express";
import { authenticationValidator } from "../middleware/authenticationValidator.js";
import { getCostController, getProductsSoldController, getRevenueChartController, getSalesController } from "../controller/dashboard.controller.js";


const dashboardRoute = Router();

dashboardRoute.get("/getsales", authenticationValidator, getSalesController)

dashboardRoute.get("/getcost", authenticationValidator, getCostController)

dashboardRoute.get("/productsold", authenticationValidator, getProductsSoldController)

dashboardRoute.get("/revenuedata", authenticationValidator, getRevenueChartController)
// customerRoute.post("/customer/new", createCustomerValidator, authenticationValidator, createCustomerController);

// customerRoute.get("/customer", authenticationValidator, getCustomerController);

// customerRoute.get("/customer/:id", authenticationValidator, getCustomerDetailController);

// customerRoute.put("/customer/:id", authenticationValidator, updateCustomerDetailController);

// customerRoute.patch("/customer/:id", authenticationValidator, deleteCustomerController);

export default dashboardRoute;