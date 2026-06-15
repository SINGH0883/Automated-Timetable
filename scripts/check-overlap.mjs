import { PrismaClient } from "../src/generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const url = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const entries = await prisma.timetableEntry.findMany({ include: { room: true, timeSlot: true } });
  const set = new Set();
  let dupes = 0;
  for (const e of entries) {
    const key = `${e.roomId}-${e.timeSlotId}`;
    if (set.has(key)) {
      dupes++;
      console.log(`Overlap in Room ${e.room.roomNumber} at slot ${e.timeSlot.day} ${e.timeSlot.startTime}`);
    }
    set.add(key);
  }
  console.log('Duplicates: ' + dupes);
}

check().catch(console.error).finally(() => prisma.$disconnect());
