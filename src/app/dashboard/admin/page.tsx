"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TimetableViewer from "@/components/TimetableViewer";

interface Stats {
  departments: number;
  teachers: number;
  students: number;
  rooms: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [userName, setUserName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const fetchTimetables = async () => {
    try {
      const res = await fetch("/api/timetable?role=admin");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (e) {
      console.error("Failed to fetch timetables", e);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/"); return; }
        const user = await res.json();
        setUserName(user.name);

        const statsRes = await fetch("/api/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        await fetchTimetables();
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleGenerate() {
    setGenLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/timetable/generate", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || "Timetable generated successfully!");
      await fetchTimetables();
    } catch {
      setMessage("Failed to generate timetable.");
    } finally {
      setGenLoading(false);
    }
  }

  async function handleSeed() {
    setSeedLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || "Database seeded successfully!");
      await fetchTimetables();
    } catch {
      setMessage("Failed to seed database.");
    } finally {
      setSeedLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-gu-blue text-lg">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { label: "Departments", value: stats?.departments ?? 0, color: "bg-gu-blue" },
    { label: "Teachers", value: stats?.teachers ?? 0, color: "bg-gu-red" },
    { label: "Students", value: stats?.students ?? 0, color: "bg-gu-gold text-gu-dark" },
    { label: "Rooms", value: stats?.rooms ?? 0, color: "bg-green-700" },
  ];

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gu-blue mb-1">
        Welcome, {userName}
      </h1>
      <p className="text-gray-500 mb-6">Admin Dashboard</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`${card.color} rounded-xl p-5 text-white shadow-gu`}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm opacity-90 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={handleGenerate}
          disabled={genLoading}
          className="py-4 px-6 bg-gu-blue hover:bg-blue-900 text-white font-semibold rounded-xl shadow-gu transition-colors disabled:opacity-50"
        >
          {genLoading ? "Generating..." : "Generate Timetable"}
        </button>

        <button
          onClick={handleSeed}
          disabled={seedLoading}
          className="py-4 px-6 bg-gu-red hover:bg-red-800 text-white font-semibold rounded-xl shadow-gu transition-colors disabled:opacity-50"
        >
          {seedLoading ? "Seeding..." : "Seed Database"}
        </button>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-gu-blue px-5 py-3 rounded-xl mb-6">
          {message}
        </div>
      )}

      {/* Timetable Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-gu mb-6">
        <h2 className="text-lg font-semibold text-gu-blue mb-4">Timetable Navigation</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select 
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gu-blue"
            value={selectedDept}
            onChange={(e) => { setSelectedDept(e.target.value); setSelectedYear(""); setSelectedSection(""); }}
          >
            <option value="">-- Select Department --</option>
            {Array.from(new Set(entries.map(e => e.department))).filter(Boolean).sort().map(dept => (
              <option key={dept as string} value={dept as string}>{dept as string}</option>
            ))}
          </select>
          
          <select 
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gu-blue disabled:opacity-50"
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setSelectedSection(""); }}
            disabled={!selectedDept}
          >
            <option value="">-- Select Year --</option>
            {selectedDept && Array.from(new Set(entries.filter(e => e.department === selectedDept).map(e => e.year))).filter(Boolean).sort().map(year => (
              <option key={year as number} value={year as number}>Year {year as number}</option>
            ))}
          </select>
          
          <select 
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gu-blue disabled:opacity-50"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedYear}
          >
            <option value="">-- Select Section --</option>
            {selectedDept && selectedYear && Array.from(new Set(entries.filter(e => e.department === selectedDept && e.year === Number(selectedYear)).map(e => e.section))).filter(Boolean).sort((a: any, b: any) => a.localeCompare(b, undefined, {numeric: true})).map(sec => (
              <option key={sec as string} value={sec as string}>Section {sec as string}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-gu">
        {selectedDept && selectedYear && selectedSection ? (
          <TimetableViewer 
            entries={entries.filter(e => e.department === selectedDept && e.year === Number(selectedYear) && e.section === selectedSection)} 
            title={`${selectedDept} - Year ${selectedYear} - Section ${selectedSection}`} 
          />
        ) : (
          <div className="text-center py-10 text-gray-400">
            Please select a Department, Year, and Section to view the timetable.
          </div>
        )}
      </div>
    </div>
  );
}
