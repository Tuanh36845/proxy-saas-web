import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Proxy from "@/models/Proxy";

// Lấy danh sách proxy của user đang đăng nhập
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    await dbConnect();

    const userId = (session.user as { id: string }).id;
    const proxies = await Proxy.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ proxies });
  } catch (error) {
    console.error("Get proxies error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

// Xoay IP cho 1 proxy cụ thể
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { proxyId, action } = await req.json();
    await dbConnect();

    const userId = (session.user as { id: string }).id;
    const proxy = await Proxy.findOne({ _id: proxyId, userId });

    if (!proxy) {
      return NextResponse.json({ error: "Không tìm thấy proxy" }, { status: 404 });
    }

    if (proxy.type === "STATIC") {
      return NextResponse.json({ error: "Proxy tĩnh không hỗ trợ xoay IP" }, { status: 403 });
    }

    if (proxy.status !== "active") {
      return NextResponse.json({ error: "Proxy chưa sẵn sàng" }, { status: 400 });
    }

    // Kiểm tra cooldown 10 phút
    if (action === "rotate") {
      const now = new Date();
      const lastRotate = new Date(proxy.lastRotatedAt);
      const diffMinutes = (now.getTime() - lastRotate.getTime()) / (1000 * 60);

      if (diffMinutes < 10) {
        const remaining = Math.ceil(10 - diffMinutes);
        return NextResponse.json({
          error: `Vui lòng chờ ${remaining} phút nữa trước khi xoay tiếp`,
        }, { status: 429 });
      }

      // TODO: Gọi Python Worker để tạo VPS mới và cập nhật Router
      // Tạm thời chỉ cập nhật trạng thái
      proxy.lastRotatedAt = now;
      proxy.rotateCount += 1;
      proxy.status = "provisioning";
      await proxy.save();

      return NextResponse.json({
        message: "Đang xoay IP... Vui lòng chờ 2-3 phút.",
        proxy,
      });
    }

    // Bật/tắt Auto-rotate
    if (action === "toggleAutoRotate") {
      proxy.autoRotateEnabled = !proxy.autoRotateEnabled;
      await proxy.save();

      return NextResponse.json({
        message: proxy.autoRotateEnabled
          ? "Đã bật tự động xoay IP mỗi 30 phút"
          : "Đã tắt tự động xoay IP",
        proxy,
      });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
  } catch (error) {
    console.error("Proxy action error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
