import type {
  Student, TPOFaculty, Company, Post, NotificationItem, PendingItem, AppSettings, User,
} from "./types";

export const SETTINGS: AppSettings = {
  collegeName: "ADCET — Ashokrao Mane College of Engineering",
  academicYear: "2024-25",
  tpoEmail: "tpo@adcet.ac.in",
  emailDomainRestrict: true,
  allowedDomains: ["adcet.ac.in"],
  notify: { onApproval: true, onRejection: true, onPlacement: true },
  eligibility: { tenthMin: 60, twelfthMin: 60, cgpaMin: 6.0, combined: false },
};

export const FACULTY: TPOFaculty[] = [
  { id: "f1", name: "Dr. Anita Deshpande", email: "anita.dean@adcet.ac.in", phone: "9876500001", department: "All", role: "tpo-admin" },
  { id: "f2", name: "Prof. Rajeev Khedkar", email: "rajeev.tpo@adcet.ac.in", phone: "9876500002", department: "All", role: "tpo-co-admin" },
  { id: "f3", name: "Prof. Smita Patil", email: "smita.cse@adcet.ac.in", phone: "9876500003", department: "Computer Engineering", role: "tpo-department" },
  { id: "f4", name: "Prof. Nilesh Kale", email: "nilesh.mod@adcet.ac.in", phone: "9876500004", department: "All", role: "moderator" },
];

export const COMPANIES: Company[] = [
  { id: "c1", name: "TCS", industry: "IT Services", website: "tcs.com", location: "Pune", ctcMin: 3.5, ctcMax: 7, addedOn: "2025-08-12", hrName: "Riya Shah", hrEmail: "hr@tcs.com", hrPhone: "9000000001", description: "Tata Consultancy Services — global IT services & consulting." },
  { id: "c2", name: "Infosys", industry: "IT Services", website: "infosys.com", location: "Bengaluru", ctcMin: 3.6, ctcMax: 8, addedOn: "2025-08-20", hrName: "Amit Rao", hrEmail: "hr@infosys.com", hrPhone: "9000000002", description: "Digital services & consulting major." },
  { id: "c3", name: "Cognizant", industry: "IT Services", website: "cognizant.com", location: "Chennai", ctcMin: 4, ctcMax: 9, addedOn: "2025-09-02", hrName: "Neha Verma", hrEmail: "hr@cognizant.com", hrPhone: "9000000003", description: "Professional services in IT & consulting." },
  { id: "c4", name: "L&T", industry: "Engineering & Construction", website: "larsentoubro.com", location: "Mumbai", ctcMin: 4.5, ctcMax: 10, addedOn: "2025-09-18", hrName: "Karan Mehta", hrEmail: "hr@lnt.com", hrPhone: "9000000004", description: "Engineering, procurement & construction conglomerate." },
];

export const STUDENTS: Student[] = [
  {
    id: "s1", userId: "u-student", name: "Aryan Patil", email: "aryan@adcet.ac.in",
    prn: "PRN2021001", rollNumber: "CSE-21-01", department: "Computer Engineering",
    year: "Fourth", division: "A", cgpa: 8.4, backlogs: 0, activeBacklogs: false,
    tenth: { board: "Maharashtra Board", school: "New English School", year: "2019", percentage: 88 },
    twelfth: { board: "Maharashtra Board", school: "Vivekanand College", year: "2021", percentage: 81, stream: "Science", type: "12th" },
    gender: "Male", mobile: "9876543210", city: "Kolhapur", state: "Maharashtra", pin: "416001",
    category: "General", skills: ["React", "Node.js", "Python"], languages: ["English", "Marathi", "Hindi"],
    linkedin: "linkedin.com/in/aryan", github: "github.com/aryan",
    status: "verified", placementStatus: "Placed", placedCompany: "TCS", packageLpa: 6.5,
  },
  {
    id: "s2", userId: "u2", name: "Sneha Joshi", email: "sneha@adcet.ac.in",
    prn: "PRN2021002", rollNumber: "CSE-21-02", department: "Computer Engineering",
    year: "Fourth", division: "A", cgpa: 9.1, backlogs: 0, activeBacklogs: false,
    tenth: { board: "CBSE", school: "DAV Public School", year: "2019", percentage: 92 },
    twelfth: { board: "CBSE", school: "DAV Public School", year: "2021", percentage: 89, stream: "Science", type: "12th" },
    gender: "Female", mobile: "9876543211", city: "Sangli", state: "Maharashtra", pin: "416416",
    category: "General", skills: ["Java", "Spring", "SQL"], languages: ["English", "Hindi"],
    status: "verified", placementStatus: "Placed", placedCompany: "Infosys", packageLpa: 7.2,
  },
  {
    id: "s3", userId: "u3", name: "Rahul Kamble", email: "rahul@adcet.ac.in",
    prn: "PRN2021003", rollNumber: "MEC-21-08", department: "Mechanical",
    year: "Fourth", division: "B", cgpa: 6.8, backlogs: 1, activeBacklogs: false,
    tenth: { board: "Maharashtra Board", school: "Shahu Vidyalaya", year: "2019", percentage: 72 },
    twelfth: { board: "MSBTE", school: "Govt. Polytechnic", year: "2021", percentage: 74, stream: "Mechanical", type: "Diploma" },
    gender: "Male", mobile: "9876543212", city: "Ichalkaranji", state: "Maharashtra", pin: "416115",
    category: "OBC", skills: ["AutoCAD", "SolidWorks"], languages: ["Marathi", "Hindi"],
    status: "verified", placementStatus: "In Process",
  },
  {
    id: "s4", userId: "u4", name: "Priya More", email: "priya@adcet.ac.in",
    prn: "PRN2021004", rollNumber: "ENT-21-15", department: "Electronics",
    year: "Third", division: "A", cgpa: 7.9, backlogs: 0, activeBacklogs: false,
    tenth: { board: "Maharashtra Board", school: "St. Xavier's", year: "2020", percentage: 84 },
    twelfth: { board: "Maharashtra Board", school: "St. Xavier's", year: "2022", percentage: 79, stream: "Science", type: "12th" },
    gender: "Female", mobile: "9876543213", city: "Pune", state: "Maharashtra", pin: "411001",
    category: "General", skills: ["VLSI", "Embedded C"], languages: ["English", "Marathi"],
    status: "pending", placementStatus: "Not Placed",
  },
  {
    id: "s5", userId: "u5", name: "Omkar Shinde", email: "omkar@adcet.ac.in",
    prn: "PRN2022014", rollNumber: "CIV-22-03", department: "Civil",
    year: "Third", division: "C", cgpa: 5.4, backlogs: 3, activeBacklogs: true,
    tenth: { board: "Maharashtra Board", school: "Modern High", year: "2020", percentage: 58 },
    twelfth: { board: "Maharashtra Board", school: "Modern Jr. College", year: "2022", percentage: 62, stream: "Science", type: "12th" },
    gender: "Male", mobile: "9876543214", city: "Satara", state: "Maharashtra", pin: "415001",
    category: "SC", skills: ["AutoCAD", "Surveying"], languages: ["Marathi"],
    status: "draft", placementStatus: "Not Placed",
  },
];

export const POSTS: Post[] = [
  {
    id: "p1", type: "Notice", title: "TCS NQT 2025 — Eligibility & Schedule",
    body: "All eligible students from CSE, IT, ENTC must register on the TCS portal by Friday. Test window opens next Monday across 3 slots. Please ensure your TCS NQT profile is complete and verified.",
    authorName: "Prof. Rajeev Khedkar", authorRole: "TPO Co-Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 24, comments: [
      { id: "c1", author: "Aryan Patil", role: "Student", text: "Registered. Thanks!", createdAt: new Date().toISOString() },
    ],
  },
  {
    id: "p2", type: "Post", title: "Pre-placement talk — Infosys",
    body: "Infosys is conducting a PPT on 28th May at Auditorium-1, 11:00 AM. Open to all final-year students. Snacks will be provided. Don't miss the Q&A with hiring managers!",
    authorName: "Prof. Smita Patil", authorRole: "Dept. TPO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    likes: 12, comments: [],
  },
  {
    id: "p3", type: "Message", title: "Reminder: Submit your verified profile",
    body: "Profiles in 'draft' state won't be considered for upcoming drives. Please complete and submit for verification at the earliest.",
    authorName: "Dr. Anita Deshpande", authorRole: "TPO Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likes: 7, comments: [],
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Your profile was approved ✓", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false, type: "approval" },
  { id: "n2", title: "New notice posted by TPO", body: "TCS NQT 2025 schedule", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false, type: "notice" },
  { id: "n3", title: "Update request rejected", body: "Reason: certificate not legible", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true, type: "rejection" },
];

export const PENDING: PendingItem[] = [
  { id: "pv1", kind: "new", studentId: "s4", studentName: "Priya More", prn: "PRN2021004", department: "Electronics", submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  {
    id: "pv2", kind: "update", studentId: "s1", studentName: "Aryan Patil", prn: "PRN2021001", department: "Computer Engineering",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    changes: [
      { field: "Mobile", before: "9876543210", after: "9123456780" },
      { field: "City", before: "Kolhapur", after: "Pune" },
      { field: "CGPA", before: "8.2", after: "8.4" },
    ],
  },
];

export const DEMO_USERS: (User & { password: string })[] = [
  { id: "u-student", name: "Aryan Patil", email: "student@adcet.ac.in", role: "student", password: "password" },
  { id: "u-admin", name: "Dr. Anita Deshpande", email: "admin@adcet.ac.in", role: "tpo-admin", password: "password" },
  { id: "u-dept", name: "Prof. Smita Patil", email: "dept@adcet.ac.in", role: "tpo-department", department: "Computer Engineering", password: "password" },
];

export const DEPARTMENTS = ["Computer Engineering", "Mechanical", "Civil", "Electronics", "Information Technology", "Electrical"];
