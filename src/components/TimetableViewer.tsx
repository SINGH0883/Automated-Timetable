"use client";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "08:30-09:20",
  "09:30-10:20",
  "10:30-11:20",
  "11:30-12:20",
  "13:20-14:10",
  "14:20-15:10",
  "15:20-16:10",
  "16:20-17:10",
];

const DEPARTMENT_COLORS: Record<string, string> = {
  CSE: "bg-blue-100 border-blue-300 text-blue-800",
  ECE: "bg-green-100 border-green-300 text-green-800",
  EEE: "bg-yellow-100 border-yellow-300 text-yellow-800",
  ME: "bg-orange-100 border-orange-300 text-orange-800",
  CE: "bg-purple-100 border-purple-300 text-purple-800",
  IT: "bg-cyan-100 border-cyan-300 text-cyan-800",
  default: "bg-gray-100 border-gray-300 text-gray-800",
};

interface TimetableEntry {
  id: number;
  courseCode: string;
  courseName: string;
  teacherName: string;
  roomNumber: string;
  blockName: string;
  department?: string;
  year?: number;
  section?: string;
  startTime: string;
  endTime: string;
  day: string;
}

interface TimetableViewerProps {
  entries: TimetableEntry[];
  title?: string;
  userRole?: string;
}

function getDepartmentColor(dept?: string): string {
  if (!dept) return DEPARTMENT_COLORS.default;
  return DEPARTMENT_COLORS[dept.toUpperCase()] || DEPARTMENT_COLORS.default;
}

function getEntriesForDayAndSlot(entries: TimetableEntry[], day: string, slotLabel: string): TimetableEntry[] {
  const [start] = slotLabel.split("-");
  return entries.filter(
    (e) => e.day === day && e.startTime === start
  );
}

export default function TimetableViewer({ entries, title, userRole }: TimetableViewerProps) {
  return (
    <div>
      {title && <h3 className="text-lg font-semibold text-gu-blue mb-4">{title}</h3>}

      <div className="rounded-xl border border-gray-200 shadow-gu overflow-hidden">
        <table className="w-full table-fixed bg-white">
          <colgroup>
            <col className="w-[12%]" />
            {DAYS.map((day) => <col key={day} className="w-[17.6%]" />)}
          </colgroup>
          <thead>
            <tr>
              <th className="bg-gu-blue text-white px-1.5 py-2 text-xs font-semibold text-center">
                Time
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="bg-gu-blue text-white px-1.5 py-2 text-xs font-semibold text-center"
                >
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot} className="border-t border-gray-200 even:bg-gray-50">
                <td className="bg-gu-light px-1 py-2 text-[11px] font-medium text-gu-dark text-center border-r border-gray-200">
                  {slot}
                </td>
                {DAYS.map((day) => {
                  const cellEntries = getEntriesForDayAndSlot(entries, day, slot);
                  return (
                    <td key={`${day}-${slot}`} className="px-1 py-1 text-center border-r border-gray-100 align-top">
                      {cellEntries.length > 0 ? (
                        <div className="space-y-0.5">
                          {cellEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className={`px-1 py-1 rounded border text-[10px] leading-tight ${getDepartmentColor(entry.department)}`}
                            >
                              <div className="font-semibold truncate">{entry.courseCode}</div>
                              {userRole === 'teacher' ? (
                                <div className="opacity-75 truncate font-medium">Y{entry.year} - Sec {entry.section}</div>
                              ) : (
                                <div className="opacity-75 truncate">{entry.teacherName}</div>
                              )}
                              <div className="text-[9px] mt-0.5 font-medium text-gray-600 truncate bg-white/50 rounded px-0.5 w-fit">Room: {entry.roomNumber}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-[11px]">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No timetable entries found.</p>
      )}
    </div>
  );
}
