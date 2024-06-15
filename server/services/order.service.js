import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

class OrderService {
  async createOrder(orderData) {
    const order = await OrderModel.create(orderData);
    for (const productData of orderData.products) {
      const { productId, variantId, quantity } = productData;
      // find product
      const product = await ProductModel.findOne({ _id: productId });
      console.log("product is", product);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      if (variantId) {
        // if product has variant, find variant
        const variant = product.variants.find((v) => v._id.equals(variantId));
        if (!variant) {
          throw new Error(
            `Variant with ID ${variantId} not found in product ${productId}`
          );
        }
        // update variant quantity
        variant.variantQuantity -= quantity;
      } else {
        // if no variant, update the product's stock quantity
        product.stockQuantity -= quantity;
      }
      // save the updated product document
      await product.save();
    }
    return order;
  }

  async getOrders(userID) {
    const orders = await OrderModel.find({ userID })
      .populate("customerId")
      .populate({
        path: "products.productId",
        model: "product",
      });
    console.log(orders);

    return orders;
  }

  async getLatestOrders(userID) {
    const orders = await OrderModel.find({ userID, deletedAt: null })
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
    }).populate("customerId");
    console.log(orderDetail);
    return orderDetail;
  }

  async updateOrderDetail(userID, orderID, updatedData) {
    // const existingOrder = await OrderModel.findOne({
    //   userID,
    //   _id: orderID,
    // });
    // if (Object.keys(updatedData).length === 0) {
    //   return existingOrder;
    // }
    // Object.assign(existingOrder, updatedData);
    // const updatedOrder = await existingOrder.save();

    // return updatedOrder;

    try {
      // fetch existing order details
      const existingOrder = await OrderModel.findOne({ userID, _id: orderID });

      if (!existingOrder) {
        throw new Error(
          `Order with userID ${userID} and orderID ${orderID} not found`
        );
      }

      // Check if there are any updates to apply
      if (Object.keys(updatedData).length === 0) {
        return existingOrder;
      }

      // If we have products data to update
      if (updatedData.products && updatedData.products.length > 0) {
        for (const updatedProduct of updatedData.products) {
          const {
            productId,
            variantId,
            quantity: updatedQuantity,
          } = updatedProduct;

          // Find the matching product and variant in the existing order
          const existingProduct = existingOrder.products.find(
            (p) =>
              p.productId.equals(updatedProduct.productId) &&
              (variantId
                ? p.variantId && p.variantId.equals(updatedProduct.variantId)
                : !p.variantId)
          );

          if (!existingProduct) {
            throw new Error(
              `Product with ID ${productId} and variant ID ${variantId} not found in order`
            );
          }

          const currentQuantity = existingProduct.quantity;
          const quantityDifference = updatedQuantity - currentQuantity;

          // Find the product in the ProductModel
          const product = await ProductModel.findOne({ _id: productId });

          if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
          }

          if (variantId) {
            // Find and update the variant quantity
            const variant = product.variants.find((v) =>
              v._id.equals(variantId)
            );

            if (!variant) {
              throw new Error(
                `Variant with ID ${variantId} not found in product ${productId}`
              );
            }

            variant.variantQuantity -= quantityDifference;
          } else {
            // Update the product stock quantity
            product.stockQuantity -= quantityDifference;
          }

          // Update existing order product quantity
          existingProduct.quantity = updatedQuantity;

          // Save the updated product
          await product.save();
        }
      }

      // update the rest of the order data
      Object.assign(existingOrder, updatedData);

      // save and return the updated order
      const updatedOrder = await existingOrder.save();
      return updatedOrder;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
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
