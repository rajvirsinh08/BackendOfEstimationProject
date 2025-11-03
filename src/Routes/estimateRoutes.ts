// import express from "express";
// import { addEstimate, completePayment, forwardPaymentToAccountant, getAllEstimates, getDeveloperEstimates, requestPayment, updateEstimateById, updateEstimateStatus } from "../Controllers/estimateController";
// import { verifyAdmin, verifyToken } from "../Middleware/verifyToken";
// import { upload } from "../upload";

// const router = express.Router();

// // POST - Add new project estimate
// router.post("/add", verifyToken,addEstimate);

// // GET - Admin: view all estimates
// router.get("/", getAllEstimates);
// router.patch("/:estimateId/updatestatus", verifyAdmin, updateEstimateStatus); // Admin only
// router.put("/update/:estimateId", verifyToken, updateEstimateById);
// // 🟢 GET - Developer: View their own estimates
// router.get("/my-estimates", verifyToken, getDeveloperEstimates); 

// router.patch("/payment-request/:estimateId", verifyToken, requestPayment);


// router.patch("/forward-payment/:estimateId", verifyToken, forwardPaymentToAccountant);

// router.post("/payment/:estimateId", verifyToken, upload.single("file"), completePayment);

// export default router;
import express from "express";
import {
  addEstimate,
  completePayment,
  forwardPaymentToAccountant,
  getAllEstimates,
  getDeveloperEstimates,
  requestPayment,
  updateEstimateById,
  updateEstimateStatus,
} from "../Controllers/estimateController";
import { verifyAdmin, verifyToken } from "../Middleware/verifyToken";
import { upload } from "../upload";

const router = express.Router();

// ✅ Basic routes
router.post("/add", verifyToken, addEstimate);
router.get("/", getAllEstimates);
router.patch("/:estimateId/updatestatus", verifyAdmin, updateEstimateStatus);
router.put("/update/:estimateId", verifyToken, updateEstimateById);
router.get("/my-estimates", verifyToken, getDeveloperEstimates);
router.patch("/payment-request/:estimateId", verifyToken, requestPayment);
router.patch("/forward-payment/:estimateId", verifyToken, forwardPaymentToAccountant);

// ✅ File upload route (multer + verifyToken)
router.post("/payment/:estimateId", verifyToken, upload.single("file"), completePayment);

export default router;
