import express from "express";
import { addEstimate, getAllEstimates, updateEstimateById, updateEstimateStatus } from "../Controllers/estimateController";
import { verifyAdmin, verifyToken } from "../Middleware/verifyToken";

const router = express.Router();

// POST - Add new project estimate
router.post("/add", verifyToken,addEstimate);

// GET - Admin: view all estimates
router.get("/", getAllEstimates);
router.patch("/:estimateId/updatestatus", verifyAdmin, updateEstimateStatus); // Admin only
router.put("/update/:estimateId", verifyToken, updateEstimateById);

export default router;
