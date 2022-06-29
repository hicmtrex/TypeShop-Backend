"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderControllers_1 = require("../controllers/orderControllers");
const stripeController_1 = require("../controllers/stripeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').get(auth_1.auth, auth_1.admin, orderControllers_1.getOrderList).post(auth_1.auth, orderControllers_1.createOrder);
router.route('/stripe').post(stripeController_1.stripePay);
router.route('/orders-user').get(auth_1.auth, orderControllers_1.getUserOrder);
router
    .route('/:id')
    .get(auth_1.auth, orderControllers_1.getOrderById)
    .delete(auth_1.auth, orderControllers_1.deleteOrder)
    .put(auth_1.auth, orderControllers_1.payOrder);
exports.default = router;
