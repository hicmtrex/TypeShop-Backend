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
const db_1 = __importDefault(require("../config/db"));
const productModel_1 = __importDefault(require("../models/productModel"));
const products_1 = __importDefault(require("./products"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, db_1.default)();
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productModel_1.default.deleteMany();
        yield productModel_1.default.insertMany(products_1.default);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    }
    catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
});
importData();
