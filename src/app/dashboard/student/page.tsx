"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TimetableViewer from "@/components/TimetableViewer";

interface StudentData {
  id: number;
  name: string;
  email: string;
  enrollmentNo: string;
  year: number;
  section: string;
  departmentId: number;
  department: string;
  offDays: string[];
}

interface TimetableEntry {
  id: number;
  courseCode: string;
  courseName: string;
  teacherName: string;
  roomNumber: string;
  blockName: string;
  department: string;
  startTime: string;
  endTime: string;
  day: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const user = await res.json();
        const studentInfo = {
          id: user.id,
          name: user.name,
          email: user.email,
          enrollmentNo: user.student?.enrollmentNo || "",
          year: user.student?.year || 1,
          section: user.student?.section || "A",
          departmentId: user.departmentId || 0,
          department: user.department?.name || "",
          offDays: user.student?.offDays?.map((d: { day: string }) => d.day) || ["Saturday", "Sunday"],
        };
        setStudent(studentInfo);

        const timetableRes = await fetch(
          `/api/timetable?role=student&userId=${user.id}`
        );
        const timetableData = await timetableRes.json();
        setEntries(timetableData.entries || []);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-gu-blue text-lg">Loading...</div>
      </div>
    );
  }

  const offDays = student?.offDays || ["Saturday", "Sunday"];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const isOffDay = offDays.includes(today);

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gu-blue mb-1">
        Welcome, {student?.name || "Student"}
      </h1>
      <p className="text-gray-500 mb-6">Student Dashboard</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-gu col-span-1">
          <h2 className="text-lg font-semibold text-gu-blue mb-3">Personal Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{student?.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Enrollment:</span>
              <p className="font-medium">{student?.enrollmentNo}</p>
            </div>
            <div>
              <span className="text-gray-500">Year:</span>
              <p className="font-medium">{student?.year}</p>
            </div>
            <div>
              <span className="text-gray-500">Section:</span>
              <p className="font-medium">{student?.section}</p>
            </div>
            <div>
              <span className="text-gray-500">Department:</span>
              <p className="font-medium">{student?.department}</p>
            </div>
            <div>
              <span className="text-gray-500">Off Days:</span>
              <p className="font-medium">{offDays.join(", ")}</p>
            </div>
            {isOffDay && (
              <div className="mt-3 bg-gu-gold bg-opacity-20 text-gu-dark px-3 py-2 rounded-lg text-center font-semibold">
                Today is an off day!
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl p-5 shadow-gu">
          <TimetableViewer 
            entries={entries} 
            title={`My Timetable (Year ${student?.year}, Section ${student?.section})`} 
          />
        </div>
      </div>
    </div>
  );
}
