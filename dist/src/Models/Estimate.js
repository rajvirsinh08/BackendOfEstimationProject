"use strict";
// import mongoose, { Schema, Document } from "mongoose";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importStar(require("mongoose"));
const EstimateSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Estimate", EstimateSchema);
