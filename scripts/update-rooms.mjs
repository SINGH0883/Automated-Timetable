import { PrismaClient } from "../src/generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing");
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error"] });

async function main() {
  console.log("Deleting old Timetable Entries...");
  await prisma.timetableEntry.deleteMany();

  console.log("Deleting old Rooms and Blocks...");
  await prisma.room.deleteMany();
  await prisma.block.deleteMany();

  const blockNames = ["A", "B", "C", "AI"];
  const newBlocks = [];

  console.log("Creating new Blocks...");
  for (const name of blockNames) {
    const block = await prisma.block.create({
      data: { name: `${name} block`, code: name },
    });
    newBlocks.push(block);
  }

  console.log("Creating 600 Rooms...");
  const rooms = [];
  for (const block of newBlocks) {
    for (let floor = 1; floor <= 5; floor++) {
      for (let roomNum = 1; roomNum <= 30; roomNum++) {
        const formattedRoomNumber = `${block.code}-${floor}${String(roomNum).padStart(2, '0')}`;
        rooms.push({
          blockId: block.id,
          roomNumber: formattedRoomNumber,
          capacity: 54,
        });
      }
    }
  }

  // Insert in batches
  for (let i = 0; i < rooms.length; i += 100) {
    await prisma.room.createMany({
      data: rooms.slice(i, i + 100),
    });
  }

  console.log("Successfully updated blocks and rooms.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
