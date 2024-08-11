import { PRODUCT_MESSAGE } from "../constants/message.js";
import productService from "../services/product.service.js";

export const isProductNameAlreadyExist = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const { productName } = req.body; 
    const isExists = await productService.isProductNameAlreadyExist(userID, productName);
    res.json({ exists: isExists }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check product existence' });
    next(err)
  }
}

export const isProductNameAlreadyExistUpdateController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const { productName, productId } = req.body; 
    const isExists = await productService.isProductNameAlreadyExistUpdate(productId, userID, productName);
    res.json({ exists: isExists }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check product existence for update API' });
    next(err)
  }
}

export const createProductController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const productData = { userID, ...req.body };
    
    const newProduct = await productService.createProduct(productData);
    return res.json({
      message: PRODUCT_MESSAGE.CREATE_PRODUCT_SUCCESS,
      product: newProduct,
    });
  } catch (err) {
    console.log(err);
    console.log("createProductController error");
    next(err);
  }
};

export const getProductController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const products = await productService.getProduct(userID);
    return res.json(products);
  } catch (err) {
    throw new Error("Err getting products", err);
  }
};

export const getProductDetailController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const productID = req.params.id;
    const productDetail = await productService.getProductDetail(
      userID,
      productID
    );
    if (!productDetail) {
      return res.status(404).json({
        error: "Product not found",
      });
    }
    return res.json(productDetail);
  } catch (err) {
    throw new Error("Err getting product details", err);
  }
};

export const updateProductDetailController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const productID = req.params.id;
    const updatedData = req.body;

    const updatedProduct = await productService.updateProductDetail(
      userID,
      productID,
      updatedData
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }
    return res.json(updatedProduct);
  } catch (err) {
    throw new Error("Err updating product details", err);
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const productID = req.params.id;
    const deletedProduct = await productService.deleteProduct(userID, productID);
    res.json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct
    });
  } catch (error) {
    throw new Error("Err deleting product", error);
  }
}
