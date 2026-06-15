import { NextResponse } from "next/server";
import { generateAllTimetables } from "@/lib/timetable";

export async function POST() {
  try {
    const results = await generateAllTimetables();
    return NextResponse.json({ message: "Timetables generated", results });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
