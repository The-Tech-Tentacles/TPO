"use client";

import { useMemo, useState } from "react";
import {
  Search,
  MoreHorizontal,
  Download,
  Check,
  X,
  Filter,
  Pencil,
  Briefcase,
  Ban,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Code,
  FileText,
  Globe,
  Link as LinkIcon,
  Linkedin,
  Github,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Shield,
  FileSpreadsheet,
  Building,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { useApp, isEligible } from "@/lib/store";
import { DEPARTMENTS } from "@/lib/dummy-data";
import type { Student } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs as DTabs,
  TabsList as DTabsList,
  TabsTrigger as DTabsTrigger,
  TabsContent as DTabsContent,
} from "@/components/ui/tabs";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ALL = "__all__";

const glassCard =
  "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all";

export function TpoStudentsPage() {
  const { state, setState, user } = useApp();
  const isDept = user?.role === "tpo-department";

  const fourthYearStudents = state.students.filter((x) => x.year === "Fourth");
  const boysCount = fourthYearStudents.filter((x) => x.gender === "Male").length;
  const girlsCount = fourthYearStudents.filter((x) => x.gender === "Female").length;
  const placedFourthYear = fourthYearStudents.filter((x) => x.placementStatus === "Placed").length;
  const inProcessFourthYear = fourthYearStudents.filter((x) => x.year === "Fourth" && x.placementStatus === "In Process").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Boys (4th Year)
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {boysCount}
            </p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
              Male final year students
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-xl">
            <Users className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Girls (4th Year)
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {girlsCount}
            </p>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
              Female final year students
            </p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-xl">
            <Users className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Placed (4th Year)
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {placedFourthYear}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Placed final year students
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl">
            <Briefcase className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              In Process (4th Year)
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {inProcessFourthYear}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              Drives currently active
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-xl">
            <Calendar className="size-5" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="master">
        <TabsList className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm p-1">
          <TabsTrigger value="master" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl">Master List</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl">
            Pending Verifications{" "}
            {state.pending.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {state.pending.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="master" className="mt-4">
          <MasterList />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <PendingList deptFilter={isDept ? user?.department : undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MasterList() {
  const { state, setState } = useApp();
  const [q, setQ] = useState("");
  const [dep, setDep] = useState<string>(ALL);
  const [yr, setYr] = useState<string>("Fourth");
  const [div, setDiv] = useState<string>(ALL);
  const [gen, setGen] = useState<string>(ALL);
  const [pl, setPl] = useState<string>(ALL);
  const [selected, setSelected] = useState<string[]>([]);
  const [openStudent, setOpenStudent] = useState<Student | null>(null);
  const [updateOpen, setUpdateOpen] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false);

  const hasActiveFilters = dep !== ALL || yr !== ALL || div !== ALL || gen !== ALL || pl !== ALL;

  const selectedStudents = useMemo(() => {
    return state.students.filter((s) => selected.includes(s.id));
  }, [state.students, selected]);

  const allSameStatus = useMemo(() => {
    if (selectedStudents.length === 0) return false;
    const firstStatus = selectedStudents[0].placementStatus;
    return selectedStudents.every((s) => s.placementStatus === firstStatus);
  }, [selectedStudents]);

  const reset = () => {
    setQ("");
    setDep(ALL);
    setYr(ALL);
    setDiv(ALL);
    setGen(ALL);
    setPl(ALL);
  };

  const list = useMemo(() => {
    return state.students.filter((s) => {
      if (q && !`${s.name} ${s.urn} ${s.rollNumber}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (dep !== ALL && s.department !== dep) return false;
      if (yr !== ALL && s.year !== yr) return false;
      if (div !== ALL && s.division !== div) return false;
      if (gen !== ALL && s.gender !== gen) return false;
      if (pl !== ALL && s.placementStatus !== pl) return false;
      return true;
    });
  }, [state.students, q, dep, yr, div, gen, pl]);

  const toggleAll = () => setSelected(selected.length === list.length ? [] : list.map((s) => s.id));

  const exportCsv = (rows: Student[]) => {
    const cols = [
      "name",
      "urn",
      "department",
      "year",
      "cgpa",
      "tenth",
      "twelfth",
      "placed",
      "company",
      "package",
    ] as const;
    const lines = [cols.join(",")];
    rows.forEach((s) =>
      lines.push(
        [
          s.name,
          s.urn,
          s.department,
          s.year,
          s.cgpa,
          s.tenth.percentage,
          s.twelfth.percentage,
          s.placementStatus,
          s.placedCompany ?? "",
          s.packageLpa ?? "",
        ].join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} students`);
  };



  return (
    <Card className={cn(glassCard, "p-4")}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, URN, roll number…"
              className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-emerald-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              className={cn(
                "gap-2 border-slate-200/60 dark:border-slate-700/50",
                !showFilters && "bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="size-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              variant="outline"
              className="gap-1.5 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              onClick={() => exportCsv(selected.length > 0 ? list.filter((s) => selected.includes(s.id)) : list)}
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">
                {selected.length > 0 ? `Export ${selected.length} to Excel` : "Export to Excel"}
              </span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <FilterSelect
              value={dep}
              onValueChange={setDep}
              placeholder="Department"
              options={DEPARTMENTS}
            />
            <FilterSelect
              value={yr}
              onValueChange={setYr}
              placeholder="Year"
              options={["First", "Second", "Third", "Fourth"]}
            />
            <FilterSelect
              value={div}
              onValueChange={setDiv}
              placeholder="Division"
              options={["A", "B", "C"]}
            />
            <FilterSelect
              value={gen}
              onValueChange={setGen}
              placeholder="Gender"
              options={["Male", "Female", "Other"]}
            />
            <FilterSelect
              value={pl}
              onValueChange={setPl}
              placeholder="Placed status"
              options={["Placed", "Not Placed", "In Process"]}
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="h-8 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-4 py-3 shadow-sm dark:border-emerald-900/30 dark:bg-emerald-900/10 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                {selected.length} student{selected.length > 1 ? "s" : ""} selected
              </span>
              {!allSameStatus && (
                <span className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  Select students with the same placement status to update collectively
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelected([])}
                className="bg-white/50 dark:bg-slate-900/50 border-emerald-200/60 dark:border-emerald-800/30 text-emerald-700 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 dark:text-emerald-400"
              >
                Clear
              </Button>
              {allSameStatus && (
                <Button size="sm" onClick={() => setBulkUpdateOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Update Status
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 uppercase border-y border-slate-100 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <Checkbox
                    checked={list.length > 0 && selected.length === list.length}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Department</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Year</th>
                <th className="px-4 py-3 font-semibold">CGPA</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">10th%</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">12th%</th>
                <th className="px-4 py-3 font-semibold">Eligible</th>
                <th className="px-4 py-3 font-semibold">Placed</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {list.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400">
                    No students match your filters.
                  </td>
                </tr>
              )}
              {list.map((s) => {
                const elig = isEligible(s, state.settings.eligibility);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.includes(s.id)}
                        onCheckedChange={() =>
                          setSelected((sel) =>
                            sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id],
                          )
                        }
                      />
                    </td>
                    <td className="cursor-pointer px-4 py-3" onClick={() => setOpenStudent(s)}>
                      <div className="flex items-center gap-2">
                        <AvatarCircle name={s.name} size={32} />
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">{s.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{s.urn || s.urnNumber || "No URN"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-400 md:table-cell">{s.department}</td>
                    <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-400 md:table-cell">{s.year}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{s.cgpa.toFixed(2)}</td>
                    <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-400 lg:table-cell">{s.tenth.percentage}%</td>
                    <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-400 lg:table-cell">{s.twelfth.percentage}%</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          elig
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400"
                        }
                      >
                        {elig ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          s.placementStatus === "Placed"
                            ? "default"
                            : s.placementStatus === "In Process"
                            ? "default"
                            : "secondary"
                        }
                        className={cn(
                          s.placementStatus === "Placed"
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : s.placementStatus === "In Process"
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {s.placementStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                          onClick={() => setOpenStudent(s)}
                          title="Edit Profile"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
                          onClick={() => setUpdateOpen(s)}
                          title="Update Status"
                        >
                          <Briefcase className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-lg transition-colors",
                            s.blacklisted
                              ? "text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 dark:text-rose-400 dark:bg-rose-950/30 dark:hover:bg-rose-900/40"
                              : "text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30"
                          )}
                          onClick={() => {
                            setState((st) => ({
                              ...st,
                              students: st.students.map((x) =>
                                x.id === s.id ? { ...x, blacklisted: !x.blacklisted } : x,
                              ),
                            }));
                            toast.success(s.blacklisted ? "Unblacklisted" : "Blacklisted");
                          }}
                          title={s.blacklisted ? "Unblacklist" : "Blacklist"}
                        >
                          <Ban className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StudentModal
        student={openStudent}
        onClose={() => setOpenStudent(null)}
        onUpdateStatus={(s) => {
          setOpenStudent(null);
          setUpdateOpen(s);
        }}
      />
      <UpdateStatusDialog student={updateOpen} onClose={() => setUpdateOpen(null)} />
      <BulkUpdateStatusDialog
        studentIds={bulkUpdateOpen ? selected : null}
        onClose={() => {
          setBulkUpdateOpen(false);
          setSelected([]);
        }}
      />
    </Card>
  );
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-auto min-w-32 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All {placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Custom parsing helpers
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

const parsePlainLines = (value: string | undefined) =>
  (value ?? "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

interface SkillItem {
  skill_name: string;
  skill_category: "TECHNICAL" | "SOFT_SKILL" | "TOOL" | "FRAMEWORK";
}

interface ProjectItem {
  title: string;
  description?: string;
  technologies: string;
  project_type: "ACADEMIC" | "PERSONAL" | "INTERNSHIP" | "FREELANCE" | "OPEN_SOURCE";
  start_date?: string;
  end_date?: string;
  is_ongoing: boolean;
  team_size?: string;
  role?: string;
  project_url?: string;
  github_url?: string;
}

interface CertificationItem {
  name: string;
  organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
}

interface ExperienceItem {
  company_name: string;
  role: string;
  experience_type: "INTERNSHIP" | "FULL_TIME" | "PART_TIME" | "FREELANCE" | "TRAINING";
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location: string;
  work_mode: "WFO" | "WFH" | "HYBRID";
  projects_worked?: string;
}

interface AchievementItem {
  event_name: string;
  event_date: string;
  place: string;
  level: "INTERNATIONAL" | "NATIONAL" | "STATE" | "DISTRICT" | "COLLEGE" | "LOCAL";
  category: "EVENT" | "PAPER_PRESENTATION" | "HACKATHON" | "WORKSHOP" | "COMPETITION";
  won: boolean;
  position_or_award?: string;
  details?: string;
}

interface LinkItem {
  title: string;
  url: string;
}

function StudentModal({
  student,
  onClose,
  onUpdateStatus,
}: {
  student: Student | null;
  onClose: () => void;
  onUpdateStatus: (s: Student) => void;
}) {
  const { setState } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  if (!student) return null;

  // Parsing details
  const skillItems = parseJsonLines<SkillItem>(
    (student.skills ?? []).join("\n"),
    (line) => ({
      skill_name: line,
      skill_category: "TECHNICAL",
    })
  );

  const languageItems = student.languages ?? [];

  const backlogEntries: { sem: number; subject: string }[] = (() => {
    try {
      return JSON.parse(student.liveBacklogsOrNa ?? "[]");
    } catch {
      return [];
    }
  })();

  const projectItems = parseJsonLines<ProjectItem>(
    student.projects,
    (line) => ({
      title: line,
      description: "",
      technologies: "",
      project_type: "PERSONAL",
      is_ongoing: false,
    })
  );

  const certificationItems = parseJsonLines<CertificationItem>(
    student.nptelAndCertificationDetails,
    (line) => ({
      name: line,
      organization: "",
      issue_date: "",
    })
  );

  const achievementItems = parseJsonLines<AchievementItem>(
    student.foreignLanguageCertificateDetails,
    (line) => ({
      event_name: line,
      event_date: "",
      place: "",
      level: "COLLEGE",
      category: "EVENT",
      won: false,
      position_or_award: "",
      details: "",
    })
  );

  const experienceItems = parseJsonLines<ExperienceItem>(
    student.areaSpecialization,
    (line) => ({
      company_name: line,
      role: "",
      experience_type: "INTERNSHIP",
      start_date: "",
      end_date: "",
      is_current: false,
      location: "",
      work_mode: "WFO",
      projects_worked: "",
    })
  );

  const professionalBodyItems = parsePlainLines(student.professionalBodyMembership);

  const additionalLinkItems = parseJsonLines<LinkItem>(
    student.additionalLinks,
    (line) => ({ title: line, url: "" })
  );

  // Status badging styles
  const statusColorMap = {
    verified: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/30",
    pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30",
    draft: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    rejected: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/30",
  };

  const placementColorMap = {
    Placed: "bg-emerald-500 hover:bg-emerald-600 text-white",
    "Not Placed": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    "In Process": "bg-amber-500 hover:bg-amber-600 text-white",
  };

  // Helper for rendering a detail row
  const ModalRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/30 dark:hover:bg-slate-800/10 px-2 rounded-lg transition-colors">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm text-right max-w-[60%] truncate">
        {value || "—"}
      </div>
    </div>
  );

  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto sm:rounded-2xl border-emerald-500/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-0 ring-1 ring-black/5">
        {/* Header Block */}
        <div className="relative border-b border-slate-100 dark:border-white/10 p-6 bg-gradient-to-r from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <AvatarCircle name={student.name} size={64} className="ring-2 ring-emerald-500/20 shadow-md" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  {student.name}
                  {student.blacklisted && (
                    <Badge variant="destructive" className="text-[10px] py-0 px-2 uppercase tracking-wide bg-rose-500 text-white">
                      Blacklisted
                    </Badge>
                  )}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {student.urn || student.urnNumber || "No URN"} · {student.department} · {student.rollNumber || "No Roll #"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={`text-xs px-2.5 py-0.5 rounded-full capitalize border font-medium ${statusColorMap[student.status]}`}>
                    Profile: {student.status}
                  </Badge>
                  <Badge className={`text-xs px-2.5 py-0.5 rounded-full border-0 font-medium ${placementColorMap[student.placementStatus]}`}>
                    {student.placementStatus === "Placed" && student.placedCompany
                      ? `Placed @ ${student.placedCompany} (${student.packageLpa || 0} LPA)`
                      : student.placementStatus}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 md:self-center">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:hover:border-emerald-500 bg-white/50 dark:bg-slate-900/50"
                onClick={() => onUpdateStatus(student)}
              >
                <Briefcase className="size-4 text-emerald-600" />
                Update Status
              </Button>
              <Button
                variant={student.blacklisted ? "outline" : "destructive"}
                size="sm"
                className={`h-9 gap-1.5 ${
                  student.blacklisted
                    ? "border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:hover:bg-rose-950/20"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                }`}
                onClick={() => {
                  setState((st) => ({
                    ...st,
                    students: st.students.map((x) =>
                      x.id === student.id ? { ...x, blacklisted: !x.blacklisted } : x
                    ),
                  }));
                  toast.success(student.blacklisted ? "Unblacklisted student" : "Blacklisted student");
                }}
              >
                <Ban className="size-4" />
                {student.blacklisted ? "Unblacklist" : "Blacklist"}
              </Button>
              {student.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      setState((s) => ({
                        ...s,
                        pending: s.pending.filter((p) => p.studentId !== student.id),
                        students: s.students.map((x) => (x.id === student.id ? { ...x, status: "verified" } : x)),
                      }));
                      toast.success("Approved student profile");
                    }}
                  >
                    <Check className="size-4" />
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Selector - Professional emerald layout */}
        <div className="bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-white/10 px-6 py-2 overflow-x-auto flex gap-1 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: <User className="size-4" /> },
            { id: "personal", label: "Personal & Address", icon: <Mail className="size-4" /> },
            { id: "family", label: "Family", icon: <Users className="size-4" /> },
            { id: "academics", label: "Academics & Edu", icon: <BookOpen className="size-4" /> },
            { id: "work", label: "Skills, Projects & Work", icon: <Briefcase className="size-4" /> },
            { id: "achievements", label: "Achievements & Certs", icon: <Award className="size-4" /> },
            { id: "docs", label: "Docs & Links", icon: <FileText className="size-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Tab Content Panel */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-slate-50/20 dark:bg-slate-900/10">
          
          {/* Tab 1: Overview & Profile */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {/* Summary Stats Column */}
              <div className="md:col-span-2 space-y-6">
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <User className="size-4 text-emerald-600" />
                    Career Interests & Preferences
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InterestCard
                      label="Interested in Placements"
                      val={student.interestedInPlacements}
                    />
                    <InterestCard
                      label="Interested in Higher Studies"
                      val={student.interestedInHigherStudies}
                    />
                    <InterestCard
                      label="Interested in Entrepreneurship"
                      val={student.interestedInEntrepreneurship}
                    />
                    <InterestCard
                      label="Interested in Civil Services"
                      val={student.interestedInCivilServices}
                    />
                    <InterestCard
                      label="Accepts Placement Policy"
                      val={student.acceptsPlacementPolicy}
                      className="sm:col-span-2"
                    />
                  </div>
                </Card>

                {/* Quick Academic Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <StatItem label="CGPA" val={student.cgpa ? student.cgpa.toFixed(2) : "0.00"} sub="Cumulative" />
                  <StatItem label="Active Backlogs" val={student.activeBacklogs ? "YES" : "NO"} valColor={student.activeBacklogs ? "text-rose-600" : "text-emerald-600"} sub={`${student.backlogs || 0} Total`} />
                  <StatItem label="Year" val={student.year || "—"} sub={`Division ${student.division || "—"}`} />
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                {/* Placement Details Card */}
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Briefcase className="size-4 text-emerald-600" />
                    Placement Details
                  </h3>
                  <div className="space-y-3">
                    <ModalRow label="Status" value={student.placementStatus} />
                    {student.placementStatus === "Placed" && (
                      <>
                        <ModalRow label="Placed Company" value={student.placedCompany} />
                        <ModalRow label="Package" value={`${student.packageLpa || 0} LPA`} />
                      </>
                    )}
                  </div>
                </Card>

                {/* Identity Badges / Basic info */}
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                    Contact Channels
                  </h3>
                  <div className="space-y-2 text-xs">
                    <a
                      href={`mailto:${student.email}`}
                      className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <Mail className="size-4 text-emerald-500" />
                      <span className="truncate">{student.email}</span>
                    </a>
                    {student.mobile && (
                      <a
                        href={`tel:${student.mobile}`}
                        className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <Phone className="size-4 text-emerald-500" />
                        <span>+91 {student.mobile}</span>
                      </a>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab 2: Personal & Contact */}
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                  <User className="size-4 text-emerald-600" />
                  Personal Information
                </h3>
                <ModalRow label="First Name" value={student.firstName} />
                <ModalRow label="Middle Name" value={student.middleName} />
                <ModalRow label="Surname" value={student.surname} />
                <ModalRow label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : undefined} />
                <ModalRow label="Gender" value={student.gender} />
                <ModalRow label="Category" value={student.category} />
                <ModalRow label="Caste" value={student.caste} />
              </Card>

              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                  <MapPin className="size-4 text-emerald-600" />
                  Residential Address
                </h3>
                <ModalRow label="Address Line" value={student.addressLine} />
                <ModalRow label="City" value={student.city} />
                <ModalRow label="District" value={student.dist} />
                <ModalRow label="State" value={student.state} />
                <ModalRow label="Pincode" value={student.pin} />
              </Card>
            </div>
          )}

          {/* Tab 3: Family details */}
          {activeTab === "family" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                  <User className="size-4 text-emerald-600" />
                  Father's Details
                </h3>
                <ModalRow label="Father's Name" value={student.fatherName || student.parentName} />
                <ModalRow label="Occupation" value={student.fatherOccupation || student.parentOccupation} />
                <ModalRow label="Mobile Number" value={student.fatherMobile || student.parentsMobile} />
                <ModalRow label="Email Address" value={student.fatherEmail || student.parentEmail} />
                <ModalRow label="Annual Salary (Income)" value={student.fatherSalary ? `${student.fatherSalary} LPA` : student.parentsIncomeRange} />
              </Card>

              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                  <User className="size-4 text-emerald-600" />
                  Mother's Details
                </h3>
                <ModalRow label="Mother's Name" value={student.motherName} />
                <ModalRow label="Occupation" value={student.motherOccupation} />
                <ModalRow label="Mobile Number" value={student.motherMobile} />
                <ModalRow label="Email Address" value={student.motherEmail} />
                <ModalRow label="Annual Salary (Income)" value={student.motherSalary ? `${student.motherSalary} LPA` : "—"} />
              </Card>
            </div>
          )}

          {/* Tab 4: Academics & Education */}
          {activeTab === "academics" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* College records */}
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                    <GraduationCap className="size-4 text-emerald-600" />
                    College Academic Records
                  </h3>
                  <ModalRow label="URN / Registration Number" value={student.urn || student.urnNumber} />
                  <ModalRow label="Roll Number" value={student.rollNumber} />
                  <ModalRow label="Department" value={student.department} />
                  <ModalRow label="Year & Division" value={`${student.year} Year · Division ${student.division}`} />
                  <ModalRow label="Admission Period" value={student.admissionMonth && student.admissionYear ? `${student.admissionMonth} ${student.admissionYear}` : "—"} />
                  <ModalRow label="Passout / Graduation Year" value={student.passoutYear} />
                  <ModalRow label="Current Semester" value={student.currentSemester} />
                  <ModalRow label="CGPA" value={student.cgpa ? student.cgpa.toFixed(2) : "0.00"} />
                  <ModalRow label="Aggregate Marks (%)" value={student.aggregateTillCurrentSemester ? `${student.aggregateTillCurrentSemester}%` : "—"} />
                  <ModalRow label="Backlogs Counts" value={`${student.backlogs || 0} Total (${student.activeBacklogs ? "Active" : "None"})`} />
                </Card>

                {/* Backlogs List */}
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                    <AlertCircle className="size-4 text-emerald-600" />
                    Live Backlog Subjects
                  </h3>
                  {backlogEntries.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      No live backlogs reported. Highly eligible!
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[220px] overflow-y-auto">
                      {backlogEntries.map((b, i) => (
                        <div key={i} className="flex justify-between py-2 items-center text-sm">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{b.subject}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50">
                            Semester {b.sem}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* School levels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 10th */}
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                    <Building className="size-4 text-emerald-600" />
                    10th Standard / Matriculation
                  </h3>
                  <ModalRow label="Board" value={student.tenth?.board} />
                  <ModalRow label="School" value={student.tenth?.school} />
                  <ModalRow label="Year of Passing" value={student.tenth?.year} />
                  <ModalRow label="Percentage / CGPA" value={student.tenth?.percentage ? `${student.tenth.percentage}%` : "—"} />
                </Card>

                {/* 12th / Diploma */}
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b flex items-center gap-2">
                    <Building className="size-4 text-emerald-600" />
                    {student.twelfth?.type || "12th Standard / Diploma"}
                  </h3>
                  <ModalRow label="Board / University" value={student.twelfth?.board} />
                  <ModalRow label="Institute / College" value={student.twelfth?.school} />
                  <ModalRow label="Stream" value={student.twelfth?.stream} />
                  <ModalRow label="Year of Passing" value={student.twelfth?.year} />
                  <ModalRow label="Percentage / CGPA" value={student.twelfth?.percentage ? `${student.twelfth.percentage}%` : "—"} />
                </Card>
              </div>
            </div>
          )}

          {/* Tab 5: Skills, Projects & Work */}
          {activeTab === "work" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Skills & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Code className="size-4 text-emerald-600" />
                    Skills & Categorization
                  </h3>
                  {skillItems.length === 0 ? (
                    <div className="text-slate-400 text-sm py-4">No skills entered.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skillItems.map((sk, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100/50 border-0"
                        >
                          {sk.skill_name}
                          {sk.skill_category && sk.skill_category !== "TECHNICAL" && (
                            <span className="ml-1 text-[9px] opacity-75 font-normal">({sk.skill_category})</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Globe className="size-4 text-emerald-600" />
                    Known Languages
                  </h3>
                  {languageItems.length === 0 ? (
                    <div className="text-slate-400 text-sm py-4">No languages listed.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {languageItems.map((lang, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1 text-xs font-medium rounded-full">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Work Experience */}
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <Briefcase className="size-4 text-emerald-600" />
                  Work & Internship Experience
                </h3>
                {experienceItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No work experience listed.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {experienceItems.map((exp, index) => (
                      <div key={index} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 relative">
                        {exp.is_current && (
                          <Badge className="absolute right-4 top-4 bg-emerald-500 text-white font-medium text-[10px] border-0">
                            Current Role
                          </Badge>
                        )}
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">{exp.role}</div>
                        <div className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                          <Building className="size-3.5" />
                          {exp.company_name}
                          <span className="text-slate-400 dark:text-slate-600">•</span>
                          <span className="text-slate-500 dark:text-slate-400 font-normal">{exp.location} ({exp.work_mode})</span>
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="size-3" />
                          {exp.start_date || "N/A"} to {exp.is_current ? "Present" : exp.end_date || "N/A"}
                          <Badge variant="outline" className="text-[10px] ml-2 font-normal border-slate-200 dark:border-slate-800">
                            {exp.experience_type}
                          </Badge>
                        </div>
                        {exp.projects_worked && (
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Projects / Responsibilities:</span> {exp.projects_worked}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Projects */}
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <Code className="size-4 text-emerald-600" />
                  Key Projects
                </h3>
                {projectItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No projects listed.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectItems.map((proj, index) => (
                      <div key={index} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">{proj.title}</span>
                            <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-semibold py-0 shrink-0 border-0">
                              {proj.project_type || "Project"}
                            </Badge>
                          </div>
                          {proj.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                              {proj.description}
                            </p>
                          )}
                          {proj.technologies && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {proj.technologies.split(",").map((tech, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] font-normal border-slate-200/50">
                                  {tech.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                          <span>{proj.role || "Developer"} {proj.team_size ? `(Team Size: ${proj.team_size})` : ""}</span>
                          <div className="flex items-center gap-1.5">
                            {proj.github_url && (
                              <a
                                href={proj.github_url.startsWith("http") ? proj.github_url : `https://${proj.github_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                              >
                                <Github className="size-4" />
                              </a>
                            )}
                            {proj.project_url && (
                              <a
                                href={proj.project_url.startsWith("http") ? proj.project_url : `https://${proj.project_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                              >
                                <ExternalLink className="size-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Tab 6: Achievements & Certifications */}
          {activeTab === "achievements" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Stats & counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem label="Papers Participated" val={student.paperPresentationsParticipatedCount || 0} sub="Presentations" />
                <StatItem label="Papers Won" val={student.paperPresentationsWonCount || 0} valColor="text-emerald-600" sub="First / Prizes" />
                <StatItem label="Events Participated" val={student.eventsParticipatedCount || 0} sub="College / External" />
                <StatItem label="Events Won" val={student.eventsWonCount || 0} valColor="text-emerald-600" sub="Awards Received" />
              </div>

              {/* Professional Memberships */}
              {professionalBodyItems.length > 0 && (
                <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Shield className="size-4 text-emerald-600" />
                    Professional Memberships
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {professionalBodyItems.map((member, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50/20 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Certifications */}
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <Award className="size-4 text-emerald-600" />
                  Certifications (NPTEL, Udemy, Coursera, AWS, etc.)
                </h3>
                {certificationItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No certifications listed.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificationItems.map((cert, index) => (
                      <div key={index} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 flex gap-3 items-start">
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg">
                          <Award className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base truncate">{cert.name}</div>
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{cert.organization}</div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            Issued: {cert.issue_date || "N/A"}
                            {cert.expiry_date ? ` • Expires: ${cert.expiry_date}` : ""}
                          </div>
                          {cert.credential_id && (
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                              ID: {cert.credential_id}
                            </div>
                          )}
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url.startsWith("http") ? cert.credential_url : `https://${cert.credential_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium inline-flex items-center gap-1 mt-2 hover:underline"
                            >
                              Verify Credential <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Achievements */}
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <Award className="size-4 text-emerald-600" />
                  Key Achievements & Competitions
                </h3>
                {achievementItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No achievements listed.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievementItems.map((ach, index) => (
                      <div key={index} className="p-4 border border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-start flex-wrap sm:flex-nowrap gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">{ach.event_name}</span>
                            <Badge variant={ach.won ? "default" : "outline"} className={ach.won ? "bg-emerald-500 text-white border-0" : "border-slate-300"}>
                              {ach.won ? ach.position_or_award || "Winner" : "Participant"}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{ach.category}</span>
                            <span>•</span>
                            <span>Level: {ach.level}</span>
                            {ach.place && (
                              <>
                                <span>•</span>
                                <span>At {ach.place}</span>
                              </>
                            )}
                          </div>
                          {ach.details && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                              {ach.details}
                            </p>
                          )}
                        </div>
                        {ach.event_date && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 shrink-0 font-medium self-start flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {ach.event_date}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Tab 7: Links & Uploaded Documents */}
          {activeTab === "docs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {/* Profiles & Links */}
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 pb-2 border-b flex items-center gap-2">
                  <Globe className="size-4 text-emerald-600" />
                  Professional Links & Profiles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {student.linkedin ? (
                    <a
                      href={student.linkedin.startsWith("http") ? student.linkedin : `https://${student.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-emerald-500/30 transition text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      <Linkedin className="size-5 text-[#0A66C2] shrink-0" />
                      <span className="truncate">LinkedIn Profile</span>
                      <ExternalLink className="size-3 text-slate-400 ml-auto" />
                    </a>
                  ) : (
                    <div className="p-3 border border-dashed rounded-xl text-slate-400 text-xs text-center flex items-center justify-center">
                      No LinkedIn listed
                    </div>
                  )}

                  {student.github ? (
                    <a
                      href={student.github.startsWith("http") ? student.github : `https://${student.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-emerald-500/30 transition text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      <Github className="size-5 text-slate-900 dark:text-white shrink-0" />
                      <span className="truncate">GitHub Profile</span>
                      <ExternalLink className="size-3 text-slate-400 ml-auto" />
                    </a>
                  ) : (
                    <div className="p-3 border border-dashed rounded-xl text-slate-400 text-xs text-center flex items-center justify-center">
                      No GitHub listed
                    </div>
                  )}

                  {student.portfolio ? (
                    <a
                      href={student.portfolio.startsWith("http") ? student.portfolio : `https://${student.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-emerald-500/30 transition text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2"
                    >
                      <Globe className="size-5 text-emerald-600 shrink-0" />
                      <span className="truncate">Personal Portfolio</span>
                      <ExternalLink className="size-3 text-slate-400 ml-auto" />
                    </a>
                  ) : null}
                </div>

                {/* Additional Links */}
                {additionalLinkItems.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Additional Resources</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {additionalLinkItems.map((lnk, i) => (
                        <a
                          key={i}
                          href={lnk.url.startsWith("http") ? lnk.url : `https://${lnk.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-medium text-slate-600 dark:text-slate-400"
                        >
                          <LinkIcon className="size-3.5 text-emerald-500" />
                          <span className="truncate">{lnk.title || lnk.url}</span>
                          <ExternalLink className="size-3 text-slate-400 ml-auto shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* File Uploads Listing */}
              <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 pb-2 border-b flex items-center gap-2">
                  <FileText className="size-4 text-emerald-600" />
                  Uploaded Verification Documents
                </h3>
                <div className="space-y-2.5">
                  <DocDownloadCard label="Resume / Curriculum Vitae" fileName={student.resumeFileName} />
                  <DocDownloadCard label="Profile Passport Photograph" fileName={student.photoFileName} />
                  <DocDownloadCard label="10th Marksheet & Certificate" fileName={student.tenthMarksheetFileName} />
                  <DocDownloadCard label="12th / Diploma Marksheet" fileName={student.twelfthMarksheetFileName} />
                  <DocDownloadCard label="Aadhar Identity Document" fileName={student.aadharFileName} />
                </div>
              </Card>
            </div>
          )}

        </div>

        {/* Footer Area */}
        <div className="border-t border-slate-100 dark:border-white/10 p-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            URN Verification Portal · ADCET Placement Cell
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 border-slate-200 dark:border-slate-800 text-xs font-semibold px-4 rounded-lg bg-white/50 dark:bg-slate-900/50">
            Close Modal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components for StudentModal
function InterestCard({ label, val, className }: { label: string; val: boolean | undefined; className?: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 dark:border-white/5 dark:bg-slate-800/20 ${className}`}>
      <div className={`grid size-5 place-items-center rounded-full border ${
        val
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-transparent"
      }`}>
        <Check className="size-3" />
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
    </div>
  );
}

function StatItem({ label, val, sub, valColor = "text-slate-800 dark:text-slate-100" }: { label: string; val: React.ReactNode; sub?: string; valColor?: string }) {
  return (
    <Card className="p-4 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-center flex flex-col justify-between h-full">
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-extrabold my-1 ${valColor}`}>{val}</div>
      {sub && <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{sub}</div>}
    </Card>
  );
}

function DocDownloadCard({ label, fileName }: { label: string; fileName: string | undefined }) {
  if (!fileName) {
    return (
      <div className="flex items-center justify-between p-3 border border-dashed rounded-xl text-slate-400 dark:border-slate-800 text-xs">
        <span>{label}</span>
        <span className="font-medium italic text-[10px] opacity-75">Not Uploaded</span>
      </div>
    );
  }

  const handleDownload = () => {
    toast.success(`Mock download triggered: ${fileName}`);
  };

  return (
    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50/40 dark:bg-slate-950/10 text-xs sm:text-sm hover:border-emerald-500/20 transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        <FileText className="size-4.5 text-emerald-600 shrink-0" />
        <div className="min-w-0">
          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{label}</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono mt-0.5">{fileName}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDownload}
        className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 rounded-lg"
        title="Download File"
      >
        <Download className="size-4" />
      </Button>
    </div>
  );
}

function UpdateStatusDialog({
  student,
  onClose,
}: {
  student: Student | null;
  onClose: () => void;
}) {
  const { state, setState } = useApp();
  const [status, setStatus] = useState<Student["placementStatus"]>(
    student?.placementStatus ?? "Not Placed",
  );
  const [company, setCompany] = useState(student?.placedCompany ?? "");
  const [pkg, setPkg] = useState<string>(student?.packageLpa?.toString() ?? "");
  const [date, setDate] = useState("");

  if (!student) return null;
  const save = () => {
    setState((s) => ({
      ...s,
      students: s.students.map((x) =>
        x.id === student.id
          ? {
            ...x,
            placementStatus: status,
            placedCompany: status === "Placed" ? company : undefined,
            packageLpa: status === "Placed" ? +pkg : undefined,
          }
          : x,
      ),
    }));
    toast.success("Status updated");
    onClose();
  };

  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update placement status</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Placement Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Student["placementStatus"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Placed", "Not Placed", "In Process"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {status === "Placed" && (
            <>
              <div>
                <Label className="text-xs">Company</Label>
                <Select value={company} onValueChange={setCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.companies.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Package (LPA)</Label>
                  <Input type="number" value={pkg} onChange={(e) => setPkg(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Offer letter date</Label>
                  <DatePicker
                    placeholder="Offer Letter Date"
                    date={date ? new Date(date) : undefined}
                    setDate={(d) => setDate(d ? d.toISOString() : "")}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BulkUpdateStatusDialog({
  studentIds,
  onClose,
}: {
  studentIds: string[] | null;
  onClose: () => void;
}) {
  const { state, setState } = useApp();
  const [status, setStatus] = useState<Student["placementStatus"]>("Not Placed");
  const [company, setCompany] = useState("");
  const [pkg, setPkg] = useState("");
  const [date, setDate] = useState("");

  if (!studentIds || studentIds.length === 0) return null;

  const save = () => {
    setState((s) => ({
      ...s,
      students: s.students.map((x) =>
        studentIds.includes(x.id)
          ? {
            ...x,
            placementStatus: status,
            placedCompany: status === "Placed" ? company : undefined,
            packageLpa: status === "Placed" ? +pkg : undefined,
          }
          : x,
      ),
    }));
    toast.success(`Updated status for ${studentIds.length} students`);
    onClose();
  };

  return (
    <Dialog open={studentIds.length > 0} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update status for {studentIds.length} students</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Placement Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Student["placementStatus"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Placed", "Not Placed", "In Process"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {status === "Placed" && (
            <>
              <div>
                <Label className="text-xs">Company</Label>
                <Select value={company} onValueChange={setCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.companies.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Package (LPA)</Label>
                  <Input type="number" value={pkg} onChange={(e) => setPkg(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Offer letter date</Label>
                  <DatePicker
                    placeholder="Offer Letter Date"
                    date={date ? new Date(date) : undefined}
                    setDate={(d) => setDate(d ? d.toISOString() : "")}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PendingList({ deptFilter }: { deptFilter?: string }) {
  const { state, setState } = useApp();
  const [subTab, setSubTab] = useState<"new" | "update">("new");
  const [sort, setSort] = useState<"new" | "old" | "dept">("new");
  const [rejectFor, setRejectFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const items = useMemo(() => {
    let list = state.pending.filter((p) => p.kind === subTab);
    if (deptFilter) list = list.filter((p) => p.department === deptFilter);
    list = [...list].sort((a, b) => {
      if (sort === "new") return +new Date(b.submittedAt) - +new Date(a.submittedAt);
      if (sort === "old") return +new Date(a.submittedAt) - +new Date(b.submittedAt);
      return a.department.localeCompare(b.department);
    });
    return list;
  }, [state.pending, subTab, sort, deptFilter]);

  const approve = (id: string, studentId: string) => {
    setState((s) => ({
      ...s,
      pending: s.pending.filter((p) => p.id !== id),
      students: s.students.map((x) => (x.id === studentId ? { ...x, status: "verified" } : x)),
    }));
    toast.success("Approved");
  };

  const submitReject = () => {
    if (!rejectFor) return;
    const item = state.pending.find((p) => p.id === rejectFor);
    setState((s) => ({
      ...s,
      pending: s.pending.filter((p) => p.id !== rejectFor),
      students:
        item?.kind === "new"
          ? s.students.map((x) => (x.id === item.studentId ? { ...x, status: "rejected" } : x))
          : s.students,
    }));
    setRejectFor(null);
    setReason("");
    toast.success("Rejected");
  };

  return (
    <Card className={cn(glassCard, "p-4")}>
      <div className="flex items-center justify-between gap-2">
        <Tabs value={subTab} onValueChange={(v) => setSubTab(v as "new" | "update")}>
          <TabsList className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-sm p-1">
            <TabsTrigger value="new" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl">New Profiles</TabsTrigger>
            <TabsTrigger value="update" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-xl">Update Requests</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={sort} onValueChange={(v) => setSort(v as "new" | "old" | "dept")}>
          <SelectTrigger className="h-9 w-40 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Newest first</SelectItem>
            <SelectItem value="old">Oldest first</SelectItem>
            <SelectItem value="dept">By department</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Nothing pending. You're all caught up.
          </div>
        )}
        {items.map((p) => (
          <Card key={p.id} className="rounded-xl p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/50 dark:border-white/10 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <AvatarCircle name={p.studentName} />
                <div>
                  <div className="font-semibold">{p.studentName}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.urn || "No URN"} · {p.department}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Submitted {new Date(p.submittedAt).toLocaleString()}
              </div>
            </div>
            {p.kind === "update" && p.changes && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-100 dark:border-white/10">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Field</th>
                      <th className="px-4 py-2 font-semibold">Previous</th>
                      <th className="px-4 py-2 font-semibold">New</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                    {p.changes.map((c) => (
                      <tr key={c.field} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{c.field}</td>
                        <td className="px-4 py-2 bg-rose-50/50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400">{c.before}</td>
                        <td className="px-4 py-2 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400">{c.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" className="gap-1.5" onClick={() => setRejectFor(p.id)}>
                <X className="size-4 text-destructive" />
                Reject
              </Button>
              <Button
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => approve(p.id, p.studentId)}
              >
                <Check className="size-4" />
                Approve
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!rejectFor} onOpenChange={(o) => !o && setRejectFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject submission</DialogTitle>
          </DialogHeader>
          <Label className="text-xs">Reason for rejection</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain what needs to change…"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectFor(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReject} disabled={!reason.trim()}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
