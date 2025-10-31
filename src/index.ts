// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import userRoutes from './Routes/userRoutes';
// import estimateRoute from './Routes/estimateRoutes';

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
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { VercelRequest, VercelResponse } from "@vercel/node";

import userRoutes from "./Routes/userRoutes";
import estimateRoute from "./Routes/estimateRoutes";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/estimate", estimateRoute);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Backend is live on Vercel!");
});

// -----------------------------
// MongoDB Connection Caching (for Serverless)
// -----------------------------
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose
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
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase();
  return app(req, res);
}
