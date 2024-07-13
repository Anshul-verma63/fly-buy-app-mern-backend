import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getproductController,
  getSingleProductController,
  getPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  countProductController,
  productListController,
  searchProductController,
  similarProductController,
  productCategoryController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//Update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get product
router.get("/get-product", getproductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/get-photo/:pid", getPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filtering products
router.post("/product-filters", productFiltersController);

//product-count
router.get("/product-count", countProductController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product route
router.get("/similar-product/:pid/:cid", similarProductController);

// category wise product
router.get("/product-category/:slug", productCategoryController);

export default router;
