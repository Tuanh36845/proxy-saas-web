import mongoose, { Schema, Document } from "mongoose";

export interface ICloudAccount extends Document {
  accountName: string;
  provider: "DigitalOcean" | "Azure";
  apiKey: string;
  maxLimit: number;
  currentlyUsed: number;
  region: string;
  status: "ACTIVE" | "DEAD" | "FULL";
  createdAt: Date;
}

const CloudAccountSchema = new Schema<ICloudAccount>({
  accountName: { type: String, required: true },
  provider: { type: String, enum: ["DigitalOcean", "Azure"], required: true },
  apiKey: { type: String, required: true },
  maxLimit: { type: Number, default: 10 },
  currentlyUsed: { type: Number, default: 0 },
  region: { type: String, default: "sgp1" },
  status: { type: String, enum: ["ACTIVE", "DEAD", "FULL"], default: "ACTIVE" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CloudAccount || mongoose.model<ICloudAccount>("CloudAccount", CloudAccountSchema);
