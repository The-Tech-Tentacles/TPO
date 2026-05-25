export type Role = "student" | "tpo-admin" | "tpo-co-admin" | "tpo-department" | "moderator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  prn: string;
  rollNumber: string;
  department: string;
  year: "First" | "Second" | "Third" | "Fourth";
  division: "A" | "B" | "C";
  cgpa: number;
  backlogs: number;
  activeBacklogs: boolean;
  tenth: { board: string; school: string; year: string; percentage: number };
  twelfth: {
    board: string;
    school: string;
    year: string;
    percentage: number;
    stream: string;
    type: "12th" | "Diploma";
  };
  gender: "Male" | "Female" | "Other";
  mobile: string;
  city: string;
  state: string;
  pin: string;
  category: string;
  skills: string[];
  languages: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  status: "draft" | "pending" | "verified" | "rejected";
  placementStatus: "Placed" | "Not Placed" | "In Process";
  placedCompany?: string;
  packageLpa?: number;
  blacklisted?: boolean;
  avatarUrl?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  emailAddress?: string;
  emailId?: string;
  fullNameFormatted?: string;
  companyName?: string;
  urnNumber?: string;
  parentName?: string;
  parentRelation?: string;
  parentEmail?: string;
  parentsMobile?: string;
  caste?: string;
  interestedInPlacements?: boolean;
  interestedInHigherStudies?: boolean;
  interestedInEntrepreneurship?: boolean;
  interestedInCivilServices?: boolean;
  internshipsCount?: number;
  foreignLanguageCertificateDetails?: string;
  nptelAndCertificationDetails?: string;
  professionalBodyMembership?: string;
  paperPresentationsParticipatedCount?: number;
  paperPresentationsWonCount?: number;
  eventsParticipatedCount?: number;
  eventsWonCount?: number;
  acceptsPlacementPolicy?: boolean;
  parentsIncomeRange?: string;
  aggregateTillCurrentSemester?: number;
  currentSemester?: number;
  liveBacklogsOrNa?: string;
  parentOccupation?: string;
  areaSpecialization?: string;
  projects?: string;
  photoFileName?: string;
  resumeFileName?: string;
}

export interface TPOFaculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: Exclude<Role, "student">;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  description?: string;
  hrName?: string;
  hrEmail?: string;
  hrPhone?: string;
  location?: string;
  ctcMin?: number;
  ctcMax?: number;
  logoUrl?: string;
  addedOn: string;
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Post {
  id: string;
  type: "Post" | "Notice" | "Poll";
  title: string;
  body: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  imageUrl?: string;
  likes: number;
  likedByMe?: boolean;
  comments: Comment[];
  audience?: string[];
  pollOptions?: PollOption[];
  pollVotedOptionId?: string;
}


export interface PendingItem {
  id: string;
  kind: "new" | "update";
  studentId: string;
  studentName: string;
  prn: string;
  department: string;
  submittedAt: string;
  changes?: { field: string; before: string; after: string }[];
}

export interface EligibilityCriteria {
  tenthMin: number;
  twelfthMin: number;
  cgpaMin: number;
  combined: boolean;
}

export interface AppSettings {
  collegeName: string;
  academicYear: string;
  tpoEmail: string;
  emailDomainRestrict: boolean;
  allowedDomains: string[];
  eligibility: EligibilityCriteria;
}
