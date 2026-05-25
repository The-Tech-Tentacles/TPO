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

type SkillCategory = "TECHNICAL" | "SOFT_SKILL" | "LANGUAGE" | "TOOL" | "FRAMEWORK";
type SkillProficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
type ProjectType = "ACADEMIC" | "PERSONAL" | "INTERNSHIP" | "FREELANCE" | "OPEN_SOURCE";

type SkillItem = {
  skill_name: string;
  skill_category: SkillCategory;
  proficiency?: SkillProficiency;
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
  prn: "",
  rollNumber: "",
  department: "",
  year: "Fourth",
  division: "A",
  cgpa: 0,
  backlogs: 0,
  activeBacklogs: false,
  tenth: { board: "", school: "", year: "", percentage: 0 },
  twelfth: { board: "", school: "", year: "", percentage: 0, stream: "Science", type: "12th" },
  gender: "Male",
  mobile: "",
  city: "",
  state: "",
  pin: "",
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
    proficiency: "BEGINNER",
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
  const [professionalBodyDraft, setProfessionalBodyDraft] = useState("");

  const update = <K extends keyof Student>(k: K, v: Student[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));
  const phoneValid = (p: string) => /^[6-9]\d{9}$/.test(p);

  const skillItems = parseJsonLines<SkillItem>(draft.skills.join("\n"), (line) => ({
    skill_name: line,
    skill_category: "TECHNICAL",
    proficiency: "BEGINNER",
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

  const sections = useMemo(
    () => [
      {
        title: "Identity & Contact",
        done: !!(
          draft.firstName &&
          draft.surname &&
          phoneValid(draft.mobile) &&
          phoneValid(draft.parentsMobile ?? "")
        ),
      },
      {
        title: "Academic & Eligibility",
        done: !!(
          draft.department &&
          draft.prn &&
          draft.aggregateTillCurrentSemester &&
          draft.urnNumber
        ),
      },
      {
        title: "Career Preferences & Achievements",
        done: !!(achievementItems.length || professionalBodyItems.length || certItems.length),
      },
      { title: "Experience", done: experienceItems.length > 0 },
      { title: "Skills + Projects", done: draft.skills.length > 0 || !!draft.projects },
      { title: "Uploads", done: !!(draft.photoFileName && draft.resumeFileName) },
    ],
    [
      achievementItems.length,
      certItems.length,
      draft,
      experienceItems.length,
      professionalBodyItems.length,
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

  return (
    <div className="space-y-4 pb-32">
      <Card className="rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <AvatarCircle name={draft.name} size={56} />
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-lg font-bold">{draft.name}</h1>
            <p className="truncate text-xs text-muted-foreground">{draft.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 dark:bg-emerald-900/30">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Completion</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{pct}%</span>
            </div>
          </div>
        </div>
        <Progress value={pct} className="mt-4 h-2" />
      </Card>

      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400">
        <span className="font-semibold">Note:</span> Before exiting, make sure you save your draft so you don't lose your progress.
      </div>

      {sections.map((sec, idx) => {
        const open = openSection === idx;
        return (
          <Card key={sec.title} className="overflow-hidden rounded-2xl p-0">
            <button
              onClick={() => setOpenSection(open ? null : idx)}
              className="flex w-full items-center gap-3 p-4 text-left hover:bg-secondary/50"
            >
              <div
                className={cn(
                  "grid size-7 place-items-center rounded-full border",
                  sec.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
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
                        />
                      </Field>
                      <Field label="Middle Name">
                        <Input
                          value={draft.middleName ?? ""}
                          onChange={(e) => update("middleName", e.target.value)}
                        />
                      </Field>
                      <Field label="Surname">
                        <Input
                          value={draft.surname ?? ""}
                          onChange={(e) => update("surname", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Email address">
                        <Input
                          value={draft.emailAddress ?? ""}
                          onChange={(e) => {
                            update("emailAddress", e.target.value);
                            update("emailId", e.target.value);
                          }}
                        />
                      </Field>
                      <Field label="Mobile Number (10 digits, no 0/91)">
                        <Input
                          value={draft.mobile}
                          onChange={(e) => update("mobile", toPhone(e.target.value))}
                          maxLength={10}
                          className={
                            draft.mobile && !phoneValid(draft.mobile) ? "border-destructive" : ""
                          }
                        />
                      </Field>
                    </div>
                    <div className="rounded-lg border bg-card p-3 space-y-3">
                      <p className="text-sm font-medium">Parent Details</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Parent Name">
                          <Input
                            value={draft.parentName ?? ""}
                            onChange={(e) => update("parentName", e.target.value)}
                            placeholder="e.g. Rajesh Sharma"
                          />
                        </Field>
                        <Field label="Relation">
                          <Input
                            value={draft.parentRelation ?? ""}
                            onChange={(e) => update("parentRelation", e.target.value)}
                            placeholder="e.g. Father / Mother / Guardian"
                          />
                        </Field>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Parent Mobile Number (10 digits, no 0/91)">
                          <Input
                            value={draft.parentsMobile ?? ""}
                            onChange={(e) => update("parentsMobile", toPhone(e.target.value))}
                            maxLength={10}
                            className={
                              draft.parentsMobile && !phoneValid(draft.parentsMobile)
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </Field>
                        <Field label="Parent Email (Optional)">
                          <Input
                            type="email"
                            value={draft.parentEmail ?? ""}
                            onChange={(e) => update("parentEmail", e.target.value)}
                            placeholder="e.g. parent@email.com"
                          />
                        </Field>
                      </div>
                    </div>
                    <Field label="Caste">
                      <Input
                        value={draft.caste ?? ""}
                        onChange={(e) => update("caste", e.target.value)}
                      />
                    </Field>
                  </>
                )}

                {idx === 1 && (
                  <>
                    <Field label="URN Number">
                      <Input
                        value={draft.urnNumber ?? ""}
                        onChange={(e) => update("urnNumber", e.target.value)}
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
                    <Field label="Aggregate till current semester">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={draft.aggregateTillCurrentSemester || ""}
                        onChange={(e) => update("aggregateTillCurrentSemester", +e.target.value)}
                      />
                    </Field>
                    <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
  <span className="text-sm font-medium">Do you currently have live backlogs?</span>
  <div className="flex items-center gap-3">
    <span className="text-sm text-muted-foreground">{draft.activeBacklogs ? "Yes" : "No"}</span>
    <Switch
      checked={!!draft.activeBacklogs}
      onCheckedChange={(v) => {
        update("activeBacklogs", v);
        if (!v) update("liveBacklogsOrNa", "NA");
        if (v && (draft.liveBacklogsOrNa ?? "NA") === "NA") {
          update("liveBacklogsOrNa", "");
        }
      }}
    />
  </div>
</div>
                    {draft.activeBacklogs ? (
                      <Field label="Mention your live backlogs">
                        <Input
                          value={draft.liveBacklogsOrNa ?? ""}
                          onChange={(e) => update("liveBacklogsOrNa", e.target.value)}
                          placeholder="e.g. Sem 5 - Mathematics II"
                        />
                      </Field>
                    ) : null}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Parents Income (Range)">
                        <Input
                          value={draft.parentsIncomeRange ?? ""}
                          onChange={(e) => update("parentsIncomeRange", e.target.value)}
                          placeholder="e.g. 3-6 LPA"
                        />
                      </Field>
                      <Field label="Occupation of Parent">
                        <Input
                          value={draft.parentOccupation ?? ""}
                          onChange={(e) => update("parentOccupation", e.target.value)}
                        />
                      </Field>
                    </div>
                  </>
                )}

                {idx === 2 && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
  <span className="text-sm font-medium">Interested in Placements</span>
  <Switch checked={!!draft.interestedInPlacements} onCheckedChange={(v) => update("interestedInPlacements", v)} />
</div>
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
  <span className="text-sm font-medium">Interested in Higher Studies</span>
  <Switch checked={!!draft.interestedInHigherStudies} onCheckedChange={(v) => update("interestedInHigherStudies", v)} />
</div>
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
  <span className="text-sm font-medium">Interested in Entrepreneurship</span>
  <Switch checked={!!draft.interestedInEntrepreneurship} onCheckedChange={(v) => update("interestedInEntrepreneurship", v)} />
</div>
                      <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
  <span className="text-sm font-medium">Interested in Civil Services</span>
  <Switch checked={!!draft.interestedInCivilServices} onCheckedChange={(v) => update("interestedInCivilServices", v)} />
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

                {idx === 3 && (
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

                {idx === 4 && (
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

                {idx === 5 && (
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
                    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm">
                      <input
                        type="checkbox"
                        id="adcet-policy"
                        checked={!!draft.acceptsPlacementPolicy}
                        onChange={(e) => update("acceptsPlacementPolicy", e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                      />
                      <label htmlFor="adcet-policy" className="text-sm font-medium leading-snug cursor-pointer">
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
      <div className="mx-auto max-w-2xl mt-8 pb-8 transition-all px-4">
        <div className="flex w-full items-center gap-3 rounded-full border border-white/60 bg-white/40 p-2 shadow-sm shadow-emerald-900/5 backdrop-blur-xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/40 dark:ring-white/10">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-white/60 bg-white/50 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm transition-all dark:border-emerald-800/30 dark:bg-slate-800/50 dark:hover:bg-emerald-900/30 dark:text-slate-200"
            onClick={() => {
              persist({ ...draft, status: "draft" });
              toast.success("Draft saved successfully");
            }}
          >
            Save Draft
          </Button>
          <Button
            className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-emerald-600/20 text-white transition-all font-medium"
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
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
    <div className="space-y-3 rounded-lg border bg-card p-4">
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
        <Button
          type="button"
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
          <Plus className="mr-2 size-4" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center justify-between rounded-lg border bg-background p-3"
          >
            <p className="text-sm">{item}</p>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="p-1 text-muted-foreground hover:text-destructive"
              title="Remove item"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {items.length === 0 ? <p className="text-xs text-muted-foreground">{emptyText}</p> : null}
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
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Add New Skill</h4>
      <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-4">
        <Input
          className="md:col-span-2"
          placeholder="e.g. React, Python"
          value={draft.skill_name}
          onChange={(e) => setDraft((d) => ({ ...d, skill_name: e.target.value }))}
        />
        <select
          value={draft.skill_category}
          onChange={(e) =>
            setDraft((d) => ({ ...d, skill_category: e.target.value as SkillCategory }))
          }
          className="w-full rounded-md border p-2 text-sm"
        >
          <option value="TECHNICAL">Technical</option>
          <option value="SOFT_SKILL">Soft Skill</option>
          <option value="LANGUAGE">Language</option>
          <option value="TOOL">Tool</option>
          <option value="FRAMEWORK">Framework</option>
        </select>
        <div className="flex gap-2">
          <select
            value={draft.proficiency}
            onChange={(e) =>
              setDraft((d) => ({ ...d, proficiency: e.target.value as SkillProficiency }))
            }
            className="w-full rounded-md border p-2 text-sm"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          <Button
            type="button"
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
              setDraft({ skill_name: "", skill_category: "TECHNICAL", proficiency: "BEGINNER" });
            }}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((skill, index) => (
          <div
            key={`${skill.skill_name}-${index}`}
            className="relative rounded-lg border bg-background p-3 pr-10"
          >
            <div className="min-w-0 space-y-2">
              <p className="truncate text-sm font-medium">{skill.skill_name}</p>
              <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                <span className="rounded-full bg-secondary px-2 py-0.5">
                  {skill.skill_category}
                </span>
                {skill.proficiency ? (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                    {skill.proficiency}
                  </span>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-destructive"
              onClick={() => {
                setDeletingIndex(index);
                onChange(items.filter((_, i) => i !== index));
                setDeletingIndex(null);
              }}
              title="Remove skill"
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
          <p className="col-span-full text-xs text-muted-foreground">No skills added yet.</p>
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
    <div className="space-y-6 rounded-lg border bg-card p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Projects</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          className="md:col-span-2"
          placeholder="Project Title"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />
        <Textarea
          rows={3}
          className="md:col-span-2"
          placeholder="Briefly describe what you built..."
          value={draft.description ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
        />
        <Input
          className="md:col-span-2"
          placeholder="Technologies (Comma separated)"
          value={draft.technologies}
          onChange={(e) => setDraft((d) => ({ ...d, technologies: e.target.value }))}
        />
        <select
          value={draft.project_type}
          onChange={(e) => setDraft((d) => ({ ...d, project_type: e.target.value as ProjectType }))}
          className="w-full rounded-md border p-2 text-sm"
        >
          <option value="PERSONAL">Personal</option>
          <option value="ACADEMIC">Academic</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FREELANCE">Freelance</option>
          <option value="OPEN_SOURCE">Open Source</option>
        </select>
        <Input
          type="number"
          placeholder="Team Size"
          value={draft.team_size ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, team_size: e.target.value }))}
        />
        <Input
          type="date"
          value={draft.start_date ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, start_date: e.target.value }))}
        />
        <Input
          type="date"
          value={draft.end_date ?? ""}
          disabled={draft.is_ongoing}
          onChange={(e) => setDraft((d) => ({ ...d, end_date: e.target.value }))}
        />
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="is_ongoing_project"
            type="checkbox"
            checked={draft.is_ongoing}
            onChange={(e) => setDraft((d) => ({ ...d, is_ongoing: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="is_ongoing_project" className="text-sm">
            This project is ongoing
          </label>
        </div>
        <Input
          placeholder="Live Link (Optional)"
          value={draft.project_url ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, project_url: e.target.value }))}
        />
        <Input
          placeholder="GitHub Link (Optional)"
          value={draft.github_url ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, github_url: e.target.value }))}
        />
      </div>
      <Button
        type="button"
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
        <Plus className="mr-2 size-4" />
        Save Project
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
    <div className="space-y-6 rounded-lg border bg-card p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Certifications</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          className="md:col-span-2"
          placeholder="Certification Name"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        />
        <Input
          className="md:col-span-2"
          placeholder="Issuing Organization"
          value={draft.organization}
          onChange={(e) => setDraft((d) => ({ ...d, organization: e.target.value }))}
        />
        <Input
          type="date"
          value={draft.issue_date}
          onChange={(e) => setDraft((d) => ({ ...d, issue_date: e.target.value }))}
        />
        <Input
          type="date"
          value={draft.expiry_date ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, expiry_date: e.target.value }))}
        />
        <Input
          placeholder="Credential ID (Optional)"
          value={draft.credential_id ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, credential_id: e.target.value }))}
        />
        <Input
          placeholder="Credential URL (Optional)"
          value={draft.credential_url ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, credential_url: e.target.value }))}
        />
      </div>
      <Button
        type="button"
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
        <Plus className="mr-2 size-4" />
        Save Certification
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
    <div className="space-y-6 rounded-lg border bg-card p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Add Experience</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          className="md:col-span-2"
          placeholder="Company Name"
          value={draft.company_name}
          onChange={(e) => setDraft((d) => ({ ...d, company_name: e.target.value }))}
        />
        <Input
          placeholder="Role"
          value={draft.role}
          onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
        />
        <select
          value={draft.experience_type}
          onChange={(e) =>
            setDraft((d) => ({ ...d, experience_type: e.target.value as ExperienceType }))
          }
          className="w-full rounded-md border p-2 text-sm"
        >
          <option value="INTERNSHIP">Internship</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="FREELANCE">Freelance</option>
          <option value="TRAINING">Training</option>
        </select>
        <Input
          type="date"
          value={draft.start_date}
          onChange={(e) => setDraft((d) => ({ ...d, start_date: e.target.value }))}
        />
        <Input
          type="date"
          value={draft.end_date ?? ""}
          disabled={draft.is_current}
          onChange={(e) => setDraft((d) => ({ ...d, end_date: e.target.value }))}
        />
        <Input
          placeholder="Place / Location"
          value={draft.location}
          onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
        />
        <select
          value={draft.work_mode}
          onChange={(e) => setDraft((d) => ({ ...d, work_mode: e.target.value as WorkMode }))}
          className="w-full rounded-md border p-2 text-sm"
        >
          <option value="WFO">WFO</option>
          <option value="WFH">WFH</option>
          <option value="HYBRID">Hybrid</option>
        </select>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="is_current_experience"
            type="checkbox"
            checked={draft.is_current}
            onChange={(e) => setDraft((d) => ({ ...d, is_current: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="is_current_experience" className="text-sm">
            Currently working here
          </label>
        </div>
        <Textarea
          rows={3}
          className="md:col-span-2"
          placeholder="Projects worked on / key responsibilities / outcomes"
          value={draft.projects_worked ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, projects_worked: e.target.value }))}
        />
      </div>
      <Button
        type="button"
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
        <Plus className="mr-2 size-4" />
        Save Experience
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
    <div className="space-y-6 rounded-lg border bg-card p-4">
      <h4 className="border-b pb-2 text-sm font-medium">Add Event / Achievement</h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          className="md:col-span-2"
          placeholder="Event Name"
          value={draft.event_name}
          onChange={(e) => setDraft((d) => ({ ...d, event_name: e.target.value }))}
        />
        <Input
          type="date"
          value={draft.event_date}
          onChange={(e) => setDraft((d) => ({ ...d, event_date: e.target.value }))}
        />
        <Input
          placeholder="Place"
          value={draft.place}
          onChange={(e) => setDraft((d) => ({ ...d, place: e.target.value }))}
        />
        <select
          value={draft.level}
          onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value as EventLevel }))}
          className="w-full rounded-md border p-2 text-sm"
        >
          <option value="INTERNATIONAL">International</option>
          <option value="NATIONAL">National</option>
          <option value="STATE">State</option>
          <option value="DISTRICT">District</option>
          <option value="COLLEGE">College</option>
          <option value="LOCAL">Local</option>
        </select>
        <select
          value={draft.category}
          onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as EventCategory }))}
          className="w-full rounded-md border p-2 text-sm"
        >
          <option value="EVENT">Event</option>
          <option value="PAPER_PRESENTATION">Paper Presentation</option>
          <option value="HACKATHON">Hackathon</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="COMPETITION">Competition</option>
        </select>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            id="achievement_won"
            type="checkbox"
            checked={draft.won}
            onChange={(e) => setDraft((d) => ({ ...d, won: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="achievement_won" className="text-sm">
            Won / Awarded
          </label>
        </div>
        <Input
          className="md:col-span-2"
          placeholder="Position / Award (Optional)"
          value={draft.position_or_award ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, position_or_award: e.target.value }))}
        />
        <Textarea
          rows={3}
          className="md:col-span-2"
          placeholder="Short details (optional)"
          value={draft.details ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, details: e.target.value }))}
        />
      </div>
      <Button
        type="button"
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
        <Plus className="mr-2 size-4" />
        Save Event
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
