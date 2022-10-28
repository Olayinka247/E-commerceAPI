import express from "express";
import orderModel from "./model.js";
import createError from "http-errors";
import { JWTMiddleware, adminOnlyMiddleware } from "../../auth/token.js";

const orderRouter = express.Router();

//CRUD ENDPOINTS

//GET MONTHLY INCOME
orderRouter.get(
  "/income",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );
    try {
      const income = await orderModel.aggregate([
        {
          $match: { createdAt: { $gte: previousMonth } },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.send(income);
    } catch (error) {
      next(error);
    }
  }
);

//Create Order
orderRouter.post("/", JWTMiddleware, async (req, res, next) => {
  try {
    const newOrder = new orderModel(req.body);
    const savedOrder = await newOrder.save();
    res.send(savedOrder);
  } catch (error) {
    next(error);
  }
});

// Modify order Admin only
orderRouter.put(
  "/:orderId",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        req.params.orderId,
        {
          $set: req.body,
        },
        { new: true, runValidators: true }
      );
      if (!updatedOrder) {
        next(
          createError(404, `Product with id ${req.params.orderId} not found!`)
        );
      } else {
        res.send(updatedOrder);
      }
    } catch (error) {
      next(error);
    }
  }
);

// //delete order
orderRouter.delete(
  "/:orderId",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      await orderModel.findByIdAndDelete(req.params.orderId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// // //GET User Orders
orderRouter.get("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const orders = await orderModel.find({ userId: req.params.userId });
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

// // GET ALL ORDERS admin
orderRouter.get(
  "/",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const orders = await orderModel.find();
      res.send(orders);
    } catch (error) {
      next(error);
    }
  }
);

export default orderRouter;
