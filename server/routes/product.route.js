import { Router } from "express";
import { createProductValidator } from "../middleware/product.middleware.js";
import { createProductController, deleteProductController, getProductController, getProductDetailController, isProductNameAlreadyExist, isProductNameAlreadyExistUpdateController, updateProductDetailController } from "../controller/product.controller.js";
import { authenticationValidator } from "../middleware/authenticationValidator.js";


const productRoute = Router();

productRoute.post("/product/new", createProductValidator, authenticationValidator, createProductController);

productRoute.get("/product", authenticationValidator, getProductController);

productRoute.get("/product/:id", authenticationValidator, getProductDetailController);

productRoute.patch("/product/:id", authenticationValidator, updateProductDetailController);

productRoute.patch("/product/delete/:id", authenticationValidator, deleteProductController);

productRoute.post("/product/new/isproductexists", authenticationValidator, isProductNameAlreadyExist);

productRoute.post("/product/update/isproductexists", authenticationValidator, isProductNameAlreadyExistUpdateController);

export default productRoute;