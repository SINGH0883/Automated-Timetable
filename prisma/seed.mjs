import { PrismaClient } from "../src/generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing");
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error"] });
async function hashPassword(password) {
  return bcrypt.hash(password, 4);
}

const deptData = [
  { name: "School of Computer Science & Engineering", code: "CSE" },
  { name: "School of Artificial Intelligence", code: "AI" },
  { name: "School of Engineering", code: "ENGG" },
  { name: "School of Business", code: "BUS" },
  { name: "School of Law", code: "LAW" },
  { name: "School of Finance & Commerce", code: "FIN" },
  { name: "School of Forensic Sciences", code: "FSC" },
  { name: "School of Computer Applications & Technology", code: "CAT" },
  { name: "School of Medical & Allied Sciences", code: "MED" },
  { name: "School of Design", code: "DES" },
  { name: "School of Pharmacy", code: "PHARM" },
  { name: "School of Architecture & Planning", code: "ARCH" },
  { name: "School of Journalism & Mass Communication", code: "JMC" },
  { name: "School of Hotel Management & Tourism", code: "HMT" },
  { name: "School of Education", code: "EDU" },
  { name: "School of Fine Arts", code: "FA" },
  { name: "School of Social Sciences", code: "SOC" },
  { name: "School of Biotechnology", code: "BIOT" },
  { name: "School of Environmental Sciences", code: "ENV" },
  { name: "School of Agriculture", code: "AGRI" },
  { name: "School of Physical Education", code: "PE" },
  { name: "School of Nursing", code: "NURS" },
  { name: "School of Dental Sciences", code: "DENT" },
  { name: "School of Ayurveda & Alternative Medicine", code: "AYUR" },
  { name: "School of Public Health", code: "PUBH" },
  { name: "School of Data Science & Analytics", code: "DSA" },
  { name: "School of International Relations", code: "IR" },
  { name: "School of Defence & Strategic Studies", code: "DEF" },
  { name: "L&T", code: "LNT" },
  { name: "School of Library & Information Science", code: "LIB" },
];

const courseNames = [
  ["Programming Fundamentals","Data Structures","Algorithms","Database Systems","Software Engineering"],
  ["Intro to AI","Machine Learning","Neural Networks","NLP","Computer Vision"],
  ["Engineering Maths","Physics","Mechanics","Thermodynamics","Circuit Analysis"],
  ["Principles of Mgmt","Marketing Mgmt","Financial Mgmt","HR Mgmt","Operations Mgmt"],
  ["Constitutional Law","Contract Law","Tort Law","Criminal Law","Corporate Law"],
  ["Financial Accounting","Cost Accounting","Auditing","Taxation","Economics"],
  ["Forensic Science","Criminology","Digital Forensics","Ballistics","Toxicology"],
  ["Web Technologies","Mobile Apps","Cloud Computing","Cyber Security","Data Science"],
  ["Anatomy","Physiology","Pharmacology","Biochemistry","Pathology"],
  ["Design Thinking","Visual Design","Typography","3D Modeling","Animation"],
  ["Pharmaceutical Chem","Pharmacognosy","Pharmaceutics","Pharmacology","Clinical Pharmacy"],
  ["Architectural Design","Building Materials","Structural Systems","Urban Planning","Landscape Arch"],
  ["Reporting & Editing","Media Ethics","Broadcast Journalism","Digital Media","Public Relations"],
  ["Food Production","Housekeeping Mgmt","Front Office Ops","F&B Service","Hotel Accounting"],
  ["Educational Psychology","Curriculum Design","Teaching Methods","EdTech","Assessment & Eval"],
  ["Painting","Sculpture","Art History","Printmaking","Ceramics"],
  ["Sociology","Psychology","Political Science","Economics","Anthropology"],
  ["Molecular Biology","Genetic Engineering","Bioinformatics","Immunology","Bioprocess Engg"],
  ["Ecology","Climate Change","Waste Mgmt","Environmental Chem","Renewable Energy"],
  ["Agronomy","Soil Science","Plant Pathology","Horticulture","Agri Economics"],
  ["Sports Physiology","Exercise Psychology","Sports Nutrition","Coaching Methods","Biomechanics"],
  ["Med-Surgical Nursing","Pediatric Nursing","Psychiatric Nursing","Community Health","Nursing Research"],
  ["Oral Surgery","Orthodontics","Periodontics","Endodontics","Prosthodontics"],
  ["Kriya Sharir","Rachana Sharir","Dravyaguna","Rasa Shastra","Panchakarma"],
  ["Epidemiology","Biostatistics","Health Policy","Environmental Health","Global Health"],
  ["Statistics","Big Data Analytics","Data Visualization","Database Mgmt","Business Intelligence"],
  ["Diplomacy","Foreign Policy","International Law","Global Governance","Conflict Resolution"],
  ["Strategic Studies","Military History","Defence Economics","Geopolitics","National Security"],
  ["Project Management","Construction Tech","Supply Chain Mgmt","Industrial Safety","Quality Mgmt"],
  ["Cataloguing","Classification","Digital Libraries","Info Retrieval","Library Mgmt"],
];

const prefixes = [
  "CS","AI","EN","BM","LW","FC","FS","CA","MS","DS",
  "PR","AR","JM","HM","ED","FA","SO","BT","EV","AG",
  "PE","NU","DE","AY","PH","DA","IR","DF","LT","LI",
];

const hardcodedNames = [
  "Dr. Aarav Sharma","Dr. Priya Verma","Dr. Arjun Singh","Dr. Ananya Gupta","Dr. Vikram Patel",
  "Dr. Neha Kapoor","Dr. Rahul Joshi","Dr. Sneha Reddy","Dr. Amit Kumar","Dr. Pooja Mehta",
  "Dr. Rajesh Khanna","Dr. Divya Nair","Dr. Suresh Babu","Dr. Kavita Singh","Dr. Manoj Tiwari",
  "Dr. Ritu Agarwal","Dr. Vijay Deshmukh","Dr. Shweta Jain","Dr. Deepak Mishra","Dr. Nandini Rao",
  "Dr. Rohit Malhotra","Dr. Ishita Das","Dr. Kartik Iyer","Dr. Megha Chakraborty","Dr. Harsh Vardhan",
  "Dr. Tanvi Kulkarni","Dr. Aditya Ghosh","Dr. Pallavi Saxena","Dr. Siddharth Nair","Dr. Anjali Menon",
  "Dr. Pranav K","Dr. Swati Pandey","Dr. Gaurav Bhatia","Dr. Rashi Singh","Dr. Abhishek Thakur",
  "Dr. Yashaswini","Dr. Varun Dutta","Dr. Nikita Sharma","Dr. Karan Arora","Dr. Aishwarya Raj",
  "Dr. Ravi Shankar","Dr. Geeta Pillai","Dr. Mohan Krishnan","Dr. Deepika Rani","Dr. Ankur Mittal",
  "Dr. Shalini Verma","Dr. Lokesh Gupta","Dr. Radhika Iyer","Dr. Pradeep Yadav","Dr. Hema Chandra",
  "Dr. Naveen Kumar","Dr. Lavanya Prasad","Dr. Dinesh Reddy","Dr. Sonali Desai","Dr. Ashwin Kumar",
  "Dr. Bhavana Rao","Dr. Rohan Mehra","Dr. Chaitali Shah","Dr. Sameer Khan","Dr. Deepa Nair",
  "Dr. Harish Bhat","Dr. Amrita Sen","Dr. Prakash Jha","Dr. Kiran Bedi","Dr. Sanjay Gupta",
  "Dr. Madhuri Dixit","Dr. Alok Nath","Dr. Richa Sharma","Dr. Balaji Srinivasan","Dr. Shreya Ghosh",
  "Dr. Chandan Kumar","Dr. Tulsi Das","Dr. Akash Singh","Dr. Mithali Raj","Dr. Ganesh Iyer",
  "Dr. Padma Shri","Dr. Dheeraj Kapoor","Dr. Rekha Thakur","Dr. Jaspreet Singh","Dr. Parul Gupta",
  "Dr. Imran Khan","Dr. Vasundhara Devi","Dr. Kaushik Sen","Dr. Trisha Roy","Dr. Arvind Kumar",
  "Dr. Namrata Joshi","Dr. Hitesh Patel","Dr. Gauri Deshmukh","Dr. Rajat Bansal","Dr. Shivani Agarwal",
  "Dr. Anirudh Krishna","Dr. Neelam Sharma","Dr. Mahesh Babu","Dr. Pallavi Mishra","Dr. Rakesh Roshan",
  "Dr. Janhavi Kapoor","Dr. Vinay Pathak","Dr. Komal Thakur","Dr. Sudhir Mishra","Dr. Ankita Sharma",
  "Dr. Hrithik Sharma","Dr. Ishita Gupta","Dr. Prateek Jain","Dr. Ananya Singh","Dr. Naman Agarwal",
  "Dr. Mansi Srivastava","Dr. Tushar Mehta","Dr. Riya Kapoor","Dr. Aditya Srivastava","Dr. Nisha Singh",
  "Dr. Shivam Verma","Dr. Kriti Sharma","Dr. Anurag Mishra","Dr. Ritu Raj","Dr. Mohit Chauhan",
  "Dr. Deepti Nair","Dr. Kartik Aryan","Dr. Parineeti Chopra","Dr. Vicky Kaushal","Dr. Alia Bhat",
  "Dr. Ranveer Singh","Dr. Deepika Padukone","Dr. Ayushmann Khurrana","Dr. Taapsee Pannu",
  "Dr. Rajkummar Rao","Dr. Bhumi Pednekar","Dr. Nawazuddin Siddiqui","Dr. Kangana Ranaut",
  "Dr. Pankaj Tripathi","Dr. Swara Bhaskar","Dr. Manoj Bajpayee","Dr. Sakshi Tanwar",
  "Dr. Naseeruddin Shah","Dr. Shabana Azmi","Dr. Irrfan Pathan","Dr. Konkona Sen",
  "Dr. Raghubir Yadav","Dr. Seema Biswas","Dr. Om Puri","Dr. Smita Patil","Dr. Amol Palekar",
  "Dr. Jaya Bhaduri","Dr. Sanjay Mishra","Dr. Divya Dutta","Dr. Vinay Sharma","Dr. Neetu Chandra",
  "Dr. Brijendra Kala","Dr. Rasika Dugal","Dr. Piyush Mishra","Dr. Tisca Chopra","Dr. Adil Hussain",
  "Dr. Geetanjali Kulkarni","Dr. Anangsha Biswas","Dr. Abhilasha Patil","Dr. Amit Sial","Dr. Flora Saini",
  "Dr. Anant Joshi","Dr. Shivani Raghuvanshi","Dr. Mohan Agashe","Dr. Sonali Kulkarni",
  "Dr. Ashish Vidyarthi","Dr. Renuka Shahane","Dr. Shivaji Satam","Dr. Nivedita Bhargava",
  "Dr. Rakesh Bedi","Dr. Lillete Dubey","Dr. Darshan Jariwala","Dr. Supriya Pathak",
  "Dr. Rajendra Gupta","Dr. Neena Gupta","Dr. Alok Nathji","Dr. Surekha Sikri",
  "Dr. Benjamin Gilani","Dr. Sharmila Tagore","Dr. Anupam Kher","Dr. Waheeda Rehman",
];

const teacherFirstNames = [
  "Aarav","Priya","Arjun","Ananya","Vikram","Neha","Rahul","Sneha","Amit","Pooja",
  "Rajesh","Divya","Suresh","Kavita","Manoj","Ritu","Vijay","Shweta","Deepak","Nandini",
  "Rohit","Ishita","Kartik","Megha","Harsh","Tanvi","Aditya","Pallavi","Siddharth","Anjali",
  "Pranav","Swati","Gaurav","Rashi","Abhishek","Varun","Nikita","Karan","Aishwarya","Ravi",
  "Geeta","Mohan","Deepika","Ankur","Shalini","Lokesh","Radhika","Pradeep","Hema","Naveen",
  "Lavanya","Dinesh","Sonali","Ashwin","Bhavana","Rohan","Chaitali","Sameer","Deepa","Harish",
  "Amrita","Prakash","Kiran","Sanjay","Madhuri","Alok","Richa","Balaji","Shreya","Chandan",
  "Tulsi","Akash","Mithali","Ganesh","Padma","Dheeraj","Rekha","Jaspreet","Parul","Imran",
  "Vasundhara","Kaushik","Trisha","Arvind","Namrata","Hitesh","Gauri","Rajat","Shivani","Anirudh",
  "Neelam","Mahesh","Rakesh","Janhavi","Vinay","Komal","Sudhir","Ankita","Hrithik","Prateek",
  "Mansi","Tushar","Riya","Aditya","Nisha","Shivam","Kriti","Anurag","Mohit","Deepti",
  "Arya","Bhavna","Chirag","Devika","Esha","Farhan","Gargi","Hemant","Isha","Jatin",
  "Kirti","Lalit","Maya","Nitin","Ojas","Payal","Quasim","Roshni","Sahil","Tanya",
  "Uday","Vaishali","Yash","Zara","Aniket","Bharti","Chirayu","Damini","Edwin","Falguni",
  "Girish","Harini","Indrajit","Jhanvi","Kushal","Lipi","Madhav","Nirali","Omkar","Purnima",
];

const teacherLastNames = [
  "Sharma","Verma","Singh","Gupta","Patel","Kapoor","Joshi","Reddy","Kumar","Mehta",
  "Khanna","Nair","Babu","Tiwari","Agarwal","Deshmukh","Jain","Mishra","Rao","Malhotra",
  "Das","Iyer","Chakraborty","Vardhan","Kulkarni","Ghosh","Saxena","Menon","Pandey","Bhatia",
  "Thakur","Dutta","Arora","Raj","Shankar","Pillai","Krishnan","Rani","Mittal","Verma",
  "Yadav","Chandra","Prasad","Desai","Mehra","Shah","Khan","Bhat","Sen","Jha",
  "Bedi","Dixit","Nath","Srinivasan","Ghosh","Kumar","Raj","Iyer","Shri","Kapoor",
  "Thakur","Devi","Roy","Bansal","Krishna","Babu","Roshan","Pathak","Thakur","Sharma",
  "Srivastava","Mehta","Srivastava","Verma","Chauhan","Aryan","Chopra","Kaushal","Bhat",
  "Singh","Padukone","Khurrana","Pannu","Rao","Pednekar","Siddiqui","Ranaut","Tripathi",
  "Bhaskar","Bajpayee","Tanwar","Shah","Azmi","Pathan","Sen","Yadav","Biswas","Puri",
  "Patil","Palekar","Bhaduri","Chandra","Kala","Dugal","Hussain","Kulkarni","Biswas",
  "Patil","Sial","Saini","Joshi","Raghuvanshi","Agashe","Vidyarthi","Shahane","Satam",
  "Bhargava","Bedi","Dubey","Jariwala","Pathak","Gupta","Sikri","Gilani","Tagore","Kher",
  "Rehman","Krishnamurthy","Subramanian","Iyengar","Rajan","Nambiar","Menon","Pillai",
  "Warrier","Nair","Varma","Philip","George","Thomas","Chacko","Mathew","Kurian","Cherian",
];

const specializations = [
  "Data Structures","Algorithms","Machine Learning","Deep Learning","Computer Networks",
  "Database Systems","Web Development","Mobile Computing","Cloud Computing","Cyber Security",
  "Software Engineering","AI & Robotics","Business Analytics","Finance","Marketing",
  "Human Resources","Operations","Constitutional Law","Criminal Law","Corporate Law",
  "Forensic Science","Criminology","Digital Forensics","Biochemistry","Microbiology",
  "Pharmacology","Nursing","Medical Sciences","Product Design","UI/UX Design",
  "Visual Communication","Animation","VLSI Design","Embedded Systems","Power Systems",
  "Structural Engineering","Thermodynamics","Fluid Mechanics","Economics","Accounting",
  "Pharmaceutical Chem","Pharmacognosy","Architectural Design","Urban Planning","Media Ethics",
  "Broadcast Journalism","Food Production","EdTech","Educational Psych","Art History",
  "Sociology","Psychology","Molecular Biology","Genetic Engg","Ecology","Climate Science",
  "Agronomy","Soil Science","Sports Physiology","Exercise Psych","Nursing Research",
  "Oral Surgery","Orthodontics","Kriya Sharir","Panchakarma","Epidemiology","Biostatistics",
  "Big Data Analytics","Data Viz","Diplomacy","Foreign Policy","Strategic Studies",
  "Military History","Project Mgmt","Construction Tech","Cataloguing","Digital Libraries",
];

function getTeacherName(idx) {
  if (idx < hardcodedNames.length) return hardcodedNames[idx];
  const f = teacherFirstNames[idx % teacherFirstNames.length];
  const l = teacherLastNames[idx % teacherLastNames.length];
  return `Dr. ${f} ${l}`;
}

async function main() {
  const existing = await prisma.user.findFirst({ where: { role: "admin" } });
  if (existing) {
    console.log("Already seeded");
    return;
  }

  const departments = [];
  for (const d of deptData) {
    departments.push(await prisma.department.create({ data: d }));
  }
  console.log("Created 30 departments");

  const blockNames = ["A", "B", "C", "AI"];
  const newBlocks = [];
  for (const name of blockNames) {
    const block = await prisma.block.create({
      data: { name: `${name} block`, code: name },
    });
    newBlocks.push(block);
  }

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
  for (let i = 0; i < rooms.length; i += 100) {
    await prisma.room.createMany({ data: rooms.slice(i, i + 100) });
  }
  console.log("Created 4 blocks with 600 rooms");

  await prisma.user.create({ data: { email: "admin@galgotiasuniversity.edu.in", password: await hashPassword("admin123"), name: "Admin", role: "admin" } });
  console.log("Created admin");

  for (let d = 0; d < departments.length; d++) {
    const courses = [];
    for (let c = 0; c < courseNames[d].length; c++) {
      courses.push({ name: courseNames[d][c], code: `${prefixes[d]}${100 + c}`, credits: 4, departmentId: departments[d].id });
    }
    await prisma.course.createMany({ data: courses });
  }
  console.log("Created 150 courses");

  const teacherHash = await hashPassword("teacher123");
  const teacherUsers = [];
  let teacherIdx = 0;
  const teachersPerDept = 9;
  const extraDepts = 29;

  for (let d = 0; d < departments.length; d++) {
    const count = teachersPerDept + (d < extraDepts ? 1 : 0);
    for (let t = 0; t < count; t++) {
      const name = getTeacherName(teacherIdx);
      teacherUsers.push({
        email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}${teacherIdx}@galgotiasuniversity.edu.in`,
        password: teacherHash,
        name,
        role: "teacher",
        departmentId: departments[d].id,
      });
      teacherIdx++;
    }
  }

  const batchSize = 100;
  const allTeacherRecords = [];
  for (let i = 0; i < teacherUsers.length; i += batchSize) {
    const batch = teacherUsers.slice(i, i + batchSize);
    await prisma.user.createMany({ data: batch });
    const created = await prisma.user.findMany({
      where: { email: { in: batch.map((u) => u.email) } },
    });
    for (const user of created) {
      const idx = teacherUsers.findIndex((u) => u.email === user.email);
      allTeacherRecords.push({
        userId: user.id,
        employeeId: `EMP${String(idx + 1).padStart(4, "0")}`,
        specialization: specializations[idx % specializations.length],
        departmentId: user.departmentId,
      });
    }
  }
  await prisma.teacher.createMany({ data: allTeacherRecords });
  console.log(`Created ${allTeacherRecords.length} teachers`);

  // Add Dr. Bhadarinarayana to L&T department (last one)
  const ltDept = departments.find((d) => d.code === "LNT");
  if (ltDept) {
    const bhash = await hashPassword("teacher123");
    const bUser = await prisma.user.create({
      data: { email: "dr..bhadarinarayana@galgotiasuniversity.edu.in", password: bhash, name: "Dr. Bhadarinarayana", role: "teacher", departmentId: ltDept.id },
    });
    await prisma.teacher.create({
      data: { userId: bUser.id,       employeeId: "EMP0300", specialization: "Project Management", departmentId: ltDept.id },
    });
    console.log("Added Dr. Bhadarinarayana to L&T");
  }

  const studentHash = await hashPassword("student123");
  const allStudentUsers = [];
  const allStudentRecords = [];
  let studentNum = 0;

  const deptStudentCounts = departments.map(() => 534);

  for (let d = 0; d < departments.length; d++) {
    for (let s = 0; s < deptStudentCounts[d]; s++) {
      studentNum++;
      allStudentUsers.push({
        email: `student${studentNum}@galgotiasuniversity.edu.in`,
        password: studentHash,
        name: `Student ${studentNum}`,
        role: "student",
        departmentId: departments[d].id,
      });
    }
  }

  for (let i = 0; i < allStudentUsers.length; i += batchSize) {
    const batch = allStudentUsers.slice(i, i + batchSize);
    await prisma.user.createMany({ data: batch });
    const created = await prisma.user.findMany({
      where: { email: { in: batch.map((u) => u.email) } },
    });
    for (const user of created) {
      const idx = allStudentUsers.findIndex((u) => u.email === user.email);
      const deptIdx = departments.findIndex((d) => d.id === user.departmentId);
      const count = deptStudentCounts[deptIdx];
      const localIdx = idx - (deptIdx === 0 ? 0 : deptStudentCounts.slice(0, deptIdx).reduce((a, b) => a + b, 0));
      const year = Math.floor((localIdx * 4) / count) + 1;
      const studentIndexInYear = localIdx - Math.floor((year - 1) * count / 4);
      const sec = String(Math.floor(studentIndexInYear / 54) + 1);
      allStudentRecords.push({
        userId: user.id,
        enrollmentNo: `GU${String(idx + 1).padStart(6, "0")}`,
        year,
        section: sec,
        departmentId: user.departmentId,
      });
    }
    if (i % 500 === 0) console.log(`  Processing students... ${i}/${allStudentUsers.length}`);
  }
  await prisma.student.createMany({ data: allStudentRecords });

  const students = await prisma.student.findMany({ select: { id: true } });
  const offDayData = [];
  for (const st of students) {
    offDayData.push({ studentId: st.id, day: "Saturday" }, { studentId: st.id, day: "Sunday" });
  }
  for (let i = 0; i < offDayData.length; i += 500) {
    await prisma.offDay.createMany({ data: offDayData.slice(i, i + 500) });
  }
  console.log(`Created ${allStudentRecords.length} students with off days`);

  console.log("Database seeded successfully!");
  console.log(`Stats: ${departments.length} departments, 4 blocks, 600 rooms, ${allTeacherRecords.length + 1} teachers, ${allStudentRecords.length} students, ${departments.length * 5} courses`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
