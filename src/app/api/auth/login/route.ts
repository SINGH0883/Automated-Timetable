import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password and role are required" }, { status: 400 });
    }

    if (!["admin", "teacher", "student"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.role !== role && user.role !== "admin") {
      return NextResponse.json({ error: `No ${role} account found with this email` }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const payload = { userId: user.id, email: user.email, role: user.role, name: user.name };
    const token = signToken(payload);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
