"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Github,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DEPARTMENTS } from "@/lib/dummy-data";
import { useApp } from "@/lib/store";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

const toPhone = (v: string) =>
  v.replace(/\D/g, "").replace(/^91/, "").replace(/^0/, "").slice(0, 10);

type SkillCategory = "TECHNICAL" | "SOFT_SKILL" | "TOOL" | "FRAMEWORK";
type ProjectType = "ACADEMIC" | "PERSONAL" | "INTERNSHIP" | "FREELANCE" | "OPEN_SOURCE";

type SkillItem = {
  skill_name: string;
  skill_category: SkillCategory;
};
type ProjectItem = {
  title: string;
  description?: string;
  technologies: string;
  project_type: ProjectType;
  start_date?: string;
  end_date?: string;
  is_ongoing: boolean;
  team_size?: string;
  role?: string;
  project_url?: string;
  github_url?: string;
};
type CertificationItem = {
  name: string;
  organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
};
type ExperienceType = "INTERNSHIP" | "FULL_TIME" | "PART_TIME" | "FREELANCE" | "TRAINING";
type WorkMode = "WFO" | "WFH" | "HYBRID";
type ExperienceItem = {
  company_name: string;
  role: string;
  experience_type: ExperienceType;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location: string;
  work_mode: WorkMode;
  projects_worked?: string;
};
type EventLevel = "INTERNATIONAL" | "NATIONAL" | "STATE" | "DISTRICT" | "COLLEGE" | "LOCAL";
type EventCategory = "EVENT" | "PAPER_PRESENTATION" | "HACKATHON" | "WORKSHOP" | "COMPETITION";
type AchievementItem = {
  event_name: string;
  event_date: string;
  place: string;
  level: EventLevel;
  category: EventCategory;
  won: boolean;
  position_or_award?: string;
  details?: string;
};

type LinkItem = {
  title: string;
  url: string;
};

const parseJsonLines = <T,>(value: string | undefined, fallback: (line: string) => T): T[] =>
  (value ?? "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as T;
      } catch {
        return fallback(line);
      }
    });

const stringifyJsonLines = <T,>(items: T[]) => items.map((i) => JSON.stringify(i)).join("\n");
const parsePlainLines = (value: string | undefined) =>
  (value ?? "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
const stringifyPlainLines = (items: string[]) => items.join("\n");

const emptyStudent = (name: string, email: string, id: string): Student => ({
  id,
  userId: id,
  name,
  email,
  urn: "",
  rollNumber: "",
  department: "",
  year: "Fourth",
  division: "A",
  cgpa: 0,
  backlogs: 0,
  activeBacklogs: false,
  admissionMonth: "",
  admissionYear: "",
  passoutYear: "",
  tenth: { board: "", school: "", year: "", percentage: 0 },
  twelfth: { board: "", school: "", year: "", percentage: 0, stream: "Science", type: "12th" },
  gender: "Male",
  mobile: "",
  city: "",
  state: "",
  pin: "",
  dist: "",
  addressLine: "",
  category: "General",
  skills: [],
  languages: [],
  status: "draft",
  placementStatus: "Not Placed",
  firstName: "",
  middleName: "",
  surname: "",
  emailAddress: email,
  emailId: email,
  fullNameFormatted: "",
  companyName: "",
  urnNumber: "",
  parentName: "",
  parentRelation: "",
  parentEmail: "",
  parentsMobile: "",
  caste: "",
  interestedInPlacements: true,
  interestedInHigherStudies: false,
  interestedInEntrepreneurship: false,
  interestedInCivilServices: false,
  internshipsCount: 0,
  foreignLanguageCertificateDetails: "",
  nptelAndCertificationDetails: "",
  professionalBodyMembership: "",
  paperPresentationsParticipatedCount: 0,
  paperPresentationsWonCount: 0,
  eventsParticipatedCount: 0,
  eventsWonCount: 0,
  acceptsPlacementPolicy: false,
  parentsIncomeRange: "",
  aggregateTillCurrentSemester: 0,
  currentSemester: 0,
  liveBacklogsOrNa: "NA",
  parentOccupation: "",
  areaSpecialization: "",
  projects: "",
  photoFileName: "",
  resumeFileName: "",
  fatherName: "",
  fatherOccupation: "",
  fatherMobile: "",
  fatherEmail: "",
  fatherSalary: 0,
  motherName: "",
  motherOccupation: "",
  motherMobile: "",
  motherEmail: "",
  motherSalary: 0,
  tenthMarksheetFileName: "",
  twelfthMarksheetFileName: "",
  aadharFileName: "",
  yearMarksheetFileNames: {},
});

export function StudentProfilePage() {
  const { user, state, setState } = useApp();
  const existing = state.students.find(
    (s) => s.userId === user?.id || s.email.toLowerCase() === user?.email.toLowerCase(),
  );
  const [draft, setDraft] = useState<Student>(
    () => existing ?? emptyStudent(user?.name ?? "", user?.email ?? "", `s-${user?.id}`),
  );
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [skillDraft, setSkillDraft] = useState<SkillItem>({
    skill_name: "",
    skill_category: "TECHNICAL",
  });
  const [projectDraft, setProjectDraft] = useState<ProjectItem>({
    title: "",
    description: "",
    technologies: "",
    project_type: "PERSONAL",
    start_date: "",
    end_date: "",
    is_ongoing: false,
    team_size: "",
    role: "",
    project_url: "",
    github_url: "",
  });
  const [certDraft, setCertDraft] = useState<CertificationItem>({
    name: "",
    organization: "",
    issue_date: "",
    expiry_date: "",
    credential_id: "",
    credential_url: "",
  });
  const [experienceDraft, setExperienceDraft] = useState<ExperienceItem>({
    company_name: "",
    role: "",
    experience_type: "INTERNSHIP",
    start_date: "",
    end_date: "",
    is_current: false,
    location: "",
    work_mode: "WFO",
    projects_worked: "",
  });
  const [achievementDraft, setAchievementDraft] = useState<AchievementItem>({
    event_name: "",
    event_date: "",
    place: "",
    level: "COLLEGE",
    category: "EVENT",
    won: false,
    position_or_award: "",
    details: "",
  });

  const [deletingSkillIndex, setDeletingSkillIndex] = useState<number | null>(null);
  const [deletingProjectIndex, setDeletingProjectIndex] = useState<number | null>(null);
  const [deletingCertIndex, setDeletingCertIndex] = useState<number | null>(null);
  const [deletingExperienceIndex, setDeletingExperienceIndex] = useState<number | null>(null);
  const [deletingAchievementIndex, setDeletingAchievementIndex] = useState<number | null>(null);
  const [deletingLinkIndex, setDeletingLinkIndex] = useState<number | null>(null);
  const [linkDraft, setLinkDraft] = useState<LinkItem>({ title: "", url: "" });
  const [languageDraft, setLanguageDraft] = useState("");
  const [professionalBodyDraft, setProfessionalBodyDraft] = useState("");
  const [backlogDraft, setBacklogDraft] = useState({ sem: 1, subject: "" });
  const [backlogOpen, setBacklogOpen] = useState(false);

  const update = <K extends keyof Student>(k: K, v: Student[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));
  const phoneValid = (p: string) => /^[6-9]\d{9}$/.test(p);

  const skillItems = parseJsonLines<SkillItem>(draft.skills.join("\n"), (line) => ({
    skill_name: line,
    skill_category: "TECHNICAL",
  }));
  const projectItems = parseJsonLines<ProjectItem>(draft.projects, (line) => ({
    title: line,
    description: "",
    technologies: "",
    project_type: "PERSONAL",
    is_ongoing: false,
  }));
  const certItems = parseJsonLines<CertificationItem>(
    draft.nptelAndCertificationDetails,
    (line) => ({
      name: line,
      organization: "",
      issue_date: "",
    }),
  );
  const experienceItems = parseJsonLines<ExperienceItem>(draft.areaSpecialization, (line) => ({
    company_name: line,
    role: "",
    experience_type: "INTERNSHIP",
    start_date: "",
    end_date: "",
    is_current: false,
    location: "",
    work_mode: "WFO",
    projects_worked: "",
  }));
  const achievementItems = parseJsonLines<AchievementItem>(
    draft.foreignLanguageCertificateDetails,
    (line) => ({
      event_name: line,
      event_date: "",
      place: "",
      level: "COLLEGE",
      category: "EVENT",
      won: false,
      position_or_award: "",
      details: "",
    }),
  );
  const professionalBodyItems = parsePlainLines(draft.professionalBodyMembership);
  const linkItems = parseJsonLines<LinkItem>(draft.additionalLinks, (line) => ({ title: line, url: "" }));

  const sections = useMemo(
    () => [
      {
        title: "Identity & Contact",
        done: !!(draft.firstName && draft.surname && phoneValid(draft.mobile)),
      },
      {
        title: "Parents Info",
        done: !!(draft.fatherName && draft.motherName && phoneValid(draft.parentsMobile ?? "")),
      },
      {
        title: "Academic & Eligibility",
        done: !!(
          draft.department &&
          draft.urn &&
          draft.aggregateTillCurrentSemester &&
          draft.urnNumber &&
          draft.admissionYear &&
          draft.admissionMonth &&
          draft.passoutYear
        ),
      },
      {
        title: "Previous Education",
        done: !!(draft.tenth?.percentage && draft.twelfth?.percentage),
      },
      {
        title: "Career Preferences & Achievements",
        done: !!(achievementItems.length || professionalBodyItems.length || certItems.length),
      },
      { title: "Experience", done: experienceItems.length > 0 },
      { title: "Skills + Projects", done: draft.skills.length > 0 || !!draft.projects },
      {
        title: "Links",
        done: !!(draft.linkedin || draft.github || draft.portfolio || linkItems.length > 0),
      },
      { title: "Uploads", done: !!(draft.photoFileName && draft.resumeFileName) },
    ],
    [
      achievementItems.length,
      certItems.length,
      draft,
      experienceItems.length,
      professionalBodyItems.length,
      linkItems.length,
    ],
  );

  const completed = sections.filter((s) => s.done).length;
  const pct = Math.round((completed / sections.length) * 100);

  const persist = (next: Student) => {
    setState((s) => {
      const exists = s.students.find((x) => x.id === next.id);
      return {
        ...s,
        students: exists
          ? s.students.map((x) => (x.id === next.id ? next : x))
          : [...s.students, next],
      };
    });
  };

  if (submitted)
    return (
      <div className="grid place-items-center py-20 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-12 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Profile submitted!</h2>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>
          Back to profile
        </Button>
      </div>
    );

  const glassCard = "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all";

  return (
    <div className="space-y-4 pb-32">
      <Card className={cn(glassCard, "p-5")}>
        <div className="flex items-center gap-3">
          <AvatarCircle name={draft.name} size={56} />
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-lg font-bold">{draft.name}</h1>
            <p className="truncate text-xs text-muted-foreground">{draft.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 dark:bg-blue-950/40">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                Completion
              </span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                {pct}%
              </span>
            </div>
          </div>
        </div>
        <Progress value={pct} className="mt-4 h-2 animate-pulse" />
      </Card>

      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400">
        <span className="font-semibold">NOTE:</span> Before exiting, make sure you save your draft
        so you don't lose your progress.
      </div>

      {sections.map((sec, idx) => {
        const open = openSection === idx;
        return (
          <Card key={sec.title} className={cn(glassCard, "overflow-hidden p-0")}>
            <button
              onClick={() => setOpenSection(open ? null : idx)}
              className="flex w-full items-center gap-3 p-4 text-left hover:bg-secondary/50"
            >
              <div
                className={cn(
                  "grid size-7 place-items-center rounded-full border",
                  sec.done
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {sec.done ? (
                  <Check className="size-4" />
                ) : (
                  <span className="text-xs font-semibold">{idx + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{sec.title}</div>
              </div>
              <ChevronDown
                className={cn("size-4 text-muted-foreground transition", open && "rotate-180")}
              />
            </button>
            {open && (
              <div className="space-y-3 border-t p-4">
                {idx === 0 && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="First Name">
                        <Input
                          value={draft.firstName ?? ""}
                          onChange={(e) => update("firstName", e.target.value)}
                          placeholder="e.g. John"
                        />
                      </Field>
                      <Field label="Middle Name">
                        <Input
                          value={draft.middleName ?? ""}
                          onChange={(e) => update("middleName", e.target.value)}
                          placeholder="e.g. Robert"
                        />
                      </Field>
                      <Field label="Surname">
                        <Input
                          value={draft.surname ?? ""}
                          onChange={(e) => update("surname", e.target.value)}
                          placeholder="e.g. Doe"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Date of Birth">
                        <DatePicker
                          date={draft.dob ? new Date(draft.dob) : undefined}
                          setDate={(d) => update("dob", d ? d.toISOString() : undefined)}
                          placeholder="Select Date of Birth"
                        />
                      </Field>
                      <Field label="Email Address">
                        <Input
                          value={draft.emailAddress ?? ""}
                          onChange={(e) => {
                            update("emailAddress", e.target.value);
                            update("emailId", e.target.value);
                          }}
                          placeholder="e.g. john.doe@example.com"
                        />
                      </Field>
                      <Field label="Mobile Number">
                        <Input
                          value={draft.mobile}
                          onChange={(e) => update("mobile", toPhone(e.target.value))}
                          maxLength={10}
                          placeholder="e.g. 9876543210"
                          className={
                            draft.mobile && !phoneValid(draft.mobile) ? "border-destructive" : ""
                          }
                        />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Caste">
                        <Input
                          value={draft.caste ?? ""}
                          onChange={(e) => update("caste", e.target.value)}
                          placeholder="e.g. Hindu - Maratha"
                        />
                      </Field>
                      <Field label="Category">
                        <Input
                          value={draft.category ?? ""}
                          onChange={(e) => update("category", e.target.value)}
                          placeholder="e.g. OBC / SC / ST / General"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Gender">
                        <Select
                          value={draft.gender}
                          onValueChange={(v) => update("gender", v as Student["gender"])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Address Line">
                        <Input
                          value={draft.addressLine ?? ""}
                          onChange={(e) => update("addressLine", e.target.value)}
                          placeholder="e.g. 123 Main Street, Apt 4B"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-4">
                      <Field label="State">
                        <Input
                          value={draft.state ?? ""}
                          onChange={(e) => update("state", e.target.value)}
                          placeholder="e.g. Maharashtra"
                        />
                      </Field>
                      <Field label="City">
                        <Input
                          value={draft.city ?? ""}
                          onChange={(e) => update("city", e.target.value)}
                          placeholder="e.g. Pune"
                        />
                      </Field>
                      <Field label="District">
                        <Input
                          value={draft.dist ?? ""}
                          onChange={(e) => update("dist", e.target.value)}
                          placeholder="e.g. Pune"
                        />
                      </Field>
                      <Field label="Pincode">
                        <Input
                          value={draft.pin ?? ""}
                          onChange={(e) => update("pin", e.target.value)}
                          placeholder="e.g. 411001"
                        />
                      </Field>
                    </div>
                  </>
                )}

                {idx === 1 && (
                  <>
                    {/* Father Details */}
                    <div className="rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4 space-y-3">
                      <p className="text-sm font-semibold border-b pb-2">Father's Details</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Father's Name">
                          <Input
                            value={draft.fatherName ?? ""}
                            onChange={(e) => update("fatherName", e.target.value)}
                            placeholder="e.g. Rajesh Sharma"
                          />
                        </Field>
                        <Field label="Father's Occupation">
                          <Input
                            value={draft.fatherOccupation ?? ""}
                            onChange={(e) => update("fatherOccupation", e.target.value)}
                            placeholder="e.g. Farmer / Business"
                          />
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Father's Mobile">
                          <Input
                            value={draft.fatherMobile ?? ""}
                            onChange={(e) => update("fatherMobile", toPhone(e.target.value))}
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            className={
                              draft.fatherMobile && !phoneValid(draft.fatherMobile)
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </Field>
                        <Field label="Father's Email (Optional)">
                          <Input
                            type="email"
                            value={draft.fatherEmail ?? ""}
                            onChange={(e) => update("fatherEmail", e.target.value)}
                            placeholder="e.g. father@email.com"
                          />
                        </Field>
                      </div>
                      <Field label="Father's Annual Salary / Income (LPA)">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            value={draft.fatherSalary || ""}
                            onChange={(e) => update("fatherSalary", +e.target.value)}
                            placeholder="e.g. 3.5"
                          />
                          <span className="shrink-0 text-sm font-medium text-muted-foreground">
                            LPA
                          </span>
                        </div>
                      </Field>
                    </div>

                    {/* Mother Details */}
                    <div className="rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4 space-y-3">
                      <p className="text-sm font-semibold border-b pb-2">Mother's Details</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Mother's Name">
                          <Input
                            value={draft.motherName ?? ""}
                            onChange={(e) => update("motherName", e.target.value)}
                            placeholder="e.g. Sunita Sharma"
                          />
                        </Field>
                        <Field label="Mother's Occupation">
                          <Input
                            value={draft.motherOccupation ?? ""}
                            onChange={(e) => update("motherOccupation", e.target.value)}
                            placeholder="e.g. Homemaker / Teacher"
                          />
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Mother's Mobile">
                          <Input
                            value={draft.motherMobile ?? ""}
                            onChange={(e) => update("motherMobile", toPhone(e.target.value))}
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            className={
                              draft.motherMobile && !phoneValid(draft.motherMobile)
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </Field>
                        <Field label="Mother's Email (Optional)">
                          <Input
                            type="email"
                            value={draft.motherEmail ?? ""}
                            onChange={(e) => update("motherEmail", e.target.value)}
                            placeholder="e.g. mother@email.com"
                          />
                        </Field>
                      </div>
                      <Field label="Mother's Annual Salary / Income (LPA)">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            value={draft.motherSalary || ""}
                            onChange={(e) => update("motherSalary", +e.target.value)}
                            placeholder="e.g. 2"
                          />
                          <span className="shrink-0 text-sm font-medium text-muted-foreground">
                            LPA
                          </span>
                        </div>
                      </Field>
                    </div>
                  </>
                )}

                {idx === 2 && (
                  <>
                    <Field label="URN Number">
                      <Input
                        value={draft.urnNumber ?? ""}
                        onChange={(e) => update("urnNumber", e.target.value)}
                        placeholder="e.g. 1234567890"
                      />
                    </Field>
                    <Field label="Department">
                      <Select
                        value={draft.department}
                        onValueChange={(v) => update("department", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Admission Month">
                        <Select
                          value={draft.admissionMonth ?? ""}
                          onValueChange={(v) => update("admissionMonth", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Admission Year">
                        <Input
                          type="number"
                          min={2000}
                          max={2100}
                          value={draft.admissionYear ?? ""}
                          onChange={(e) => update("admissionYear", e.target.value)}
                          placeholder="e.g. 2021"
                        />
                      </Field>
                      <Field label="Passout / Graduation Year">
                        <Input
                          type="number"
                          min={2000}
                          max={2100}
                          value={draft.passoutYear ?? ""}
                          onChange={(e) => update("passoutYear", e.target.value)}
                          placeholder="e.g. 2025"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Current Semester">
                        <Input
                          type="number"
                          min={1}
                          max={8}
                          value={draft.currentSemester || ""}
                          onChange={(e) => update("currentSemester", +e.target.value)}
                          placeholder="e.g. 6"
                        />
                      </Field>
                      <Field label="Division">
                        <Select
                          value={draft.division}
                          onValueChange={(v) => update("division", v as Student["division"])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field label="Aggregate till current semester (%)">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={draft.aggregateTillCurrentSemester || ""}
                        onChange={(e) => update("aggregateTillCurrentSemester", +e.target.value)}
                        placeholder="e.g. 85.5"
                      />
                    </Field>
                    {/* Backlogs — collapsible */}
                    <div className="rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setBacklogOpen((o) => !o)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">Backlogs</p>
                          {(() => {
                            const entries: { sem: number; subject: string }[] = (() => {
                              try {
                                return JSON.parse(draft.liveBacklogsOrNa ?? "[]");
                              } catch {
                                return [];
                              }
                            })();
                            return (
                              <>
                                {entries.length > 0 && (
                                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    {entries.length} total
                                  </span>
                                )}
                                {draft.activeBacklogs && (
                                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    Active
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <ChevronDown
                          className={`size-4 text-muted-foreground transition-transform duration-200 ${backlogOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {backlogOpen && (
                        <div className="px-4 pb-4 space-y-3 border-t pt-3">
                          {/* Add form */}
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <Field label="Semester" className="w-28 shrink-0">
                                <Select
                                  value={String(backlogDraft.sem)}
                                  onValueChange={(v) => {
                                    const sem = +v;
                                    setBacklogDraft((d) => ({ ...d, sem }));
                                    if (sem === draft.currentSemester)
                                      update("activeBacklogs", true);
                                    else update("activeBacklogs", false);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sem" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from(
                                      { length: draft.currentSemester || 8 },
                                      (_, i) => i + 1,
                                    ).map((s) => (
                                      <SelectItem key={s} value={String(s)}>
                                        Sem {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </Field>
                              <Field label="Subject Name" className="flex-1">
                                <Input
                                  value={backlogDraft.subject}
                                  onChange={(e) =>
                                    setBacklogDraft((d) => ({ ...d, subject: e.target.value }))
                                  }
                                  placeholder="e.g. Mathematics II"
                                  onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    e.preventDefault();
                                    const subject = backlogDraft.subject.trim();
                                    if (!subject) return;
                                    const prev: { sem: number; subject: string }[] = (() => {
                                      try {
                                        return JSON.parse(draft.liveBacklogsOrNa ?? "[]");
                                      } catch {
                                        return [];
                                      }
                                    })();
                                    const next = [...prev, { sem: backlogDraft.sem, subject }];
                                    update("liveBacklogsOrNa", JSON.stringify(next));
                                    update("backlogs", next.length);
                                    if (backlogDraft.sem === draft.currentSemester)
                                      update("activeBacklogs", true);
                                    setBacklogDraft((d) => ({ ...d, subject: "" }));
                                  }}
                                />
                              </Field>
                            </div>
                            <Button
                              type="button"
                              className="w-full"
                              onClick={() => {
                                const subject = backlogDraft.subject.trim();
                                if (!subject) return;
                                const prev: { sem: number; subject: string }[] = (() => {
                                  try {
                                    return JSON.parse(draft.liveBacklogsOrNa ?? "[]");
                                  } catch {
                                    return [];
                                  }
                                })();
                                const next = [...prev, { sem: backlogDraft.sem, subject }];
                                update("liveBacklogsOrNa", JSON.stringify(next));
                                update("backlogs", next.length);
                                if (backlogDraft.sem === draft.currentSemester)
                                  update("activeBacklogs", true);
                                setBacklogDraft((d) => ({ ...d, subject: "" }));
                              }}
                            >
                              <Plus className="size-4 mr-1" /> Add Backlog
                            </Button>
                          </div>

                          {/* Entry list */}
                          {(() => {
                            const entries: { sem: number; subject: string }[] = (() => {
                              try {
                                return JSON.parse(draft.liveBacklogsOrNa ?? "[]");
                              } catch {
                                return [];
                              }
                            })();
                            const currentSem = draft.currentSemester;
                            if (entries.length === 0)
                              return (
                                <p className="text-xs text-muted-foreground">
                                  No backlogs added. Use the form above to record any backlog
                                  (current or past semester).
                                </p>
                              );
                            return (
                              <div className="space-y-1.5">
                                {entries.map((entry, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${entry.sem === currentSem
                                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                          }`}
                                      >
                                        Sem {entry.sem}
                                        {entry.sem === currentSem ? " (Active)" : " (Old)"}
                                      </span>
                                      <span className="text-sm">{entry.subject}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = entries.filter((_, j) => j !== i);
                                        update(
                                          "liveBacklogsOrNa",
                                          next.length ? JSON.stringify(next) : "NA",
                                        );
                                        update("backlogs", next.length);
                                        if (!next.some((e) => e.sem === currentSem))
                                          update("activeBacklogs", false);
                                      }}
                                      className="p-1 text-muted-foreground hover:text-destructive"
                                    >
                                      <X className="size-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}

                          {/* Auto-managed status — read only */}
                          <div className="flex items-center justify-between rounded-lg border bg-secondary/40 px-3 py-2">
                            <span className="text-xs text-muted-foreground">
                              Active backlogs status (auto-managed)
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${draft.activeBacklogs
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                }`}
                            >
                              {draft.activeBacklogs ? "Active" : "Clear"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {idx === 3 && (
                  <>
                    {/* 10th Standard */}
                    <div className="rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4 space-y-3">
                      <p className="text-sm font-semibold border-b pb-2">10th (SSC)</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Board">
                          <Input
                            value={draft.tenth?.board ?? ""}
                            onChange={(e) =>
                              update("tenth", { ...draft.tenth, board: e.target.value })
                            }
                            placeholder="e.g. Maharashtra State Board"
                          />
                        </Field>
                        <Field label="School Name">
                          <Input
                            value={draft.tenth?.school ?? ""}
                            onChange={(e) =>
                              update("tenth", { ...draft.tenth, school: e.target.value })
                            }
                            placeholder="e.g. Govt. High School"
                          />
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Passing Year">
                          <Input
                            type="number"
                            min={2000}
                            max={2030}
                            value={draft.tenth?.year ?? ""}
                            onChange={(e) =>
                              update("tenth", { ...draft.tenth, year: e.target.value })
                            }
                            placeholder="e.g. 2020"
                          />
                        </Field>
                        <Field label="Percentage (%)">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            value={draft.tenth?.percentage || ""}
                            onChange={(e) =>
                              update("tenth", { ...draft.tenth, percentage: +e.target.value })
                            }
                            placeholder="e.g. 85.40"
                          />
                        </Field>
                      </div>
                    </div>

                    {/* 12th / Diploma */}
                    <div className="rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <p className="text-sm font-semibold">12th (HSC) / Diploma</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => update("twelfth", { ...draft.twelfth, type: "12th" })}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${(draft.twelfth?.type ?? "12th") === "12th"
                              ? "bg-emerald-600 text-white"
                              : "border border-border text-muted-foreground hover:bg-secondary"
                              }`}
                          >
                            12th
                          </button>
                          <button
                            type="button"
                            onClick={() => update("twelfth", { ...draft.twelfth, type: "Diploma" })}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${draft.twelfth?.type === "Diploma"
                              ? "bg-emerald-600 text-white"
                              : "border border-border text-muted-foreground hover:bg-secondary"
                              }`}
                          >
                            Diploma
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Board / University">
                          <Input
                            value={draft.twelfth?.board ?? ""}
                            onChange={(e) =>
                              update("twelfth", { ...draft.twelfth, board: e.target.value })
                            }
                            placeholder="e.g. Maharashtra State Board"
                          />
                        </Field>
                        <Field label="School / College Name">
                          <Input
                            value={draft.twelfth?.school ?? ""}
                            onChange={(e) =>
                              update("twelfth", { ...draft.twelfth, school: e.target.value })
                            }
                            placeholder="e.g. Jr. College"
                          />
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Field label="Passing Year">
                          <Input
                            type="number"
                            min={2000}
                            max={2030}
                            value={draft.twelfth?.year ?? ""}
                            onChange={(e) =>
                              update("twelfth", { ...draft.twelfth, year: e.target.value })
                            }
                            placeholder="e.g. 2022"
                          />
                        </Field>
                        <Field label="Percentage (%)">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            value={draft.twelfth?.percentage || ""}
                            onChange={(e) =>
                              update("twelfth", { ...draft.twelfth, percentage: +e.target.value })
                            }
                            placeholder="e.g. 78.20"
                          />
                        </Field>
                        {(draft.twelfth?.type ?? "12th") === "12th" && (
                          <Field label="Stream">
                            <Input
                              value={draft.twelfth?.stream ?? ""}
                              onChange={(e) =>
                                update("twelfth", { ...draft.twelfth, stream: e.target.value })
                              }
                              placeholder="e.g. Science / Commerce"
                            />
                          </Field>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {idx === 4 && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-3 shadow-sm">
                        <span className="text-sm font-medium">Interested in Placements</span>
                        <Switch
                          checked={!!draft.interestedInPlacements}
                          onCheckedChange={(v) => update("interestedInPlacements", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-3 shadow-sm">
                        <span className="text-sm font-medium">Interested in Higher Studies</span>
                        <Switch
                          checked={!!draft.interestedInHigherStudies}
                          onCheckedChange={(v) => update("interestedInHigherStudies", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-3 shadow-sm">
                        <span className="text-sm font-medium">Interested in Entrepreneurship</span>
                        <Switch
                          checked={!!draft.interestedInEntrepreneurship}
                          onCheckedChange={(v) => update("interestedInEntrepreneurship", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-3 shadow-sm">
                        <span className="text-sm font-medium">Interested in Civil Services</span>
                        <Switch
                          checked={!!draft.interestedInCivilServices}
                          onCheckedChange={(v) => update("interestedInCivilServices", v)}
                        />
                      </div>
                    </div>
                    <Field label="Events & Achievements">
                      <AchievementsInput
                        draft={achievementDraft}
                        setDraft={setAchievementDraft}
                        items={achievementItems}
                        deletingIndex={deletingAchievementIndex}
                        setDeletingIndex={setDeletingAchievementIndex}
                        onChange={(next) =>
                          update("foreignLanguageCertificateDetails", stringifyJsonLines(next))
                        }
                      />
                    </Field>
                    <Field label="NPTEL / online certifications details">
                      <CertificationsInput
                        draft={certDraft}
                        setDraft={setCertDraft}
                        items={certItems}
                        deletingIndex={deletingCertIndex}
                        setDeletingIndex={setDeletingCertIndex}
                        onChange={(next) =>
                          update("nptelAndCertificationDetails", stringifyJsonLines(next))
                        }
                      />
                    </Field>
                    <Field label="Professional body membership (CSI/IEEE/ASME etc.)">
                      <SimpleListInput
                        title="Professional Body Memberships"
                        placeholder="e.g. IEEE Student Member, CSI"
                        draft={professionalBodyDraft}
                        setDraft={setProfessionalBodyDraft}
                        items={professionalBodyItems}
                        onChange={(next) =>
                          update("professionalBodyMembership", stringifyPlainLines(next))
                        }
                        emptyText="No professional memberships added yet."
                      />
                    </Field>
                  </>
                )}

                {idx === 5 && (
                  <Field label="Experience">
                    <ExperienceInput
                      draft={experienceDraft}
                      setDraft={setExperienceDraft}
                      items={experienceItems}
                      deletingIndex={deletingExperienceIndex}
                      setDeletingIndex={setDeletingExperienceIndex}
                      onChange={(next) => update("areaSpecialization", stringifyJsonLines(next))}
                    />
                  </Field>
                )}

                {idx === 6 && (
                  <>
                    <Field label="Skills">
                      <SkillsInput
                        draft={skillDraft}
                        setDraft={setSkillDraft}
                        items={skillItems}
                        deletingIndex={deletingSkillIndex}
                        setDeletingIndex={setDeletingSkillIndex}
                        onChange={(next) =>
                          update(
                            "skills",
                            next.map((i) => JSON.stringify(i)),
                          )
                        }
                      />
                    </Field>
                    <Field label="Languages Known">
                      <SimpleListInput
                        title="Languages"
                        placeholder="e.g. English, Marathi, Hindi"
                        draft={languageDraft}
                        setDraft={setLanguageDraft}
                        items={draft.languages ?? []}
                        onChange={(next) => update("languages", next)}
                        emptyText="No languages added yet."
                      />
                    </Field>
                    <Field label="Projects">
                      <ProjectsInput
                        draft={projectDraft}
                        setDraft={setProjectDraft}
                        items={projectItems}
                        deletingIndex={deletingProjectIndex}
                        setDeletingIndex={setDeletingProjectIndex}
                        onChange={(next) => update("projects", stringifyJsonLines(next))}
                      />
                    </Field>
                  </>
                )}

                {idx === 7 && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="LinkedIn URL">
                        <Input
                          value={draft.linkedin ?? ""}
                          onChange={(e) => update("linkedin", e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                        />
                      </Field>
                      <Field label="GitHub URL">
                        <Input
                          value={draft.github ?? ""}
                          onChange={(e) => update("github", e.target.value)}
                          placeholder="https://github.com/..."
                        />
                      </Field>
                      <Field label="Portfolio URL">
                        <Input
                          value={draft.portfolio ?? ""}
                          onChange={(e) => update("portfolio", e.target.value)}
                          placeholder="https://yourportfolio.com"
                        />
                      </Field>
                    </div>

                    {linkItems.length > 0 && (
                      <div className="grid gap-2 sm:grid-cols-2 mt-4">
                        {linkItems.map((item, i) => (
                          <div
                            key={i}
                            className="group flex items-center justify-between rounded-lg border bg-muted/50 p-2.5 transition-colors hover:bg-muted"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate">{item.title}</span>
                              <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline truncate">
                                {item.url}
                              </a>
                            </div>
                            {deletingLinkIndex === i ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                                  onClick={() => setDeletingLinkIndex(null)}
                                >
                                  <X className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/35 dark:text-rose-400"
                                  onClick={() => {
                                    const next = linkItems.filter((_, idx) => idx !== i);
                                    update("additionalLinks", stringifyJsonLines(next));
                                    setDeletingLinkIndex(null);
                                  }}
                                >
                                  <Check className="size-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => setDeletingLinkIndex(i)}
                              >
                                <X className="size-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4 space-y-3 mt-4">
                      <p className="text-sm font-semibold border-b pb-2">Add New Link</p>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <Field label="Link Title">
                          <Input
                            value={linkDraft.title}
                            onChange={(e) => setLinkDraft((d) => ({ ...d, title: e.target.value }))}
                            placeholder="e.g. HackerRank / LeetCode"
                          />
                        </Field>
                        <Field label="URL">
                          <Input
                            value={linkDraft.url}
                            onChange={(e) => setLinkDraft((d) => ({ ...d, url: e.target.value }))}
                            placeholder="https://..."
                            onKeyDown={(e) => {
                              if (e.key !== "Enter") return;
                              e.preventDefault();
                              if (!linkDraft.title || !linkDraft.url) return;
                              const next = [...linkItems, linkDraft];
                              update("additionalLinks", stringifyJsonLines(next));
                              setLinkDraft({ title: "", url: "" });
                            }}
                          />
                        </Field>
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        onClick={() => {
                          if (!linkDraft.title || !linkDraft.url) return;
                          const next = [...linkItems, linkDraft];
                          update("additionalLinks", stringifyJsonLines(next));
                          setLinkDraft({ title: "", url: "" });
                        }}
                      >
                        <Plus className="size-4 mr-1" /> Add Link
                      </Button>
                    </div>
                  </>
                )}

                {idx === 8 && (
                  <>
                    <Field label="Upload ID size photo with blazer">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => update("photoFileName", e.target.files?.[0]?.name ?? "")}
                      />
                    </Field>
                    <Field label="Upload updated resume">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => update("resumeFileName", e.target.files?.[0]?.name ?? "")}
                      />
                    </Field>
                    <Field label="Upload 10th Marksheet">
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          update("tenthMarksheetFileName", e.target.files?.[0]?.name ?? "")
                        }
                      />
                    </Field>
                    <Field
                      label={`Upload ${draft.twelfth?.type === "Diploma" ? "Diploma" : "12th"} Marksheet`}
                    >
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          update("twelfthMarksheetFileName", e.target.files?.[0]?.name ?? "")
                        }
                      />
                    </Field>
                    {/* Year-wise marksheets: Year 1 to completed years */}
                    {draft.currentSemester && Math.floor(draft.currentSemester / 2) > 0 && (
                      <div className="rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4 space-y-3">
                        <p className="text-sm font-semibold border-b pb-2">
                          Year Marksheets (Year 1 – {Math.floor(draft.currentSemester / 2)})
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {Array.from(
                            { length: Math.floor(draft.currentSemester / 2) },
                            (_, i) => i + 1,
                          ).map((yr) => (
                            <Field key={yr} label={`Year ${yr} Marksheet`}>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  update("yearMarksheetFileNames", {
                                    ...(draft.yearMarksheetFileNames ?? {}),
                                    [yr]: e.target.files?.[0]?.name ?? "",
                                  })
                                }
                              />
                            </Field>
                          ))}
                        </div>
                      </div>
                    )}
                    <Field label="Upload Aadhar Card">
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => update("aadharFileName", e.target.files?.[0]?.name ?? "")}
                      />
                    </Field>
                    <div className="flex items-start gap-3 rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4 shadow-sm">
                      <input
                        type="checkbox"
                        id="adcet-policy"
                        checked={!!draft.acceptsPlacementPolicy}
                        onChange={(e) => update("acceptsPlacementPolicy", e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      />
                      <label
                        htmlFor="adcet-policy"
                        className="text-sm font-medium leading-snug cursor-pointer"
                      >
                        I accept the ADCET placement policy and terms.
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {/* Action Bar - Glass Theme */}
      <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-50 mx-auto max-w-2xl transition-all px-4 flex flex-col gap-3 pointer-events-none">
        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-full border border-white/40 bg-white/50 p-2 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-slate-200/60 bg-white/50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-all font-semibold shadow-sm"
            onClick={() => {
              persist({ ...draft, status: "draft" });
              toast.success("Draft saved successfully");
            }}
          >
            Save Draft
          </Button>
          <Button
            className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all font-semibold hover:scale-[1.01] active:scale-[0.99]"
            onClick={() => setConfirmOpen(true)}
            disabled={pct < 100}
            title={pct < 100 ? "Complete 100% profile to submit for verification" : undefined}
          >
            Submit for Verification
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit for verification?</DialogTitle>
            <DialogDescription>
              Once submitted, your profile will be reviewed by the TPO.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!phoneValid(draft.mobile) || !phoneValid(draft.parentsMobile ?? "")) {
                  toast.error("Enter valid 10-digit mobile numbers without 0/91 prefix.");
                  return;
                }
                const next = { ...draft, status: "pending" as const };
                setDraft(next);
                persist(next);
                setSubmitted(true);
                setConfirmOpen(false);
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SimpleListInput({
  title,
  placeholder,
  draft,
  setDraft,
  items,
  onChange,
  emptyText,
}: {
  title: string;
  placeholder: string;
  draft: string;
  setDraft: (value: string) => void;
  items: string[];
  onChange: (next: string[]) => void;
  emptyText: string;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4">
      <h4 className="border-b pb-2 text-sm font-medium">{title}</h4>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const value = draft.trim();
            if (!value) return;
            if (items.some((i) => i.toLowerCase() === value.toLowerCase())) {
              toast.error("This item already exists.");
              return;
            }
            onChange([...items, value]);
            setDraft("");
          }}
        />
      </div>
      <Button
        type="button"
        className="w-full mt-2"
        onClick={() => {
          const value = draft.trim();
          if (!value) return;
          if (items.some((i) => i.toLowerCase() === value.toLowerCase())) {
            toast.error("This item already exists.");
            return;
          }
          onChange([...items, value]);
          setDraft("");
        }}
      >
        <Plus className="size-4 mr-1" /> Add Item
      </Button>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 transition-colors dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
          >
            <span className="text-sm font-medium">{item}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-destructive"
              title="Remove item"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 ? <p className="w-full text-xs text-muted-foreground">{emptyText}</p> : null}
      </div>
    </div>
  );
}

function SkillsInput({
  draft,
  setDraft,
  items,
  deletingIndex,
  setDeletingIndex,
  onChange,
}: {
  draft: SkillItem;
  setDraft: React.Dispatch<React.SetStateAction<SkillItem>>;
  items: SkillItem[];
  deletingIndex: number | null;
  setDeletingIndex: (v: number | null) => void;
  onChange: (next: SkillItem[]) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Add New Skill</h4>
      <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2">
        <Field label="Skill Name">
          <Input
            placeholder="e.g. React, Python"
            value={draft.skill_name}
            onChange={(e) => setDraft((d) => ({ ...d, skill_name: e.target.value }))}
          />
        </Field>
        <Field label="Category">
          <Select
            value={draft.skill_category}
            onValueChange={(v) => setDraft((d) => ({ ...d, skill_category: v as SkillCategory }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TECHNICAL" className="text-blue-700 dark:text-blue-400 font-medium">Technical</SelectItem>
              <SelectItem value="SOFT_SKILL" className="text-amber-700 dark:text-amber-400 font-medium">Soft Skill</SelectItem>
              <SelectItem value="TOOL" className="text-teal-700 dark:text-teal-400 font-medium">Tool</SelectItem>
              <SelectItem value="FRAMEWORK" className="text-slate-700 dark:text-slate-350 font-medium">Framework</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          const name = draft.skill_name.trim();
          if (!name) return toast.error("Skill name is required.");
          if (
            items.some(
              (s) =>
                s.skill_name.toLowerCase() === name.toLowerCase() &&
                s.skill_category === draft.skill_category,
            )
          ) {
            return toast.error("Skill already exists.");
          }
          onChange([...items, { ...draft, skill_name: name }]);
          setDraft({ skill_name: "", skill_category: "TECHNICAL" });
        }}
      >
        <Plus className="size-4 mr-1" /> Add Skill
      </Button>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, index) => (
          <div
            key={`${skill.skill_name}-${index}`}
            className={cn(
              "group flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors",
              skill.skill_category === "TECHNICAL" && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
              skill.skill_category === "SOFT_SKILL" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-850",
              skill.skill_category === "TOOL" && "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-300 dark:border-teal-850",
              skill.skill_category === "FRAMEWORK" && "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700"
            )}
          >
            <span className="truncate text-sm font-medium">{skill.skill_name}</span>
            <button
              type="button"
              className="rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10"
              onClick={() => {
                setDeletingIndex(index);
                onChange(items.filter((_, i) => i !== index));
                setDeletingIndex(null);
              }}
              title="Remove skill"
            >
              {deletingIndex === index ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <X className="size-3.5" />
              )}
            </button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="w-full text-xs text-muted-foreground">No skills added yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function ProjectsInput({
  draft,
  setDraft,
  items,
  deletingIndex,
  setDeletingIndex,
  onChange,
}: {
  draft: ProjectItem;
  setDraft: React.Dispatch<React.SetStateAction<ProjectItem>>;
  items: ProjectItem[];
  deletingIndex: number | null;
  setDeletingIndex: (v: number | null) => void;
  onChange: (next: ProjectItem[]) => void;
}) {
  return (
    <div className="space-y-6 rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Projects</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Project Title" className="md:col-span-2">
          <Input
            placeholder="e.g. Portfolio Website"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <Textarea
            rows={3}
            placeholder="Briefly describe what you built..."
            value={draft.description ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
        </Field>
        <Field label="Technologies" className="md:col-span-2">
          <Input
            placeholder="e.g. React, Node.js (Comma separated)"
            value={draft.technologies}
            onChange={(e) => setDraft((d) => ({ ...d, technologies: e.target.value }))}
          />
        </Field>
        <Field label="Project Type">
          <Select
            value={draft.project_type}
            onValueChange={(v) => setDraft((d) => ({ ...d, project_type: v as ProjectType }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERSONAL">Personal</SelectItem>
              <SelectItem value="ACADEMIC">Academic</SelectItem>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
              <SelectItem value="OPEN_SOURCE">Open Source</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Team Size">
          <Input
            type="number"
            placeholder="e.g. 1"
            value={draft.team_size ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, team_size: e.target.value }))}
          />
        </Field>
        <Field label="Start Date">
          <DatePicker
            placeholder="Select Start Date"
            date={draft.start_date ? new Date(draft.start_date) : undefined}
            setDate={(d) => setDraft((prev) => ({ ...prev, start_date: d ? d.toISOString() : "" }))}
          />
        </Field>
        <Field label="End Date">
          <DatePicker
            placeholder="Select End Date"
            date={draft.end_date ? new Date(draft.end_date) : undefined}
            disabled={draft.is_ongoing}
            setDate={(d) => setDraft((prev) => ({ ...prev, end_date: d ? d.toISOString() : "" }))}
          />
        </Field>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="is_ongoing_project"
            type="checkbox"
            checked={draft.is_ongoing}
            onChange={(e) => setDraft((d) => ({ ...d, is_ongoing: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="is_ongoing_project" className="text-sm">
            This project is ongoing
          </label>
        </div>
        <Field label="Live Link (Optional)">
          <Input
            placeholder="e.g. https://example.com"
            value={draft.project_url ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, project_url: e.target.value }))}
          />
        </Field>
        <Field label="GitHub Link (Optional)">
          <Input
            placeholder="e.g. https://github.com/user/repo"
            value={draft.github_url ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, github_url: e.target.value }))}
          />
        </Field>
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          if (!draft.title.trim() || !draft.technologies.trim())
            return toast.error("Title and technologies are required.");
          if (
            !draft.is_ongoing &&
            draft.start_date &&
            draft.end_date &&
            new Date(draft.end_date) < new Date(draft.start_date)
          )
            return toast.error("End date must be after start date.");
          onChange([...items, { ...draft, title: draft.title.trim() }]);
          setDraft({
            title: "",
            description: "",
            technologies: "",
            project_type: "PERSONAL",
            start_date: "",
            end_date: "",
            is_ongoing: false,
            team_size: "",
            role: "",
            project_url: "",
            github_url: "",
          });
        }}
      >
        <Plus className="size-4 mr-1" /> Add Project
      </Button>
      <div className="space-y-3">
        {items.map((project, index) => (
          <div
            key={`${project.title}-${index}`}
            className="relative rounded-lg border bg-background p-3"
          >
            <div className="pr-8">
              <p className="text-sm font-semibold">{project.title}</p>
              <p className="text-xs text-muted-foreground">
                {project.project_type} • {project.start_date || "N/A"} -{" "}
                {project.is_ongoing ? "Present" : project.end_date || "N/A"}
              </p>
              {project.description ? (
                <p className="mt-1 text-xs text-muted-foreground">{project.description}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-1">
                {project.technologies
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tech, i) => (
                    <span
                      key={`${tech}-${i}`}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
              <div className="mt-2 flex gap-2">
                {project.github_url ? (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Github className="size-4" />
                  </a>
                ) : null}
                {project.project_url ? (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeletingIndex(index);
                onChange(items.filter((_, i) => i !== index));
                setDeletingIndex(null);
              }}
              className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-destructive"
            >
              {deletingIndex === index ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No projects added yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function CertificationsInput({
  draft,
  setDraft,
  items,
  deletingIndex,
  setDeletingIndex,
  onChange,
}: {
  draft: CertificationItem;
  setDraft: React.Dispatch<React.SetStateAction<CertificationItem>>;
  items: CertificationItem[];
  deletingIndex: number | null;
  setDeletingIndex: (v: number | null) => void;
  onChange: (next: CertificationItem[]) => void;
}) {
  return (
    <div className="space-y-6 rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Certifications</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Certification Name" className="md:col-span-2">
          <Input
            placeholder="e.g. AWS Certified Solutions Architect"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          />
        </Field>
        <Field label="Issuing Organization" className="md:col-span-2">
          <Input
            placeholder="e.g. Amazon Web Services"
            value={draft.organization}
            onChange={(e) => setDraft((d) => ({ ...d, organization: e.target.value }))}
          />
        </Field>
        <Field label="Issue Date">
          <DatePicker
            placeholder="Select Issue Date"
            date={draft.issue_date ? new Date(draft.issue_date) : undefined}
            setDate={(d) => setDraft((prev) => ({ ...prev, issue_date: d ? d.toISOString() : "" }))}
          />
        </Field>
        <Field label="Expiry Date">
          <DatePicker
            placeholder="Select Expiry Date"
            date={draft.expiry_date ? new Date(draft.expiry_date) : undefined}
            setDate={(d) =>
              setDraft((prev) => ({ ...prev, expiry_date: d ? d.toISOString() : "" }))
            }
          />
        </Field>
        <Field label="Credential ID (Optional)">
          <Input
            placeholder="e.g. AWS-123456"
            value={draft.credential_id ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, credential_id: e.target.value }))}
          />
        </Field>
        <Field label="Credential URL (Optional)">
          <Input
            placeholder="e.g. https://aws.amazon.com/verification"
            value={draft.credential_url ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, credential_url: e.target.value }))}
          />
        </Field>
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          if (!draft.name.trim() || !draft.organization.trim() || !draft.issue_date)
            return toast.error("Name, organization and issue date are required.");
          if (draft.expiry_date && new Date(draft.expiry_date) < new Date(draft.issue_date))
            return toast.error("Expiry date must be after issue date.");
          onChange([
            ...items,
            { ...draft, name: draft.name.trim(), organization: draft.organization.trim() },
          ]);
          setDraft({
            name: "",
            organization: "",
            issue_date: "",
            expiry_date: "",
            credential_id: "",
            credential_url: "",
          });
        }}
      >
        <Plus className="size-4 mr-1" /> Add Certification
      </Button>
      <div className="space-y-3">
        {items.map((cert, index) => (
          <div
            key={`${cert.name}-${index}`}
            className="relative flex items-start rounded-lg border bg-background p-3"
          >
            <div className="mr-3 mt-1 rounded-full bg-blue-100 p-2 text-blue-600">
              <Award className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{cert.name}</p>
              <p className="text-xs text-muted-foreground">{cert.organization}</p>
              <p className="text-xs text-muted-foreground">
                Issued: {cert.issue_date || "N/A"}
                {cert.expiry_date ? ` • Expires: ${cert.expiry_date}` : ""}
              </p>
              {cert.credential_id ? (
                <p className="text-xs text-muted-foreground">ID: {cert.credential_id}</p>
              ) : null}
              {cert.credential_url ? (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  View Credential <ExternalLink className="ml-1 size-3" />
                </a>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                setDeletingIndex(index);
                onChange(items.filter((_, i) => i !== index));
                setDeletingIndex(null);
              }}
              className="p-1 text-muted-foreground hover:text-destructive"
            >
              {deletingIndex === index ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No certifications added yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function ExperienceInput({
  draft,
  setDraft,
  items,
  deletingIndex,
  setDeletingIndex,
  onChange,
}: {
  draft: ExperienceItem;
  setDraft: React.Dispatch<React.SetStateAction<ExperienceItem>>;
  items: ExperienceItem[];
  deletingIndex: number | null;
  setDeletingIndex: (v: number | null) => void;
  onChange: (next: ExperienceItem[]) => void;
}) {
  return (
    <div className="space-y-6 rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Add Experience</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Company Name" className="md:col-span-2">
          <Input
            placeholder="e.g. Google"
            value={draft.company_name}
            onChange={(e) => setDraft((d) => ({ ...d, company_name: e.target.value }))}
          />
        </Field>
        <Field label="Role">
          <Input
            placeholder="e.g. Software Engineer Intern"
            value={draft.role}
            onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
          />
        </Field>
        <Field label="Experience Type">
          <Select
            value={draft.experience_type}
            onValueChange={(v) => setDraft((d) => ({ ...d, experience_type: v as ExperienceType }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Experience Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INTERNSHIP">Internship</SelectItem>
              <SelectItem value="FULL_TIME">Full Time</SelectItem>
              <SelectItem value="PART_TIME">Part Time</SelectItem>
              <SelectItem value="FREELANCE">Freelance</SelectItem>
              <SelectItem value="TRAINING">Training</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Start Date">
          <DatePicker
            placeholder="Select Start Date"
            date={draft.start_date ? new Date(draft.start_date) : undefined}
            setDate={(d) => setDraft((prev) => ({ ...prev, start_date: d ? d.toISOString() : "" }))}
          />
        </Field>
        <Field label="End Date">
          <DatePicker
            placeholder="Select End Date"
            date={draft.end_date ? new Date(draft.end_date) : undefined}
            disabled={draft.is_current}
            setDate={(d) => setDraft((prev) => ({ ...prev, end_date: d ? d.toISOString() : "" }))}
          />
        </Field>
        <Field label="Location">
          <Input
            placeholder="e.g. Bengaluru, India"
            value={draft.location}
            onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
          />
        </Field>
        <Field label="Work Mode">
          <Select
            value={draft.work_mode}
            onValueChange={(v) => setDraft((d) => ({ ...d, work_mode: v as WorkMode }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Work Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WFO">WFO</SelectItem>
              <SelectItem value="WFH">WFH</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="is_current_experience"
            type="checkbox"
            checked={draft.is_current}
            onChange={(e) => setDraft((d) => ({ ...d, is_current: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="is_current_experience" className="text-sm">
            Currently working here
          </label>
        </div>
        <Field label="Description" className="md:col-span-2">
          <Textarea
            rows={3}
            placeholder="Projects worked on / key responsibilities / outcomes"
            value={draft.projects_worked ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, projects_worked: e.target.value }))}
          />
        </Field>
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          if (!draft.company_name.trim() || !draft.role.trim() || !draft.start_date) {
            toast.error("Company, role and start date are required.");
            return;
          }
          if (
            !draft.is_current &&
            draft.end_date &&
            new Date(draft.end_date) < new Date(draft.start_date)
          ) {
            toast.error("End date must be after start date.");
            return;
          }
          onChange([
            ...items,
            { ...draft, company_name: draft.company_name.trim(), role: draft.role.trim() },
          ]);
          setDraft({
            company_name: "",
            role: "",
            experience_type: "INTERNSHIP",
            start_date: "",
            end_date: "",
            is_current: false,
            location: "",
            work_mode: "WFO",
            projects_worked: "",
          });
        }}
      >
        <Plus className="size-4 mr-1" /> Add Experience
      </Button>

      <div className="space-y-3">
        {items.map((exp, index) => (
          <div
            key={`${exp.company_name}-${exp.role}-${index}`}
            className="relative rounded-lg border bg-background p-3"
          >
            <div className="pr-8">
              <p className="text-sm font-semibold">
                {exp.role} at {exp.company_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {exp.experience_type} • {exp.start_date || "N/A"} -{" "}
                {exp.is_current ? "Present" : exp.end_date || "N/A"} • {exp.work_mode}
              </p>
              {exp.location ? (
                <p className="text-xs text-muted-foreground">Location: {exp.location}</p>
              ) : null}
              {exp.projects_worked ? (
                <p className="mt-1 text-xs text-muted-foreground">{exp.projects_worked}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                setDeletingIndex(index);
                onChange(items.filter((_, i) => i !== index));
                setDeletingIndex(null);
              }}
              className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-destructive"
            >
              {deletingIndex === index ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No experience added yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function AchievementsInput({
  draft,
  setDraft,
  items,
  deletingIndex,
  setDeletingIndex,
  onChange,
}: {
  draft: AchievementItem;
  setDraft: React.Dispatch<React.SetStateAction<AchievementItem>>;
  items: AchievementItem[];
  deletingIndex: number | null;
  setDeletingIndex: (v: number | null) => void;
  onChange: (next: AchievementItem[]) => void;
}) {
  return (
    <div className="space-y-6 rounded-lg border border-slate-200/60 bg-blue-50/20 dark:border-slate-800/60 dark:bg-blue-950/10 p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Add Event / Achievement</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Event Name" className="md:col-span-2">
          <Input
            placeholder="e.g. Smart India Hackathon"
            value={draft.event_name}
            onChange={(e) => setDraft((d) => ({ ...d, event_name: e.target.value }))}
          />
        </Field>
        <Field label="Event Date">
          <DatePicker
            placeholder="Select Event Date"
            date={draft.event_date ? new Date(draft.event_date) : undefined}
            setDate={(d) => setDraft((prev) => ({ ...prev, event_date: d ? d.toISOString() : "" }))}
          />
        </Field>
        <Field label="Place">
          <Input
            placeholder="e.g. New Delhi, India"
            value={draft.place}
            onChange={(e) => setDraft((d) => ({ ...d, place: e.target.value }))}
          />
        </Field>
        <Field label="Level">
          <Select
            value={draft.level}
            onValueChange={(v) => setDraft((d) => ({ ...d, level: v as EventLevel }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INTERNATIONAL">International</SelectItem>
              <SelectItem value="NATIONAL">National</SelectItem>
              <SelectItem value="STATE">State</SelectItem>
              <SelectItem value="DISTRICT">District</SelectItem>
              <SelectItem value="COLLEGE">College</SelectItem>
              <SelectItem value="LOCAL">Local</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Category">
          <Select
            value={draft.category}
            onValueChange={(v) => setDraft((d) => ({ ...d, category: v as EventCategory }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EVENT">Event</SelectItem>
              <SelectItem value="PAPER_PRESENTATION">Paper Presentation</SelectItem>
              <SelectItem value="HACKATHON">Hackathon</SelectItem>
              <SelectItem value="WORKSHOP">Workshop</SelectItem>
              <SelectItem value="COMPETITION">Competition</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="achievement_won"
            type="checkbox"
            checked={draft.won}
            onChange={(e) => setDraft((d) => ({ ...d, won: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="achievement_won" className="text-sm">
            Won / Awarded
          </label>
        </div>
        <Field label="Position / Award (Optional)" className="md:col-span-2">
          <Input
            placeholder="e.g. 1st Prize, Gold Medal"
            value={draft.position_or_award ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, position_or_award: e.target.value }))}
          />
        </Field>
        <Field label="Short Details (Optional)" className="md:col-span-2">
          <Textarea
            rows={3}
            placeholder="Description of the event and your contribution"
            value={draft.details ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, details: e.target.value }))}
          />
        </Field>
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          if (!draft.event_name.trim() || !draft.event_date || !draft.place.trim()) {
            toast.error("Event name, date and place are required.");
            return;
          }
          onChange([
            ...items,
            {
              ...draft,
              event_name: draft.event_name.trim(),
              place: draft.place.trim(),
            },
          ]);
          setDraft({
            event_name: "",
            event_date: "",
            place: "",
            level: "COLLEGE",
            category: "EVENT",
            won: false,
            position_or_award: "",
            details: "",
          });
        }}
      >
        <Plus className="size-4 mr-1" /> Add Event
      </Button>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.event_name}-${index}`}
            className="relative rounded-lg border bg-background p-3"
          >
            <div className="pr-8">
              <p className="text-sm font-semibold">{item.event_name}</p>
              <p className="text-xs text-muted-foreground">
                {item.category} • {item.level} • {item.event_date || "N/A"} • {item.place}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.won
                  ? `Won${item.position_or_award ? ` (${item.position_or_award})` : ""}`
                  : "Participated"}
              </p>
              {item.details ? (
                <p className="mt-1 text-xs text-muted-foreground">{item.details}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                setDeletingIndex(index);
                onChange(items.filter((_, i) => i !== index));
                setDeletingIndex(null);
              }}
              className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-destructive"
            >
              {deletingIndex === index ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No events added yet.</p>
        ) : null}
      </div>
    </div>
  );
}
