"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TimetableViewer from "@/components/TimetableViewer";

interface TeacherData {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  specialization: string;
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

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const user = await res.json();
        const teacherInfo = {
          id: user.id,
          name: user.name,
          email: user.email,
          employeeId: user.teacher?.employeeId || "",
          department: user.department?.name || "",
          specialization: user.teacher?.specialization || "",
        };
        setTeacher(teacherInfo);

        const timetableRes = await fetch(`/api/timetable?role=teacher&userId=${user.id}`);
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

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gu-blue mb-1">
        Welcome, {teacher?.name || "Teacher"}
      </h1>
      <p className="text-gray-500 mb-6">Teacher Dashboard</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-gu col-span-1">
          <h2 className="text-lg font-semibold text-gu-blue mb-3">Personal Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{teacher?.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Employee ID:</span>
              <p className="font-medium">{teacher?.employeeId}</p>
            </div>
            <div>
              <span className="text-gray-500">Department:</span>
              <p className="font-medium">{teacher?.department}</p>
            </div>
            <div>
              <span className="text-gray-500">Specialization:</span>
              <p className="font-medium">{teacher?.specialization}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl p-5 shadow-gu">
          <TimetableViewer entries={entries} title="My Teaching Schedule" userRole="teacher" />
        </div>
      </div>
    </div>
  );
}
