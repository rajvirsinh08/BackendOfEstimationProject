"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const estimateController_1 = require("../Controllers/estimateController");
const verifyToken_1 = require("../Middleware/verifyToken");
const router = express_1.default.Router();
// POST - Add new project estimate
router.post("/add", verifyToken_1.verifyToken, estimateController_1.addEstimate);
// GET - Admin: view all estimates
router.get("/", estimateController_1.getAllEstimates);
router.patch("/:estimateId/updatestatus", verifyToken_1.verifyAdmin, estimateController_1.updateEstimateStatus); // Admin only
router.put("/update/:estimateId", verifyToken_1.verifyToken, estimateController_1.updateEstimateById);
// 🟢 GET - Developer: View their own estimates
router.get("/my-estimates", verifyToken_1.verifyToken, estimateController_1.getDeveloperEstimates);
exports.default = router;
