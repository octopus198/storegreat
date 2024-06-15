import OrderModel from "../models/order.model.js";

class OrderService {
  async createOrder(orderData) {
    const order = await OrderModel.create(orderData);
    return order;
  }

  async getOrders(userID) {
    const orders = await OrderModel.find({ userID })
      .populate("customerId")
      .populate({
        path: "products.productId",
        model: "product",
      });
    // console.log(orders)
    // Manually populate variants
    // for (const order of orders) {
    //   for (const product of order.products) {
    //     if (product.productId) {
    //       const productDoc = await ProductModel.findById(product.productId);
    //       const variant = productDoc.variants.id(product.variantId); // id here is to query subdocument inside products
    //       product.variantId = variant;
    //     }
    //   }
    // }
    console.log(orders);

    return orders;
  }

  async getLatestOrders(userID) {
    const orders = await OrderModel.find({ userID })
      .sort({ creation_date: -1 }) 
      .limit(5)
      .populate("customerId")
      .populate({
        path: "products.productId",
        model: "product",
      });

    console.log(orders);
    return orders;
  }

  async getOrderDetail(userID, orderID) {
    const orderDetail = await OrderModel.findOne({
      userID,
      _id: orderID,
    });
    console.log(orderDetail);
    return orderDetail;
  }

  async updateOrderDetail(userID, orderID, updatedData) {
    const existingOrder = await OrderModel.findOne({
      userID,
      _id: orderID,
    });
    if (Object.keys(updatedData).length === 0) {
      return existingOrder;
    }
    Object.assign(existingOrder, updatedData);
    const updatedOrder = await existingOrder.save();

    return updatedOrder;
  }

  async deleteOrder(userID, orderID) {
    const order = await OrderModel.findOne({ userID, _id: orderID });
    if (!order) {
      throw new Error("Order not found");
    }
    order.deletedAt = new Date();
    await order.save();
    return order;
  }
}

const orderService = new OrderService();
export default orderService;
