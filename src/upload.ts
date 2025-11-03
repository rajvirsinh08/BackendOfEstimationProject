// import multer from "multer";

// // ✅ Use in-memory storage — compatible with Vercel serverless
// const storage = multer.memoryStorage();

// export const upload = multer({ storage });
import multer from "multer";

// ✅ Use memory storage — required for Vercel
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // optional: 10 MB limit
});
