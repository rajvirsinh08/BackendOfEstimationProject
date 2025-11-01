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
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes";
import estimateRoute from "./Routes/estimateRoutes";

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("🚀 Backend API is running successfully!");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/estimate", estimateRoute);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("❌ MongoDB connection string is missing in .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Local development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// Export app for Vercel
export default app;
