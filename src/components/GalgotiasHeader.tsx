"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface GalgotiasHeaderProps {
  role: "admin" | "teacher" | "student";
  userName: string;
}

export default function GalgotiasHeader({ role, userName }: GalgotiasHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: Record<string, { href: string; label: string }[]> = {
    admin: [
      { href: "/dashboard/admin", label: "Dashboard" },
      { href: "/dashboard/admin", label: "Timetables" },
    ],
    teacher: [
      { href: "/dashboard/teacher", label: "Dashboard" },
      { href: "/dashboard/teacher", label: "My Timetable" },
    ],
    student: [
      { href: "/dashboard/student", label: "Dashboard" },
      { href: "/dashboard/student", label: "My Timetable" },
    ],
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header className="bg-gu-blue shadow-gu fixed top-0 left-0 right-0 z-[100] border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/dashboard/${role}`} className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-white">Galgotias</span>{" "}
              <span className="text-gu-gold">University</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks[role]?.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-blue-200 text-sm">{userName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gu-red hover:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-800 pt-4">
            <nav className="flex flex-col gap-3 mb-4">
              {navLinks[role]?.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-sm">{userName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gu-red hover:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
