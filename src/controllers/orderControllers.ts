import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";

// @desc    get all orders
// @route   Get /api/orders
// @access  Admin

export const getOrderList = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find({}).sort("-createdAt");

    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(400);
      throw new Error("orders not found!");
    }
  }
);

// @desc    get user orders
// @route   Get /api/orders/orders-user
// @access  Private

export const getUserOrder = asyncHandler(async (req: any, res: Response) => {
  const orders = await Order.find({ user: req.user._id });

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(400);
    throw new Error("orders not found!");
  }
});

// @desc    Pay order
// @route   Put /api/orders/:id
// @access  Private

export const payOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(400);
    throw new Error("orders not found!");
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(400);
      throw new Error("order not found!");
    }
  }
);

// @desc    delete user order
// @route   Delete /api/orders/:id
// @access  Private

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.status(200).json("order has been deleted");
  } else {
    res.status(400);
    throw new Error("orders not found!");
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

export const createOrder = asyncHandler(async (req: any, res: Response) => {
  const { cartItems, shippingAddress, totalPrice } = req.body;

  const order = new Order({
    cartItems,
    shippingAddress,
    totalPrice,
    user: req.user._id,
  });

  if (cartItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  if (order) {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } else {
    res.status(400);
    throw new Error("order not found!");
  }
});
