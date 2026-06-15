"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const loginRoles = ["student", "teacher", "admin"];
const registerRoles = ["student", "teacher"];

export default function LoginPage() {
  const router = useRouter();
  
  // Toggle state
  const [isRegistering, setIsRegistering] = useState(false);

  // Common Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  
  // Register Specific Fields
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("A");
  const [employeeId, setEmployeeId] = useState("");
  const [specialization, setSpecialization] = useState("");

  // UI state
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

  // Fetch departments when switching to registration
  useEffect(() => {
    if (isRegistering && departments.length === 0) {
      fetch("/api/departments")
        .then((res) => res.json())
        .then((data) => {
          if (data.departments) {
            setDepartments(data.departments);
            if (data.departments.length > 0) {
              setDepartmentId(data.departments[0].id.toString());
            }
          }
        })
        .catch(() => console.error("Failed to load departments"));
    }
  }, [isRegistering, departments.length]);

  // Reset role when toggling (admin can't register)
  useEffect(() => {
    if (isRegistering && role === "admin") {
      setRole("student");
    }
  }, [isRegistering, role]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      
      const payload: any = { email, password, role };
      
      if (isRegistering) {
        payload.name = name;
        payload.departmentId = departmentId;
        if (role === "student") {
          payload.enrollmentNo = enrollmentNo;
          payload.year = year;
          payload.section = section;
        } else if (role === "teacher") {
          payload.employeeId = employeeId;
          payload.specialization = specialization;
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (isRegistering ? "Registration failed" : "Login failed"));
        return;
      }

      router.push(`/dashboard/${data.user.role}`);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentRoles = registerRoles;

  return (
    <div className="min-h-screen flex flex-col bg-gu-gradient overflow-y-auto">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md my-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Image src="/images/galgotias-logo.webp" alt="Galgotias University" width={45} height={45} className="inline-block" />
              <span>
                <span className="text-white">Galgotias</span>{" "}
                <span className="text-gu-gold">University</span>
              </span>
            </h1>
            <p className="text-blue-200 mt-2 text-lg">
              Timetable Management System
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-gu-lg p-8">
            <h2 className="text-2xl font-semibold text-gu-blue text-center mb-6">
              {isRegistering ? "Create Account" : "Sign In"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@galgotiasuniversity.edu.in"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="flex flex-col border border-gray-200 rounded-lg overflow-visible bg-white relative z-10">
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full px-4 py-2 text-left flex items-center justify-between focus-ring-gu"
                  >
                    <span className="capitalize text-gray-700">{role}</span>
                    <svg className={`w-4 h-4 transition-transform text-gray-500 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {open && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-20">
                      {currentRoles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => { setRole(r); setOpen(false); }}
                          className="w-full px-4 py-2 text-center capitalize transition-colors border-b border-gray-100 last:border-b-0 hover:bg-gray-50 text-gray-700"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isRegistering && (
                <div className="space-y-4 border-t border-gray-200 pt-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu bg-white"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>

                  {role === "student" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                        <input type="text" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} placeholder="GU123456" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <input type="number" min="1" max="5" value={year} onChange={(e) => setYear(e.target.value)} placeholder="1" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                          <select value={section} onChange={(e) => setSection(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu bg-white">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {role === "teacher" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="EMP1234" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Data Structures" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus-ring-gu" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-gu-red px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gu-blue hover:bg-blue-900 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-gu mt-2"
              >
                {loading ? "Please wait..." : isRegistering ? "Create Account" : "Sign In"}
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
                  className="text-sm text-gu-blue hover:underline"
                >
                  {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-gu-dark text-center py-3 text-sm text-gray-400 mt-auto">
        Powered by Galgotias University
      </footer>
    </div>
  );
}
