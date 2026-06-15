import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const departments = await prisma.department.findMany({
    include: {
      _count: {
        select: { courses: true, teachers: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ departments });
}
