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
  console.log("Fetching all students...");
  const students = await prisma.student.findMany({
    orderBy: [
      { departmentId: 'asc' },
      { year: 'asc' },
      { id: 'asc' }
    ]
  });

  console.log(`Found ${students.length} students. Reassigning sections...`);

  // Group by department and year
  const grouped = new Map();
  for (const s of students) {
    const key = `${s.departmentId}-${s.year}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(s);
  }

  const updatePromises = [];

  for (const [key, studentList] of grouped.entries()) {
    let studentCount = 0;
    for (const student of studentList) {
      const sectionNum = Math.floor(studentCount / 54) + 1;
      const sectionStr = String(sectionNum);
      
      if (student.section !== sectionStr) {
        updatePromises.push(
          prisma.student.update({
            where: { id: student.id },
            data: { section: sectionStr }
          })
        );
      }
      studentCount++;
    }
  }

  // Execute updates in batches to avoid overwhelming the database connection
  console.log(`Executing ${updatePromises.length} section updates...`);
  const batchSize = 100;
  for (let i = 0; i < updatePromises.length; i += batchSize) {
    const batch = updatePromises.slice(i, i + batchSize);
    await Promise.all(batch);
    if (i % 500 === 0 && i > 0) console.log(`  Updated ${i} students...`);
  }

  console.log("Successfully reassigned all sections!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
