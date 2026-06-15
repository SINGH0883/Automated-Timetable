import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const userId = searchParams.get("userId");
  const departmentId = searchParams.get("departmentId");
  const year = searchParams.get("year");
  const section = searchParams.get("section");

  const where: Record<string, unknown> = {};

  if (departmentId) where.departmentId = Number(departmentId);
  if (year) where.year = Number(year);
  if (section) where.section = section;

  if (role === "teacher" && userId) {
    const teacher = await prisma.teacher.findUnique({ where: { userId: Number(userId) } });
    if (teacher) where.teacherId = teacher.id;
  }

  if (role === "student" && userId) {
    const student = await prisma.student.findUnique({ where: { userId: Number(userId) } });
    if (student) {
      where.year = student.year;
      where.section = student.section;
      where.departmentId = student.departmentId;
    }
  }

  const entries = await prisma.timetableEntry.findMany({
    where: where as any,
    include: {
      course: { include: { department: true } },
      teacher: { include: { user: true } },
      room: { include: { block: true } },
      timeSlot: true,
    },
    orderBy: [{ timeSlotId: "asc" }],
  });

  const mapped = entries.map((e) => ({
    id: e.id,
    courseCode: e.course.code,
    courseName: e.course.name,
    teacherName: e.teacher.user.name,
    roomNumber: e.room.roomNumber,
    blockName: e.room.block.name,
    department: e.course.department.name,
    year: e.year,
    section: e.section,
    startTime: e.timeSlot.startTime,
    endTime: e.timeSlot.endTime,
    day: e.timeSlot.day,
  }));

  return NextResponse.json({ entries: mapped });
}
