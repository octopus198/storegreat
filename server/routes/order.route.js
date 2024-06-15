import { Router } from "express";
import { authenticationValidator } from "../middleware/authenticationValidator.js";
import { createOrderValidator } from "../middleware/order.middleware.js";
import { createOrderController, deleteOrderController, getLatestOrdersController, getOrderController, getOrderDetailController, updateOrderDetailController } from "../controller/order.controller.js";


const orderRoute = Router();

orderRoute.post("/order/new", createOrderValidator, authenticationValidator, createOrderController);

orderRoute.get("/order", authenticationValidator, getOrderController);

orderRoute.get("/latestorder", authenticationValidator, getLatestOrdersController);

orderRoute.get("/order/:id", authenticationValidator, getOrderDetailController);

orderRoute.put("/order/:id", authenticationValidator, updateOrderDetailController);

orderRoute.patch("/order/:id", authenticationValidator, deleteOrderController);

export default orderRoute;