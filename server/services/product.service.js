import ProductModel from "../models/product.model.js";

class ProductService {
  async createProduct(productData) {
    const product = await ProductModel.create(productData);
    return product;
  }

  async getProduct(userID) {
    const products = await ProductModel.find({ userID });
    return products;
  }

  async getProductDetail(userID, productID) {
    const productDetail = await ProductModel.findOne({
      userID,
      _id: productID,
    });
    return productDetail;
  }

  async updateProductDetail(userID, productID, updatedData) {
    const existingProduct = await ProductModel.findOne({
      userID,
      _id: productID,
    });
    if (Object.keys(updatedData).length === 0) {
      return existingProduct;
    }
    Object.assign(existingProduct, updatedData);
    const updatedProduct = await existingProduct.save();

    return updatedProduct;
  }

  async deleteProduct(userID, productID) {
    const product = await ProductModel.findOne({ userID, _id: productID });
    if (!product) {
      throw new Error("Product not found");
    }
    product.deletedAt = new Date();
    await product.save();
    return product;
  }

  // check if product already exists
  async isProductNameAlreadyExist(userID, productName) {
    const product = await ProductModel.findOne({
      userID,
      productName,
      deletedAt: null,
    });
    if (product) {
      return true;
    }
    return false;
    // return !!product;
  }

  // check if product already exists for the update api (check for other documents)
  async isProductNameAlreadyExistUpdate(productId, userID, productName) {
    const product = await ProductModel.findOne({
      userID,
      productName,
      deletedAt: null,
    });
    if (product) {
      if (product._id != userID) {
        return false;
      }
    }
    return true;
  }
}

const productService = new ProductService();
export default productService;
