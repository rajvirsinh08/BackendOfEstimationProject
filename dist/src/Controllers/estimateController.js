"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstimateById = exports.updateEstimateStatus = exports.getDeveloperEstimates = exports.getAllEstimates = exports.addEstimate = void 0;
const Estimate_1 = __importDefault(require("../Models/Estimate"));
const addEstimate = async (req, res) => {
    try {
        const { projectName, projectType, description, techStack, clientName, costType, estimatedHours, hourlyCost, totalCost, dueDate, additionalNotes, attachments, } = req.body;
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
        const newEstimate = new Estimate_1.default({
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
    }
    catch (error) {
        console.error("Error adding estimate:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.addEstimate = addEstimate;
// 🟡 Get all estimates (Admin)
const getAllEstimates = async (req, res) => {
    try {
        const estimates = await Estimate_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: estimates });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getAllEstimates = getAllEstimates;
const getDeveloperEstimates = async (req, res) => {
    try {
        const developerId = req.user?.id || req.user?._id;
        if (!developerId) {
            res.status(400).json({ success: false, message: "Developer ID not found in token" });
            return;
        }
        const estimates = await Estimate_1.default.find({ developerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: estimates });
    }
    catch (error) {
        console.error("Error fetching developer estimates:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getDeveloperEstimates = getDeveloperEstimates;
// // 🔵 Approve or Decline Estimate (Admin Only)
const updateEstimateStatus = async (req, res) => {
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
        const estimate = await Estimate_1.default.findById(estimateId);
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
    }
    catch (error) {
        console.error("Error updating estimate status:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.updateEstimateStatus = updateEstimateStatus;
// 🟢 Update all fields of an Estimate (Developer or Admin)
const updateEstimateById = async (req, res) => {
    try {
        const { estimateId } = req.params;
        const { projectName, projectType, description, techStack, clientName, costType, estimatedHours, hourlyCost, totalCost, dueDate, additionalNotes, attachments, } = req.body;
        const developerId = req.user?.id;
        if (!developerId) {
            res.status(401).json({ success: false, message: "Unauthorized: Missing developer ID" });
            return;
        }
        const estimate = await Estimate_1.default.findById(estimateId);
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
    }
    catch (error) {
        console.error("Error updating estimate:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.updateEstimateById = updateEstimateById;
