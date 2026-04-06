import mongoose, { Schema, Document } from "mongoose";

export interface IProxy extends Document {
  userId: mongoose.Types.ObjectId;
  type: "STATIC" | "ROTATING";
  protocol: "SOCKS5" | "HTTP";
  // Thông tin kết nối cho khách (cố định, không bao giờ đổi)
  assignedPort: number;
  // Thông tin VPS thực tế đang phục vụ (thay đổi khi xoay IP)
  currentIp: string;
  currentDropletId: string;
  currentProvider: string;
  currentAccountId: mongoose.Types.ObjectId;
  // Auth
  proxyUser: string;
  proxyPass: string;
  // Giới hạn
  speedLimit: string;
  expiresAt: Date;
  // Xoay IP
  rotateEnabled: boolean;
  autoRotateEnabled: boolean;
  autoRotateIntervalMin: number;
  lastRotatedAt: Date;
  rotateCount: number;
  // Trạng thái
  status: "active" | "provisioning" | "expired" | "error";
  createdAt: Date;
}

const ProxySchema = new Schema<IProxy>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["STATIC", "ROTATING"], required: true },
  protocol: { type: String, enum: ["SOCKS5", "HTTP"], default: "SOCKS5" },
  assignedPort: { type: Number, required: true, unique: true },
  currentIp: { type: String, default: "" },
  currentDropletId: { type: String, default: "" },
  currentProvider: { type: String, default: "DigitalOcean" },
  currentAccountId: { type: Schema.Types.ObjectId, ref: "CloudAccount" },
  proxyUser: { type: String, required: true },
  proxyPass: { type: String, required: true },
  speedLimit: { type: String, default: "Unlimited" },
  expiresAt: { type: Date, required: true },
  rotateEnabled: { type: Boolean, default: false },
  autoRotateEnabled: { type: Boolean, default: false },
  autoRotateIntervalMin: { type: Number, default: 30 },
  lastRotatedAt: { type: Date, default: Date.now },
  rotateCount: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "provisioning", "expired", "error"], default: "provisioning" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Proxy || mongoose.model<IProxy>("Proxy", ProxySchema);
