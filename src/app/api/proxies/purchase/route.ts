import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Proxy from "@/models/Proxy";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
    }

    const body = await req.json();
    const { type, country, months, qty, totalPrice } = body;

    if (!type || !qty || qty < 1 || !totalPrice) {
      return NextResponse.json({ error: "Tham số không hợp lệ" }, { status: 400 });
    }

    await dbConnect();
    
    // Tìm User
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    // Trừ tiền
    if (user.balance < totalPrice) {
      return NextResponse.json({ error: "Số dư không đủ! Vui lòng nạp tiền." }, { status: 400 });
    }

    user.balance -= totalPrice;
    await user.save();

    // Sinh Proxy giả lập
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + Number(months));

    // Determine type string for DB
    let proxyTypeString = "STATIC";
    if (type === "rotate") proxyTypeString = "ROTATING";

    const proxiesToCreate = [];
    for (let i = 0; i < qty; i++) {
        proxiesToCreate.push({
            userEmail: session.user.email,
            type: proxyTypeString,
            assignedPort: Math.floor(Math.random() * (20000 - 10000) + 10000), // Random port
            proxyUser: `user${Math.floor(Math.random() * 10000)}`,
            proxyPass: `pass${Math.floor(Math.random() * 10000)}`,
            currentIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, // Random Fake IP
            status: "active",
            expiresAt: expiresAt,
            rotateEnabled: proxyTypeString === "ROTATING",
            autoRotateEnabled: false,
            lastRotatedAt: new Date()
        });
    }

    await Proxy.insertMany(proxiesToCreate);

    return NextResponse.json({ 
        message: "Lên đập thanh toán thành công", 
        newBalance: user.balance 
    });

  } catch (error: any) {
    console.error("Lỗi Purchase API:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}
