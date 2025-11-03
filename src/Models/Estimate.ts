import mongoose, { Schema, Document } from "mongoose";

export interface IEstimate extends Document {
  projectName: string;
  projectType: string;
  description: string;
  techStack: string;
  clientName: string;
  costType: "Hourly" | "Fixed";
  estimatedHours?: number;
  hourlyCost?: number;
  totalCost: number;
  dueDate?: Date;
  additionalNotes?: string;
  attachments?: string[];
  status: "Pending" | "Approved" | "Declined" | "ReEdit";
  paymentRequest?: "Pending" | "RequestToAdmin" | "RequestToAccountant" | "PaymentDone";
  createdBy: string;
  developerId: string;
  approvedBy?: string;
  adminComment?: string;

    // 🧾 New fields
  paymentImage?: string;
  paymentPdf?: string;
  paidBy?: string;
  paymentDate?: Date;
}

const EstimateSchema = new Schema<IEstimate>(
  {
    projectName: { type: String, required: true },
    projectType: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: String, required: true },
    clientName: { type: String, required: true },
    costType: {
      type: String,
      enum: ["Hourly", "Fixed"],
      required: true,
    },
    estimatedHours: { type: Number },
    hourlyCost: { type: Number },
    totalCost: { type: Number, required: true },
    dueDate: { type: Date },
    additionalNotes: { type: String },
    attachments: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined", "ReEdit"],
      default: "Pending",
    },
    paymentRequest: {
      type: String,
      enum: ["Pending", "RequestToAdmin", "RequestToAccountant", "PaymentDone"],
      default: "Pending",
    },
    createdBy: { type: String, required: true },
    developerId: { type: String, required: true },
    approvedBy: { type: String },
    adminComment: { type: String, default: "" },

     // New
    paymentImage: { type: String },
    paymentPdf: { type: String },
    paidBy: { type: String },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IEstimate>("Estimate", EstimateSchema);
