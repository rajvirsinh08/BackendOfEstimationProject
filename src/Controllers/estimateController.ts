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
      clientName,
      costType,
      estimatedHours,
      hourlyCost,
      totalCost,
      dueDate,
      additionalNotes,
      attachments,
    } = req.body;

    const developerId = req.user?.id;
    const createdBy = req.user?.email || req.user?.id;

    if (!developerId) {
      res.status(401).json({ success: false, message: "Unauthorized: Missing developer ID" });
      return;
    }

    // 🧮 Auto-calculate totalCost if costType is "Hourly"
    let finalTotalCost = totalCost;
    if (costType === "Hourly") {
      if (!estimatedHours || !hourlyCost) {
        res.status(400).json({ success: false, message: "Please provide estimated hours and hourly cost" });
        return;
      }
      finalTotalCost = estimatedHours * hourlyCost;
    }

    const newEstimate = new Estimate({
      projectName,
      projectType,
      description,
      techStack,
      clientName,
      costType,
      estimatedHours,
      hourlyCost,
      totalCost: finalTotalCost,
      dueDate,
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
// // 🔵 Approve or Decline Estimate (Admin Only)
export const updateEstimateStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { estimateId } = req.params;
    const { status, adminComment } = req.body;

    if (!["Approved", "Declined", "ReEdit"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Approved', 'Declined', or 'ReEdit'.",
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

    // 🟢 ReEdit requires admin comment
    if (status === "ReEdit") {
      if (!adminComment || adminComment.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Admin comment is required for ReEdit.",
        });
        return;
      }
      estimate.adminComment = adminComment;
    }

    // 🟠 Declined → clear any old comments
    if (status === "Declined") {
      estimate.adminComment = "";
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

// 🟢 Update all fields of an Estimate (Developer or Admin)
export const updateEstimateById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { estimateId } = req.params;

    const {
      projectName,
      projectType,
      description,
      techStack,
      clientName,
      costType,
      estimatedHours,
      hourlyCost,
      totalCost,
      dueDate,
      additionalNotes,
      attachments,
    } = req.body;

    const developerId = req.user?.id;

    if (!developerId) {
      res.status(401).json({ success: false, message: "Unauthorized: Missing developer ID" });
      return;
    }

    const estimate = await Estimate.findById(estimateId);
    if (!estimate) {
      res.status(404).json({ success: false, message: "Estimate not found." });
      return;
    }

    // 🧮 Recalculate total cost if costType = "Hourly"
    let finalTotalCost = totalCost;
    if (costType === "Hourly") {
      if (!estimatedHours || !hourlyCost) {
        res.status(400).json({
          success: false,
          message: "Please provide estimated hours and hourly cost.",
        });
        return;
      }
      finalTotalCost = estimatedHours * hourlyCost;
    }

    // 📝 Update all fields
    estimate.projectName = projectName || estimate.projectName;
    estimate.projectType = projectType || estimate.projectType;
    estimate.description = description || estimate.description;
    estimate.techStack = techStack || estimate.techStack;
    estimate.clientName = clientName || estimate.clientName;
    estimate.costType = costType || estimate.costType;
    estimate.estimatedHours = estimatedHours ?? estimate.estimatedHours;
    estimate.hourlyCost = hourlyCost ?? estimate.hourlyCost;
    estimate.totalCost = finalTotalCost ?? estimate.totalCost;
    estimate.dueDate = dueDate || estimate.dueDate;
    estimate.additionalNotes = additionalNotes || estimate.additionalNotes;
    estimate.attachments = attachments || estimate.attachments;
    estimate.status = "Pending"; // Reset to pending if re-edited

    const updatedEstimate = await estimate.save();

    res.status(200).json({
      success: true,
      message: "Estimate updated successfully.",
      data: updatedEstimate,
    });
  } catch (error) {
    console.error("Error updating estimate:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};