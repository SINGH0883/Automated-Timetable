import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, password, role, departmentId } = data;

    if (!name || !email || !password || !role || !departmentId) {
      return NextResponse.json({ error: "Missing common required fields" }, { status: 400 });
    }

    if (!["teacher", "student"].includes(role)) {
      return NextResponse.json({ error: "Invalid role for registration" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const parsedDepartmentId = parseInt(departmentId, 10);

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role,
          departmentId: parsedDepartmentId,
        },
      });

      if (role === "student") {
        const { enrollmentNo, year, section } = data;
        if (!enrollmentNo || !year || !section) {
          throw new Error("Missing required student fields");
        }
        await tx.student.create({
          data: {
            userId: user.id,
            enrollmentNo,
            year: parseInt(year, 10),
            section,
            departmentId: parsedDepartmentId,
          },
        });
      } else if (role === "teacher") {
        const { employeeId, specialization } = data;
        if (!employeeId || !specialization) {
          throw new Error("Missing required teacher fields");
        }
        await tx.teacher.create({
          data: {
            userId: user.id,
            employeeId,
            specialization,
            departmentId: parsedDepartmentId,
          },
        });
      }

      return user;
    });

    const payload = { userId: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name };
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
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
