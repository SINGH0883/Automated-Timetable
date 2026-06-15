import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [departments, teachers, students, rooms, blocks, courses] = await Promise.all([
    prisma.department.count(),
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.room.count(),
    prisma.block.count(),
    prisma.course.count(),
  ]);

  return NextResponse.json({ departments, teachers, students, rooms, blocks, courses });
}
