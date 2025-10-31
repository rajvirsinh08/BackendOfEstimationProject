// import mongoose, { Schema, Document } from "mongoose";

// export interface IEstimate extends Document {
//   projectName: string;
//   projectType: string;
//   description: string;
//   techStack: string;
//   clientName: string;
//   costType: "Hourly" | "Fixed"; // 🆕
//   estimatedHours?: number; // only if costType = Hourly
//   hourlyCost?: number; // only if costType = Hourly
//   totalCost: number; // auto-calc or manual based on costType
//   dueDate?: Date; // replaced endDate
//   additionalNotes?: string;
//   attachments?: string[];
//   status: "Pending" | "Approved" | "Rejected";
//   createdBy: string;
//   developerId: string;
//   approvedBy?: string;
//   declineReason?: string;
// }

// const EstimateSchema = new Schema<IEstimate>(
//   {
//     projectName: { type: String, required: true },
//     projectType: { type: String, required: true },
//     description: { type: String, required: true },
//     techStack: { type: String, required: true },
//     clientName: { type: String, required: true }, // 🆕
//     costType: {
//       type: String,
//       enum: ["Hourly", "Fixed"],
//       required: true,
//     },
//     estimatedHours: { type: Number }, // optional for Hourly
//     hourlyCost: { type: Number }, // optional for Hourly
//     totalCost: { type: Number, required: true }, // calculated or entered
//     dueDate: { type: Date }, // replaced endDate
//     additionalNotes: { type: String },
//     attachments: { type: [String], default: [] },
//     status: {
//       type: String,
//       enum: ["Pending", "Approved", "Rejected"],
//       default: "Pending",
//     },
//     createdBy: { type: String, required: true },
//     developerId: { type: String, required: true },
//     approvedBy: { type: String },
//     declineReason: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IEstimate>("Estimate", EstimateSchema);
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
  createdBy: string;
  developerId: string;
  approvedBy?: string;
  adminComment?: string;
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
    createdBy: { type: String, required: true },
    developerId: { type: String, required: true },
    approvedBy: { type: String },
    adminComment: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IEstimate>("Estimate", EstimateSchema);
