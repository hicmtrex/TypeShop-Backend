"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').get(userControllers_1.getUsersList);
router
    .route('/:id')
    .get(userControllers_1.getUserBydId)
    .delete(auth_1.auth, auth_1.admin, userControllers_1.deleteUser)
    .put(auth_1.auth, userControllers_1.updatrUserProfile);
router.route('/register').post(userControllers_1.register);
router.route('/login').post(userControllers_1.login);
exports.default = router;
