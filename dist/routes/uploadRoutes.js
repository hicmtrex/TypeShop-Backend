"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb('Images only!');
    }
}
const uploadImg = (0, multer_1.default)({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
// @desc    upload image
// @route   Post /api/image
// @access  Private
router.post('/image', uploadImg.single('image'), (req, res) => {
    var _a;
    res.send(`/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.path}`);
});
exports.default = router;
