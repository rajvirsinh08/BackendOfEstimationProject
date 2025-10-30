import express from "express";
import { addEstimate, getAllEstimates, updateEstimateStatus } from "../Controllers/estimateController";
import { verifyAdmin, verifyToken } from "../Middleware/verifyToken";

const router = express.Router();

// POST - Add new project estimate
router.post("/add", verifyToken,addEstimate);

// GET - Admin: view all estimates
router.get("/", getAllEstimates);
router.patch("/:estimateId/updatestatus", verifyAdmin, updateEstimateStatus); // Admin only

export default router;
