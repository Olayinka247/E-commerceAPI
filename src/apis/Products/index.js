import express from "express";
import productModel from "./model.js";
import createError from "http-errors";
import { JWTMiddleware, adminOnlyMiddleware } from "../../auth/token.js";

const productRouter = express.Router();

//CRUD ENDPOINTS
//Get All Products
productRouter.get("/", async (req, res, next) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;
    if (queryNew) {
      products = await productModel.find().sort({ createdAt: -1 }).limit(1);
    } else if (queryCategory) {
      products = await productModel.find({
        categories: {
          $in: [queryCategory],
        },
      });
    } else {
      products = await productModel.find();
    }
    res.send(products);
  } catch (error) {
    next(error);
  }
});

//Create Product
productRouter.post(
  "/",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newProduct = new productModel(req.body);
      const savedProduct = await newProduct.save();
      res.send(savedProduct);
    } catch (error) {
      next(error);
    }
  }
);

// Modify Product
productRouter.put(
  "/:productId",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(
        req.params.productId,
        {
          $set: req.body,
        },
        { new: true, runValidators: true }
      );
      if (!updatedProduct) {
        next(createError(404, `Product with id ${req.params} not found!`));
      } else {
        res.send(updatedProduct);
      }
    } catch (error) {
      next(error);
    }
  }
);

//delete product
productRouter.delete(
  "/:productId",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      await productModel.findByIdAndDelete(req.params.productId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

//GET Products
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await productModel.findById(req.params.productId);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

export default productRouter;
