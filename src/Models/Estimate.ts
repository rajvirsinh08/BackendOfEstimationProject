import mongoose, { Schema, Document } from "mongoose";

export interface IEstimate extends Document {
  projectName: string;
  projectType: string;
  description: string;
  techStack: string;
  features: string[]; // ✅ changed
  totalScreens: number;
  estimatedDays: number;
  totalCost: number;
  startDate?: Date;
  endDate?: Date;
  additionalNotes?: string;
  attachments?: string[]; // ✅ changed
  status: "Pending" | "Approved" | "Rejected";
  createdBy: string;
  developerId: string;
  approvedBy?: string;
    declineReason?: string; // 🟢 new

}

const EstimateSchema = new Schema<IEstimate>(
  {
    projectName: { type: String, required: true },
    projectType: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: String, required: true },
    features: { type: [String], required: true }, // ✅
    totalScreens: { type: Number, required: true },
    estimatedDays: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    additionalNotes: { type: String },
    attachments: { type: [String], default: [] }, // ✅
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    createdBy: { type: String, required: true },
    developerId: { type: String, required: true },
    approvedBy: { type: String },
        declineReason: { type: String, default: "" }, // 🟢 new

  },
  { timestamps: true }
);

export default mongoose.model<IEstimate>("Estimate", EstimateSchema);