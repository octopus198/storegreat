import { ORDER_MESSAGE } from "../constants/message.js";
import orderService from "../services/order.service.js";

export const createOrderController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const orderData = { userID, ...req.body };
    console.log(orderData);
    const newOrder = await orderService.createOrder(orderData);
    return res.json({
      message: ORDER_MESSAGE.CREATE_ORDER_SUCCESS,
      order: newOrder,
    });
  } catch (err) {
    console.log(err);
    console.log("createOrderController error");
    next(err);
  }
};

export const getOrderController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const orders = await orderService.getOrders(userID);
    console.log(orders)
    return res.json(orders);
  } catch (err) {
    throw new Error("Err getting orders", err);
  }
};

export const getLatestOrdersController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const orders = await orderService.getLatestOrders(userID);
    console.log(orders)
    return res.json(orders);
  } catch (err) {
    throw new Error("Err getting orders", err);
  }
};

export const getOrderDetailController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const orderID = req.params.id;
    const orderDetail = await orderService.getOrderDetail(
      userID,
      orderID
    );
    if (!orderDetail) {
      return res.status(404).json({
        error: "Order not found",
      });
    }
    return res.json(orderDetail);
  } catch (err) {
    throw new Error("Err getting order details", err);
  }
};

export const updateOrderDetailController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const orderID = req.params.id;
    const updatedData = req.body;
    console.log(orderID);
    const updatedOrder = await orderService.updateOrderDetail(
      userID,
      orderID,
      updatedData
    );
    console.log(updatedOrder);
    if (!updatedOrder) {
      return res.status(404).json({
        error: "Order not found",
      });
    }
    return res.json(updatedOrder);
  } catch (err) {
    throw new Error("Err updating order details", err);
  }
};

export const deleteOrderController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const orderID = req.params.id;
    const deletedOrder = await orderService.deleteOrder(userID, orderID);
    res.json({
      message: "Order deleted successfully",
      deletedOrder: deletedOrder
    });
  } catch (error) {
    throw new Error("Err deleting order", error);
  }
}
