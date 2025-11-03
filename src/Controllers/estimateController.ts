import { Request, Response } from "express";
import Estimate from "../Models/Estimate";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { uploadToVercelBlob } from "../vercelBlobUpload";

interface AuthenticatedRequest extends Request {
  user?: any;
  file?: Express.Multer.File;
}

export const addEstimate = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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
      res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: Missing developer ID",
        });
      return;
    }

    // 🧮 Auto-calculate totalCost if costType is "Hourly"
    let finalTotalCost = totalCost;
    if (costType === "Hourly") {
      if (!estimatedHours || !hourlyCost) {
        res
          .status(400)
          .json({
            success: false,
            message: "Please provide estimated hours and hourly cost",
          });
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
export const getAllEstimates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const estimates = await Estimate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: estimates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDeveloperEstimates = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const developerId = req.user?.id || req.user?._id;

    if (!developerId) {
      res
        .status(400)
        .json({ success: false, message: "Developer ID not found in token" });
      return;
    }

    const estimates = await Estimate.find({ developerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, data: estimates });
  } catch (error) {
    console.error("Error fetching developer estimates:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// // 🔵 Approve or Decline Estimate (Admin Only)
// export const updateEstimateStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     const { estimateId } = req.params;
//     const { status, adminComment } = req.body;

//     if (!["Approved", "Declined", "ReEdit"].includes(status)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid status. Must be 'Approved', 'Declined', or 'ReEdit'.",
//       });
//       return;
//     }

//     const estimate = await Estimate.findById(estimateId);
//     if (!estimate) {
//       res.status(404).json({ success: false, message: "Estimate not found." });
//       return;
//     }

//     estimate.status = status;
//     estimate.approvedBy = req.user?.email || "Admin";

//     // 🟢 ReEdit requires admin comment
//     if (status === "ReEdit") {
//       if (!adminComment || adminComment.trim() === "") {
//         res.status(400).json({
//           success: false,
//           message: "Admin comment is required for ReEdit.",
//         });
//         return;
//       }
//       estimate.adminComment = adminComment;
//     }

//     // 🟠 Declined → clear any old comments
//     if (status === "Declined") {
//       estimate.adminComment = "";
//     }

//     await estimate.save();

//     res.status(200).json({
//       success: true,
//       message: `Estimate ${status.toLowerCase()} successfully.`,
//       data: estimate,
//     });
//   } catch (error) {
//     console.error("Error updating estimate status:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
// 🔵 Approve or Decline Estimate (Admin Only)
export const updateEstimateStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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

    // 🟢 When Admin approves → set paymentRequest to "Pending"
    if (status === "Approved") {
      estimate.paymentRequest = "Pending";
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
export const updateEstimateById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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
      res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: Missing developer ID",
        });
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

// 🔵 Developer triggers payment request
export const requestPayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { estimateId } = req.params;
    const developerId = req.user?.id;

    const estimate = await Estimate.findById(estimateId);
    if (!estimate) {
      res.status(404).json({ success: false, message: "Estimate not found." });
      return;
    }

    // Only allow payment request if project is approved
    if (estimate.status !== "Approved") {
      res
        .status(400)
        .json({
          success: false,
          message: "Payment request allowed only after approval.",
        });
      return;
    }

    // Prevent duplicate requests
    if (estimate.paymentRequest === "RequestToAdmin") {
      res
        .status(400)
        .json({
          success: false,
          message: "Payment request already sent to admin.",
        });
      return;
    }

    estimate.paymentRequest = "RequestToAdmin";
    await estimate.save();

    res.status(200).json({
      success: true,
      message: "Payment request sent to admin successfully.",
      data: estimate,
    });
  } catch (error) {
    console.error("Error requesting payment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// 🟢 Admin forwards payment request to accountant
export const forwardPaymentToAccountant = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { estimateId } = req.params;

    const estimate = await Estimate.findById(estimateId);
    if (!estimate) {
      res.status(404).json({ success: false, message: "Estimate not found." });
      return;
    }

    if (estimate.paymentRequest !== "RequestToAdmin") {
      res
        .status(400)
        .json({
          success: false,
          message: "No pending payment request from developer.",
        });
      return;
    }

    estimate.paymentRequest = "RequestToAccountant";
    await estimate.save();

    res.status(200).json({
      success: true,
      message: "Payment request forwarded to accountant successfully.",
      data: estimate,
    });
  } catch (error) {
    console.error("Error forwarding payment request:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const completePayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { estimateId } = req.params;
    const accountantEmail = req.user?.email;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Payment proof image is required" });
    }

    const estimate = await Estimate.findById(estimateId);
    if (!estimate) {
      return res
        .status(404)
        .json({ success: false, message: "Estimate not found" });
    }

    if (estimate.paymentRequest !== "RequestToAccountant") {
      return res
        .status(400)
        .json({ success: false, message: "Not ready for accountant payment" });
    }

    // ✅ Upload image to Vercel Blob
    const paymentImageUrl = await uploadToVercelBlob(file.path);

    // ✅ Generate PDF Receipt
    const pdfPath = path.join("uploads", `payment_${estimate._id}.pdf`);
    const doc = new PDFDocument({ margin: 30 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(18).text("Project Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Project Name: ${estimate.projectName}`);
    doc.text(`Client Name: ${estimate.clientName}`);
    doc.text(`Project Type: ${estimate.projectType}`);
    doc.text(`Tech Stack: ${estimate.techStack}`);
    doc.text(`Total Cost: ₹${estimate.totalCost}`);
    doc.text(`Paid By: ${accountantEmail}`);
    doc.text(`Payment Date: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.text("Payment Proof:");
    doc.image(file.path, { fit: [400, 300] });

    doc.end();

    await new Promise<void>((resolve) =>
      writeStream.on("finish", () => resolve())
    );

    // ✅ Upload PDF to Vercel Blob
    const pdfUrl = await uploadToVercelBlob(pdfPath);

    // 🗑️ Optional: remove local files after upload
    fs.unlinkSync(file.path);
    fs.unlinkSync(pdfPath);

    // ✅ Update DB
    estimate.paymentImage = paymentImageUrl;
    estimate.paymentPdf = pdfUrl;
    estimate.paidBy = accountantEmail;
    estimate.paymentDate = new Date();
    estimate.paymentRequest = "PaymentDone";
    await estimate.save();

    res.status(200).json({
      success: true,
      message: "Payment completed and receipt generated successfully.",
      data: estimate,
    });
  } catch (error) {
    console.error("Error completing payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
