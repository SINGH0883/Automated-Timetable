const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient({ log: ["error"] });

async function hashPassword(password) {
  return bcrypt.hash(password, 4); // faster rounds for seed
}

async function main() {
  const existing = await prisma.user.findFirst({ where: { role: "admin" } });
  if (existing) {
    console.log("Already seeded");
    return;
  }

  const departments = [
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
  ];

  const createdDepts = [];
  for (const d of departments) {
    createdDepts.push(await prisma.department.create({ data: d }));
  }
  console.log("Created 10 departments");

  // Blocks + rooms
  for (let i = 0; i < createdDepts.length; i++) {
    const block = await prisma.block.create({
      data: { name: `Block ${String.fromCharCode(65 + i)}`, code: `BLK-${String.fromCharCode(65 + i)}`, departmentId: createdDepts[i].id },
    });
    const rooms = [];
    for (let r = 1; r <= 4; r++) {
      rooms.push({ blockId: block.id, roomNumber: `${block.code}-${100 + r}`, capacity: 60 });
    }
    await prisma.room.createMany({ data: rooms });
  }
  console.log("Created 10 blocks with 40 rooms");

  // Admin
  await prisma.user.create({ data: { email: "admin@galgotiasuniversity.edu.in", password: await hashPassword("admin123"), name: "Admin", role: "admin" } });
  console.log("Created admin");

  // Courses (5 per department)
  const courseData = [
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
  ];
  const prefixes = ["CS","AI","EN","BM","LW","FC","FS","CA","MS","DS"];

  for (let d = 0; d < createdDepts.length; d++) {
    const courses = [];
    for (let c = 0; c < courseData[d].length; c++) {
      courses.push({ name: courseData[d][c], code: `${prefixes[d]}${100 + c}`, credits: 4, departmentId: createdDepts[d].id });
    }
    await prisma.course.createMany({ data: courses });
  }
  console.log("Created 50 courses");

  // Teachers - 200 (20 per department)
  const teacherNames = [
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
    "Dr. Rajendra Gupta","Dr. Neena Gupta","Dr. Surekha Sikri",
    "Dr. Benjamin Gilani","Dr. Sharmila Tagore","Dr. Anupam Kher","Dr. Waheeda Rehman",
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
  ];

  const teacherHash = await hashPassword("teacher123");
  const teacherUsers = [];
  let teacherIdx = 0;
  for (let d = 0; d < createdDepts.length; d++) {
    for (let t = 0; t < 20; t++) {
      if (teacherIdx >= teacherNames.length) break;
      const name = teacherNames[teacherIdx];
      teacherUsers.push({
        email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}${teacherIdx}@galgotiasuniversity.edu.in`,
        password: teacherHash,
        name,
        role: "teacher",
        departmentId: createdDepts[d].id,
      });
      teacherIdx++;
    }
  }

  // Batch create teachers
  const batchSize = 50;
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

  // Students - batch 100 at a time
  const studentHash = await hashPassword("student123");
  const sections = ["A", "B", "C"];
  const allStudentUsers = [];
  const allStudentRecords = [];
  let studentNum = 0;

  for (let d = 0; d < createdDepts.length; d++) {
    for (let s = 0; s < 400; s++) {
      studentNum++;
      const name = `Student ${studentNum}`;
      allStudentUsers.push({
        email: `student${studentNum}@galgotiasuniversity.edu.in`,
        password: studentHash,
        name,
        role: "student",
        departmentId: createdDepts[d].id,
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
      const year = Math.floor(idx / 100) % 4 + 1;
      const sec = sections[idx % 3];
      allStudentRecords.push({
        userId: user.id,
        enrollmentNo: `GU${String(idx + 1).padStart(6, "0")}`,
        year,
        section: sec,
        departmentId: user.departmentId,
      });
    }
  }
  await prisma.student.createMany({ data: allStudentRecords });

  // Off days
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
  console.log(`Stats: 10 departments, 10 blocks, 40 rooms, ${allTeacherRecords.length} teachers, ${allStudentRecords.length} students, 50 courses`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
