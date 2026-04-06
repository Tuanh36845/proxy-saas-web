import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await dbConnect();
  const result = await User.updateOne(
    { email: "huanfpt03@gmail.com" },
    { $set: { balance: 10000000, name: "DUONG TUANH" } }
  );
  return NextResponse.json({ success: true, result });
}
