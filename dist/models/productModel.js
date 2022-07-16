"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
}, {
    timestamps: true,
});
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    qty: Number,
    reviews: [reviewSchema],
}, {
    timestamps: true,
});
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = Product;
