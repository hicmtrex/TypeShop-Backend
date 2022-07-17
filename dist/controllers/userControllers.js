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
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!email ||
        !email.includes('@') ||
        !name ||
        name.trim() === '' ||
        !password ||
        password.trim() === '') {
        res.status(422).json({ message: 'Invalid input.' });
        return;
    }
    const exist = yield userModel_1.default.findOne({ email });
    if (exist) {
        res.status(422).json({ message: 'email already been used!' });
        return;
    }
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
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !email.includes('@') || !password || password.trim() === '') {
        res.status(422).json({ message: 'Invalid input.' });
        return;
    }
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
// @desc    Get all users
// @route   Get /api/users
// @access  Admin
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
// @desc    Get single user
// @route   Get /api/users/:id
// @access  Private
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
// @desc    update user profile
// @route   Put /api/users/:id
// @access  Private
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
// @desc    promote user to admin
// @route   Post /api/users/promote/:id
// @access  Admin
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
// @desc    delete user
// @route   Delete /api/users/:id
// @access  Admin
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
