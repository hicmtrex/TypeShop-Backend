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
exports.stripePay = void 0;
const stripe_1 = __importDefault(require("stripe"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uid_generator_1 = __importDefault(require("uid-generator"));
const stripe = new stripe_1.default('sk_test_51KesRYH5cYomygyIffw08jlDMHy9ho25A2libjahdd0vIHGIrJJerzdJqztgKEPob11mgu4F4bUFVY4AaMmY0qBE006wASQ6SX', {
    apiVersion: '2020-08-27',
});
const uidgen = new uid_generator_1.default();
exports.stripePay = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, amount } = req.body;
    const idempotencyKey = yield uidgen.generate();
    return stripe.customers
        .create({
        email: token.email,
        source: token,
    })
        .then((customer) => {
        stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
        }, { idempotencyKey });
    })
        .then((result) => {
        res.status(200).json(result);
    });
}));
