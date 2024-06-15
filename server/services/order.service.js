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

    try {
      // fetch existing order details
      const existingOrder = await OrderModel.findOne({ userID, _id: orderID });
  
      if (!existingOrder) {
        throw new Error(`Order with userID ${userID} and orderID ${orderID} not found`);
      }
  
      // check if there are any updates to apply
      if (Object.keys(updatedData).length === 0) {
        return existingOrder;
      }
  
      // handle product and variant removals
      if (updatedData.products && updatedData.products.length > 0) {
        // find products or variants in existing order not in updatedData
        const removedProducts = existingOrder.products.filter((existingProduct) => {
          return !updatedData.products.some((updatedProduct) =>
            existingProduct.productId.equals(updatedProduct.productId) &&
            (existingProduct.variantId ? existingProduct.variantId.equals(updatedProduct.variantId) : !existingProduct.variantId)
          );
        });
  
        // restore stock quantities for removed products or variants
        for (const removedProduct of removedProducts) {
          const product = await ProductModel.findOne({ _id: removedProduct.productId });
  
          if (!product) {
            throw new Error(`Product with ID ${removedProduct.productId} not found`);
          }
  
          if (removedProduct.variantId) {
            const variant = product.variants.find((v) => v._id.equals(removedProduct.variantId));
  
            if (!variant) {
              throw new Error(`Variant with ID ${removedProduct.variantId} not found in product ${removedProduct.productId}`);
            }
  
            variant.variantQuantity += removedProduct.quantity;
          } else {
            product.stockQuantity += removedProduct.quantity;
          }
  
          await product.save();
        }
      }
  
      // update existing products based on updatedData
      if (updatedData.products && updatedData.products.length > 0) {
        for (const updatedProduct of updatedData.products) {
          const { productId, variantId, quantity: updatedQuantity } = updatedProduct;
  
          let existingProduct = existingOrder.products.find(
            (p) =>
              p.productId.equals(updatedProduct.productId) &&
              (variantId
                ? p.variantId && p.variantId.equals(updatedProduct.variantId)
                : !p.variantId)
          );
  
          const product = await ProductModel.findOne({ _id: productId });
  
          if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
          }
  
          if (!existingProduct) {
            // handle case where product or variant is added
            if (variantId) {
              const variant = product.variants.find((v) => v._id.equals(variantId));
  
              if (!variant) {
                throw new Error(`Variant with ID ${variantId} not found in product ${productId}`);
              }
  
              variant.variantQuantity -= updatedQuantity;
            } else {
              product.stockQuantity -= updatedQuantity;
            }
  
            existingProduct = {
              productId: updatedProduct.productId,
              variantId: updatedProduct.variantId,
              quantity: updatedQuantity,
            };
  
            existingOrder.products.push(existingProduct);
          } else {
            // handle case where product or variant quantity is updated
            const currentQuantity = existingProduct.quantity;
            const quantityDifference = updatedQuantity - currentQuantity;
  
            if (variantId) {
              const variant = product.variants.find((v) => v._id.equals(variantId));
  
              if (!variant) {
                throw new Error(`Variant with ID ${variantId} not found in product ${productId}`);
              }
  
              variant.variantQuantity -= quantityDifference;
            } else {
              product.stockQuantity -= quantityDifference;
            }
  
            existingProduct.quantity = updatedQuantity;
          }
  
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
