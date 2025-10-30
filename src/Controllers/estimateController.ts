import { Request, Response } from "express";
import Estimate from "../Models/Estimate";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const addEstimate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      projectName,
      projectType,
      description,
      techStack,
      features,
      totalScreens,
      estimatedDays,
      totalCost,
      startDate,
      endDate,
      additionalNotes,
      attachments,
    } = req.body;

    const developerId = req.user?.id;
    const createdBy = req.user?.email || req.user?.id;

    if (!developerId) {
      res.status(401).json({ success: false, message: "Unauthorized: Missing developer ID" });
      return;
    }

    const newEstimate = new Estimate({
      projectName,
      projectType,
      description,
      techStack,
      features,
      totalScreens,
      estimatedDays,
      totalCost,
      startDate,
      endDate,
      additionalNotes,
      attachments,
      createdBy,
      developerId,
      status: "Pending",
    });

    const savedEstimate = await newEstimate.save();

    res.status(201).json({
      success: true,
      message: "Project estimate added successfully",
      data: savedEstimate,
    });
  } catch (error) {
    console.error("Error adding estimate:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🟡 Get all estimates (Admin)
export const getAllEstimates = async (req: Request, res: Response): Promise<void> => {
  try {
    const estimates = await Estimate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: estimates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// 🔵 Approve or Decline Estimate (Admin Only)
export const updateEstimateStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { estimateId } = req.params;
    const { status, declineReason } = req.body; // 🟢 include reason

    if (!["Approved", "Rejected"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status value. Must be 'Approved' or 'Rejected'.",
      });
      return;
    }

    const estimate = await Estimate.findById(estimateId);
    if (!estimate) {
      res.status(404).json({ success: false, message: "Estimate not found." });
      return;
    }

    estimate.status = status;
    estimate.approvedBy = req.user?.email || "Admin";

    // 🟢 Save reason only when declined
    if (status === "Rejected") {
      if (!declineReason || declineReason.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Decline reason is required when rejecting an estimate.",
        });
        return;
      }
      estimate.declineReason = declineReason;
    }

    await estimate.save();

    res.status(200).json({
      success: true,
      message: `Estimate ${status.toLowerCase()} successfully.`,
      data: estimate,
    });
  } catch (error) {
    console.error("Error updating estimate status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
