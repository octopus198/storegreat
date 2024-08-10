import { Router } from "express";
import { authenticationValidator } from "../middleware/authenticationValidator.js";
import { getCostController, getProductsSoldController, getRevenueChartController, getSalesController } from "../controller/dashboard.controller.js";


const dashboardRoute = Router();

dashboardRoute.get("/getsales", authenticationValidator, getSalesController)

dashboardRoute.get("/getcost", authenticationValidator, getCostController)

dashboardRoute.get("/productsold", authenticationValidator, getProductsSoldController)

dashboardRoute.get("/revenuedata", authenticationValidator, getRevenueChartController)

export default dashboardRoute;