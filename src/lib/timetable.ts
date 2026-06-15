import { prisma } from "./prisma";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// 50-minute classes, 10 min transitions, 1 hour lunch from 12:20 to 13:20
const SLOT_TIMES = [
  { start: "08:30", end: "09:20" },
  { start: "09:30", end: "10:20" },
  { start: "10:30", end: "11:20" },
  { start: "11:30", end: "12:20" },
  // LUNCH 12:20 - 13:20
  { start: "13:20", end: "14:10" },
  { start: "14:20", end: "15:10" },
  { start: "15:20", end: "16:10" },
  { start: "16:20", end: "17:10" },
];

export async function initTimeSlots() {
  await prisma.timeSlot.deleteMany(); // Clear old slots
  
  const data: Array<{ day: string; startTime: string; endTime: string }> = [];
  for (const day of DAYS) {
    for (const t of SLOT_TIMES) {
      data.push({ day, startTime: t.start, endTime: t.end });
    }
  }
  await prisma.timeSlot.createMany({ data });
}

export async function generateAllTimetables() {
  await prisma.timetableEntry.deleteMany();
  await initTimeSlots();

  const departments = await prisma.department.findMany();
  const allTeachers = await prisma.teacher.findMany();
  const allRooms = await prisma.room.findMany();
  const allCourses = await prisma.course.findMany();
  const allSlots = await prisma.timeSlot.findMany();

  const studentGroups = await prisma.student.groupBy({
    by: ['departmentId', 'year', 'section'],
  });

  const results: string[] = [];

  const allEntries: Array<{
    courseId: number; teacherId: number; roomId: number; timeSlotId: number;
    departmentId: number; year: number; section: string;
  }> = [];

  const teacherSlotUsed = new Set<string>();

  // Map each group (deptId-year-section) to a unique room
  let roomIndex = 0;
  const shuffledRooms = [...allRooms].sort(() => Math.random() - 0.5);

  const groupsByDept = new Map<number, typeof studentGroups>();
  for (const sg of studentGroups) {
    if (!groupsByDept.has(sg.departmentId)) groupsByDept.set(sg.departmentId, []);
    groupsByDept.get(sg.departmentId)!.push(sg);
  }

  for (const dept of departments) {
    const deptCourses = allCourses.filter((c) => c.departmentId === dept.id);
    const deptTeachers = allTeachers.filter((t) => t.departmentId === dept.id);
    const deptGroups = groupsByDept.get(dept.id) || [];
    if (deptCourses.length === 0 || deptTeachers.length === 0 || deptGroups.length === 0) continue;

    for (const group of deptGroups) {
      // Assign dedicated room
      if (roomIndex >= shuffledRooms.length) {
        throw new Error("Not enough rooms to assign a dedicated room to every group.");
      }
      const dedicatedRoom = shuffledRooms[roomIndex];
      roomIndex++;

      const entries = buildSchedule(
        deptCourses, deptTeachers, dedicatedRoom, allSlots, dept.id, group.year, group.section,
        teacherSlotUsed
      );
      allEntries.push(...entries);
      results.push(`${dept.name} Y${group.year} Sec${group.section}: ${entries.length} classes`);
    }
  }

  if (allEntries.length > 0) {
    for (let i = 0; i < allEntries.length; i += 500) {
      await prisma.timetableEntry.createMany({ data: allEntries.slice(i, i + 500) });
    }
  }
  results.push(`Total: ${allEntries.length} entries`);
  return results;
}

function buildSchedule(
  courses: { id: number }[],
  teachers: { id: number }[],
  dedicatedRoom: { id: number },
  slots: { id: number; day: string }[],
  departmentId: number, year: number, section: string,
  teacherSlotUsed: Set<string>
) {
  const entries: Array<{
    courseId: number; teacherId: number; roomId: number; timeSlotId: number;
    departmentId: number; year: number; section: string;
  }> = [];

  const shuffledTeachers = [...teachers].sort(() => Math.random() - 0.5);
  const courseTeacher = new Map<number, number>();
  for (let i = 0; i < courses.length; i++) {
    courseTeacher.set(courses[i].id, shuffledTeachers[i % shuffledTeachers.length].id);
  }

  const usedCourseDay = new Set<string>();
  const usedSlot = new Set<number>();

  const shuffledCourses = [...courses].sort(() => Math.random() - 0.5);

  for (const day of DAYS) {
    const daySlots = slots.filter((s) => s.day === day).sort(() => Math.random() - 0.5);
    
    // Minimum 5 lectures per day per group
    const target = Math.min(Math.floor(Math.random() * 2) + 5, daySlots.length, courses.length * 2);
    // Courses length is 5 usually. If they need 5 classes, some courses must be taught multiple times a week.
    let assigned = 0;

    for (let attempt = 0; attempt < daySlots.length * 10 && assigned < target; attempt++) {
      const ci = attempt % shuffledCourses.length;
      const course = shuffledCourses[ci];
      const teacherId = courseTeacher.get(course.id)!;

      const cKey = `${course.id}-${day}`;
      if (usedCourseDay.has(cKey)) continue;

      const si = attempt % daySlots.length;
      const slot = daySlots[si];
      
      if (usedSlot.has(slot.id)) continue;

      const tsKey = `${teacherId}-${slot.id}`;
      if (teacherSlotUsed.has(tsKey)) continue;

      usedCourseDay.add(cKey);
      usedSlot.add(slot.id);
      teacherSlotUsed.add(tsKey);

      entries.push({
        courseId: course.id, teacherId, roomId: dedicatedRoom.id, timeSlotId: slot.id,
        departmentId, year, section,
      });
      assigned++;
    }
  }

  return entries;
}
