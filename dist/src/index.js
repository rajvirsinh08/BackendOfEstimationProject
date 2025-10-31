"use strict";
// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import userRoutes from './Routes/userRoutes';
// import estimateRoute from './Routes/estimateRoutes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
// // Load environment variables
// dotenv.config();
// const app = express();
// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/estimate', estimateRoute);
// // MongoDB Connection
// const MONGO_URI = process.env.MONGO_URI as string;
// if (!MONGO_URI) {
//   console.error('MongoDB connection string is missing in the environment file.');
//   process.exit(1);
// }
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log('MongoDB connected successfully.'))
//   .catch((err) => {
//     console.error('MongoDB connection failed:', err.message);
//     process.exit(1);
//   });
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}.`);
// });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const estimateRoutes_1 = __importDefault(require("./Routes/estimateRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/estimate", estimateRoutes_1.default);
// Root route
app.get("/", (req, res) => {
    res.send("✅ Backend is live on Vercel!");
});
// -----------------------------
// MongoDB Connection Caching (for Serverless)
// -----------------------------
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
async function connectToDatabase() {
    if (cached.conn)
        return cached.conn;
    if (!cached.promise) {
        const opts = { bufferCommands: false };
        cached.promise = mongoose_1.default
            .connect(process.env.MONGO_URI || "", opts)
            .then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
// -----------------------------
// Local development (only runs on localhost)
// -----------------------------
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    connectToDatabase().then(() => {
        app.listen(PORT, () => console.log(`✅ Local server on port ${PORT}`));
    });
}
// -----------------------------
// Vercel Serverless Export
// -----------------------------
async function handler(req, res) {
    await connectToDatabase();
    return app(req, res);
}
