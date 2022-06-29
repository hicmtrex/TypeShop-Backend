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
exports.deleteUser = exports.promoteAdmin = exports.updatrUserProfile = exports.getUserBydId = exports.getUsersList = exports.login = exports.register = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = new userModel_1.default({ name, email, password });
    if (user) {
        const newUser = yield user.save();
        res.status(201).json(newUser);
    }
    else {
        res.status(500);
        throw new Error('user not found!');
    }
}));
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (user) {
        const match = yield bcryptjs_1.default.compare(password, user.password);
        if (match) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: (0, generateToken_1.default)(user === null || user === void 0 ? void 0 : user._id),
            });
        }
        else {
            res.status(500).json({ message: 'email or password wrong!' });
        }
    }
    else {
        res.status(500).json({ message: 'email not exist' });
    }
}));
exports.getUsersList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find({});
    if (users) {
        res.status(200).json(users);
    }
    else {
        res.status(500);
        throw new Error('users not found!');
    }
}));
exports.getUserBydId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(400);
        throw new Error('user not found!');
    }
}));
exports.updatrUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = yield userModel_1.default.findById(req.params.id);
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        if (password)
            user.password = password;
        yield user.save();
        res.status(200).json('user has been updated!');
    }
    else {
        res.status(400);
        throw new Error('user not found!');
    }
}));
exports.promoteAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    if (user) {
        user.isAdmin = true;
        yield user.save();
        res.status(200).json('user has been promoted to admin');
    }
    else {
        res.status(400);
        throw new Error('user not found!');
    }
}));
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    if (user) {
        yield user.remove();
        res.status(200).json('user has been deleted');
    }
    else {
        res.status(400);
        throw new Error('user not found!');
    }
}));
