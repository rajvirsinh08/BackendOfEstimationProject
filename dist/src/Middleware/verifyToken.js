"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const verifyToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // attach user payload to request
        next(); // move to next middleware/route handler
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};
exports.verifyToken = verifyToken;
// 🟡 Verify Admin Only
const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ success: false, message: "Access denied. No token provided." });
            return;
        }
        // Decode token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        // Check admin role
        if (decoded.role !== "admin") {
            res.status(403).json({ success: false, message: "Access denied. Admins only." });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Admin verification failed:", error);
        res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};
exports.verifyAdmin = verifyAdmin;
