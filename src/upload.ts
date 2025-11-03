// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });

// export const upload = multer({ storage });
import multer from "multer";

// ✅ Use in-memory storage — compatible with Vercel serverless
const storage = multer.memoryStorage();

export const upload = multer({ storage });
