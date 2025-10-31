"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../Controllers/userController");
const router = express_1.default.Router();
// POST /api/users/signup
router.post('/signup', userController_1.signupUser);
router.post('/signin', userController_1.signinUser);
router.get('/all', userController_1.getAllUsers); // 🟢 New route
exports.default = router;
