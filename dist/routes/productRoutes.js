"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productControllers_1 = require("../controllers/productControllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').get(productControllers_1.getProductList).post(auth_1.auth, auth_1.admin, productControllers_1.createProduct);
router.route('/:id/reviews').post(auth_1.auth, productControllers_1.createReview);
router.route('/search').get(productControllers_1.getProductSearch);
router
    .route('/:id')
    .get(productControllers_1.getProductById)
    .put(auth_1.auth, auth_1.admin, productControllers_1.updateProduct)
    .delete(auth_1.auth, auth_1.admin, productControllers_1.deleteProduct);
exports.default = router;
