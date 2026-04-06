import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email này đã được đăng ký" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: "customer",
      balance: 0,
    });

    return NextResponse.json({
      message: "Đăng ký thành công!",
      user: { id: user._id, email: user.email, name: user.name },
    }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
