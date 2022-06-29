"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.deleteOrder = exports.getOrderById = exports.payOrder = exports.getUserOrder = exports.getOrderList = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
exports.getOrderList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({});
    if (orders) {
        res.status(200).json(orders);
    }
    else {
        res.status(400);
        throw new Error('orders not found!');
    }
}));
exports.getUserOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({ user: req.user._id });
    if (orders) {
        res.status(200).json(orders);
    }
    else {
        res.status(400);
        throw new Error('orders not found!');
    }
}));
exports.payOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        const updatedOrder = yield order.save();
        res.status(200).json(updatedOrder);
    }
    else {
        res.status(400);
        throw new Error('orders not found!');
    }
}));
exports.getOrderById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        res.status(200).json(order);
    }
    else {
        res.status(400);
        throw new Error('order not found!');
    }
}));
exports.deleteOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (order) {
        yield order.remove();
        res.status(200).json('order has been deleted');
    }
    else {
        res.status(400);
        throw new Error('orders not found!');
    }
}));
exports.createOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItems, shippingAddress, totalPrice } = req.body;
    const order = new orderModel_1.default({
        cartItems,
        shippingAddress,
        totalPrice,
        user: req.user._id,
    });
    if (cartItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }
    if (order) {
        const newOrder = yield order.save();
        res.status(201).json(newOrder);
    }
    else {
        res.status(400);
        throw new Error('order not found!');
    }
}));
