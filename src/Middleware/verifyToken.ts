import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Extend Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user payload to request

    next(); // move to next middleware/route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
// 🟡 Verify Admin Only
export const verifyAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "Access denied. No token provided." });
      return;
    }

    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
    req.user = decoded;

    // Check admin role
    if (decoded.role !== "admin") {
      res.status(403).json({ success: false, message: "Access denied. Admins only." });
      return;
    }

    next();
  } catch (error) {
    console.error("Admin verification failed:", error);
    res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
};