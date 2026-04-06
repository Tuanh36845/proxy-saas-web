import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
        user: {
            name: user.name,
            email: user.email,
            balance: user.balance,
            avatar: user.avatar,
            age: user.age,
            gender: user.gender,
            phone: user.phone,
            facebook: user.facebook,
            address: user.address,
        }
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, age, gender, phone, facebook, address, avatar } = body;

    await dbConnect();
    
    const updateData: any = { name, age, gender, phone, facebook, address };
    if (avatar) updateData.avatar = avatar; // Base64 string

    await User.updateOne(
        { email: session.user.email },
        { $set: updateData }
    );

    return NextResponse.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
