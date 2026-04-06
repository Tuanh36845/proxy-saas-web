import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin" | "customer";
  balance: number;
  avatar?: string;
  age?: number;
  gender?: string;
  phone?: string;
  facebook?: string;
  address?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  balance: { type: Number, default: 0 },
  avatar: { type: String },
  age: { type: Number },
  gender: { type: String },
  phone: { type: String },
  facebook: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
