<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Goal
- Automatic timetable management system for Galgotias University with Next.js 16, Prisma 7 + SQLite, Galgotias-themed UI, role-based access (admin/teacher/student) with JWT auth

## Constraints & Preferences
- 30 departments, 299 regular teachers + Dr. Bhadarinarayana (300 total), 4000 students, 400 rooms (13-14 per block in 30 blocks)
- Min 4 classes/day, max 8, Mon–Fri only; students get Saturday + Sunday off
- Galgotias theme: primary #1a237e (gu-blue), accent #c62828 (gu-red), highlight #ffd700 (gu-gold)
- Fixed header at top; 5-day timetable fits in one row (table-fixed, compact)
- JWT cookie auth with role validation — login rejects if selected role ≠ user's DB role
- No teacher double-booking: global Set<string> tracks `${teacherId}-${slotId}` across all groups
- Student and teacher dashboards only show their own timetable entries (filtered server-side)
- GitHub: `https://github.com/SINGH0883/timetable-management`

## Progress
### Done
- Initialized Next.js 16.2.7 with TypeScript, Tailwind v4, App Router
- Created Prisma schema (User, Department, Teacher, Student, Block, Room, Course, TimeSlot, TimetableEntry, OffDay) with SQLite
- Created library helpers: `src/lib/prisma.ts`, `src/lib/auth.ts`, `src/lib/timetable.ts`, `src/lib/seed.ts`
- Seeded database: 30 depts, 30 blocks, 400 rooms, 1 admin, 299 regular + Dr. B teachers (300 total), 4000 students, 150 courses, all student off-days
- All 120 groups get 20+ classes/week; global teacher-slot conflict tracking prevents double-booking
- 8 API routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/timetable`, `/api/timetable/generate`, `/api/seed`, `/api/departments`, `/api/stats`
- 10 frontend files: layout, login page (with GU logo), GalgotiasHeader, TimetableViewer, admin/teacher/student dashboards, role-redirect page
- Production build succeeds; server runs on port 3000
- Local git + GitHub remote pushed: `master` branch
- Added Dr. Bhadarinarayana to L&T dept
- Added Galgotias University logo to login page
- Increased teachers from 200 to 300 (299 regular + Dr. B)

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Switched from `prisma-client` to `prisma-client-js` generator after Prisma 7 required `adapter` or `accelerateUrl`
- Timetable generation: global `teacherSlotUsed` Set, per-department `roomSlotUsed` Set, shuffled teacher-to-course per group
- Room count: 400 (13-14 per block) to reduce room contention
- Teachers: 299 regular (9-10/dept) + Dr. B = 300
- Table: `table-fixed` with `<colgroup>` (12% time + 5×17.6% day), 3-letter day abbreviations
- Logo: downloaded from official GU website, served from `/images/galgotias-logo.png`

## Next Steps
- Polish admin dashboard (pagination/search for student/teacher lists)
- Increase attempts in `buildSchedule` for groups with <20 classes
- Re-seed DB after teacher count increase (delete dev.db, migrate, seed)

## Critical Context
- Path `D:\Yuvraj\L&T\timetable-management` contains `&` — use `node "node_modules/next/dist/bin/next" build` instead of `npm run build`
- Prisma 7: `new PrismaClient({ adapter: new PrismaLibSql({ url }) })` with `@prisma/adapter-libsql`
- Database at `./dev.db` (project root)
- Login: admin `admin@galgotiasuniversity.edu.in` / `admin123`, teachers `dr..{name}X@galgotiasuniversity.edu.in` / `teacher123`, students `student{1..4000}@galgotiasuniversity.edu.in` / `student123`
- Old JWT tokens invalidated after reseed — clear browser cookies before re-login
- Hard refresh (Ctrl+Shift+R) after rebuild

## Relevant Files
- `src/lib/prisma.ts`: PrismaClient singleton with LibSql adapter
- `src/lib/auth.ts`: JWT helpers + cookie session
- `src/lib/timetable.ts`: generateAllTimetables() + buildSchedule()
- `prisma/schema.prisma`: 10 models, SQLite
- `prisma/seed.mjs`: CLI seed (30 depts, 400 rooms, 300 teachers total)
- `src/lib/seed.ts`: API seed endpoint
- `src/app/page.tsx`: Login page with GU logo
- `src/components/TimetableViewer.tsx`: Compact 5-day table
- `src/components/GalgotiasHeader.tsx`: Fixed header
- `public/images/galgotias-logo.png`: GU logo
