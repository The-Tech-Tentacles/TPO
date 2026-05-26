"use client";

import { useMemo } from "react";
import {
  Users,
  Briefcase,
  Building2,
  CircleCheck,
  TrendingUp,
  Clock,
  FileCheck2,
  AlertCircle,
  ArrowUpRight,
  Award,
  Target,
  Activity,
  CalendarCheck,
  ChevronRight,
  BarChart3,
  GraduationCap,
  IndianRupee,
  School,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS } from "@/lib/dummy-data";
import { isEligible, useApp, timeAgo } from "@/lib/store";
import { routes } from "@/shared/config/routes";
import { cn } from "@/lib/utils";
import { AvatarCircle } from "@/components/AvatarCircle";

const glass =
  "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all";

// ─── Stat Card ──────────────────────────────────────────────────────────────
function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
  href,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const inner = (
    <Card
      className={cn(
        glass,
        "p-4 flex flex-col gap-2.5 hover:scale-[1.02] hover:shadow-xl duration-300 cursor-default group",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "inline-grid size-10 place-items-center rounded-xl shadow-sm border shrink-0",
              accent ||
              "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/40",
            )}
          >
            {icon}
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none">
              {value}
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
          </div>
        </div>
        {href && (
          <ArrowUpRight className="size-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
        )}
      </div>
      {sub && <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">{sub}</div>}
      {children && <div className="mt-1.5 pt-2.5 border-t border-slate-100 dark:border-white/5">{children}</div>}
    </Card>
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return href ? <Link href={href as any}>{inner}</Link> : inner;
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="inline-grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function TpoDashboardPage() {
  const { state, user } = useApp();
  const s = state.students;
  const fourthYearStudents = s.filter((x) => x.year === "Fourth");

  const total = s.length;
  const eligible = fourthYearStudents.filter((x) => isEligible(x, state.settings.eligibility)).length;
  const placed = fourthYearStudents.filter((x) => x.placementStatus === "Placed").length;
  const inProcess = fourthYearStudents.filter((x) => x.placementStatus === "In Process").length;
  const notPlaced = fourthYearStudents.filter((x) => x.placementStatus === "Not Placed").length;
  
  const finalYearCount = fourthYearStudents.length;
  const placementRate = finalYearCount > 0 ? Math.round((placed / finalYearCount) * 100) : 0;
  const eligibleRate = finalYearCount > 0 ? Math.round((eligible / finalYearCount) * 100) : 0;

  const packages = fourthYearStudents.filter((x) => x.packageLpa).map((x) => x.packageLpa!);
  const avgPackage = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : "—";
  const maxPackage = packages.length > 0 ? Math.max(...packages).toFixed(2) : "—";

  // Students breakdowns
  const boysCount = s.filter((x) => x.gender === "Male").length;
  const girlsCount = s.filter((x) => x.gender === "Female").length;
  const yr1 = s.filter((x) => x.year === "First").length;
  const yr2 = s.filter((x) => x.year === "Second").length;
  const yr3 = s.filter((x) => x.year === "Third").length;
  const yr4 = s.filter((x) => x.year === "Fourth").length;

  // Faculty breakdowns
  const adminCount = state.faculty.filter((x) => x.role === "tpo-admin").length;
  const coAdminCount = state.faculty.filter((x) => x.role === "tpo-co-admin").length;
  const deptCount = state.faculty.filter((x) => x.role === "tpo-department").length;
  const modCount = state.faculty.filter((x) => x.role === "moderator").length;

  // Company breakdowns
  const techCount = state.companies.filter((x) => {
    const ind = x.industry.toLowerCase();
    return ind.includes("tech") || ind.includes("it ") || ind.includes("services") || ind.includes("software");
  }).length;
  const electricalCount = state.companies.filter((x) => x.industry.toLowerCase().includes("electr")).length;
  const mechanicalCount = state.companies.filter((x) => x.industry.toLowerCase().includes("mechanic")).length;
  const aeroCount = state.companies.filter((x) => {
    const ind = x.industry.toLowerCase();
    return ind.includes("aero") || ind.includes("automob") || ind.includes("aviat");
  }).length;
  const civilCount = state.companies.filter((x) => {
    const ind = x.industry.toLowerCase();
    return ind.includes("civil") || ind.includes("construct") || ind.includes("infra");
  }).length;

  const depBreakdown = DEPARTMENTS.map((d) => {
    const dept = fourthYearStudents.filter((x) => x.department === d);
    const dPlaced = dept.filter((x) => x.placementStatus === "Placed").length;
    return { d, count: dept.length, placed: dPlaced };
  }).filter((x) => x.count > 0);

  const maxDeptCount = Math.max(...depBreakdown.map((d) => d.count), 1);

  const companyBreakdown = state.companies.map((c) => {
    const cPlaced = fourthYearStudents.filter((x) => x.placementStatus === "Placed" && x.placedCompany === c.name).length;
    return { name: c.name, industry: c.industry, placed: cPlaced, ctcMax: c.ctcMax };
  }).sort((a, b) => b.placed - a.placed);

  const recentlyPlaced = [...fourthYearStudents]
    .filter((x) => x.placementStatus === "Placed" && x.placedCompany)
    .slice(0, 5);

  const pendingCount = state.pending.length;
  const pendingNew = state.pending.filter((p) => p.kind === "new").length;
  const pendingUpdate = state.pending.filter((p) => p.kind === "update").length;

  const recentPosts = [...state.posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Alert Banner: Pending items ── */}
      {pendingCount > 0 && (
        <Link href={routes.tpo.students}>
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/80 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-amber-800/30 dark:bg-amber-900/20 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors cursor-pointer mb-3">
            <div className="inline-grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 shrink-0">
              <AlertCircle className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                {pendingCount} verification{pendingCount > 1 ? "s" : ""} awaiting your review
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                {pendingNew} new profile{pendingNew !== 1 ? "s" : ""} · {pendingUpdate} update request{pendingUpdate !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 shrink-0">
              Review now <ChevronRight className="size-4" />
            </div>
          </div>
        </Link>
      )}

      {/* ── KPI Row 1 ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Users className="size-5" />}
          label="Total Students"
          value={total}
          sub="Registered for placement drive"
          href={routes.tpo.students}
        >
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 bg-blue-50/70 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30">
              Boys: {boysCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-rose-50/70 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30">
              Girls: {girlsCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100/60 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/40">
              1st Yr: {yr1}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100/60 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/40">
              2nd Yr: {yr2}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100/60 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/40">
              3rd Yr: {yr3}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100/60 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/40">
              4th Yr: {yr4}
            </span>
          </div>
        </KpiCard>

        <KpiCard
          icon={<School className="size-5" />}
          label="Total Faculty"
          value={state.faculty.length}
          sub="Assigned mentors & TPO officers"
          accent="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/40"
          href={routes.tpo.faculty}
        >
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30">
              Admin: {adminCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30">
              Co-Admin: {coAdminCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30">
              Dept TPO: {deptCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30">
              Moderator: {modCount}
            </span>
          </div>
        </KpiCard>

        <KpiCard
          icon={<Building2 className="size-5" />}
          label="Total Companies"
          value={state.companies.length}
          sub="Registered recruiting partners"
          accent="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/40"
          href={routes.tpo.companies}
        >
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30">
              Tech/IT: {techCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30">
              Electrical: {electricalCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30">
              Mechanical: {mechanicalCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30">
              Aero: {aeroCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30">
              Civil: {civilCount}
            </span>
          </div>
        </KpiCard>
      </div>



      {/* ── Middle row: Overview, Placements, Companies ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Placement Overview */}
        <Card className={cn(glass, "p-6")}>
          <SectionHeader
            icon={<Target className="size-4" />}
            title="Placement Overview"
            action={
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40 font-bold px-3 py-1 text-xs shadow-sm flex items-center gap-1.5 rounded-full shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {eligible} Eligible Students
              </Badge>
            }
          />

          {/* Donut-style progress */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative size-36">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${placementRate * 2.39} ${239 - placementRate * 2.39}`}
                  strokeLinecap="round"
                  className="text-emerald-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{placementRate}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Placed</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Target: 80%</div>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {[
              { label: "Placed", count: placed, color: "bg-emerald-500" },
              { label: "In Process", count: inProcess, color: "bg-amber-400" },
              { label: "Not Placed", count: notPlaced, color: "bg-slate-300 dark:bg-slate-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-full", item.color)} />
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", item.color)}
                      style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 w-5 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
                <div className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {eligible}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Eligible</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
                <div className="text-base font-bold text-slate-800 dark:text-slate-100">{avgPackage !== "—" ? `₹${avgPackage}L` : "—"}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Avg Package</div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5">
                <div className="text-base font-bold text-slate-800 dark:text-slate-100">{maxPackage !== "—" ? `₹${maxPackage}L` : "—"}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Highest CTC</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Placements */}
        <Card className={cn(glass, "p-6")}>
          <SectionHeader
            icon={<Award className="size-4" />}
            title="Recent Placements"
            action={
              <Link href={routes.tpo.students} className="text-xs text-emerald-600 hover:underline dark:text-emerald-400 flex items-center gap-0.5">
                View all <ChevronRight className="size-3" />
              </Link>
            }
          />
          {recentlyPlaced.length === 0 && (
            <p className="text-sm text-slate-400 py-6 text-center">No placements yet.</p>
          )}
          <div className="space-y-3">
            {recentlyPlaced.map((st) => (
              <div key={st.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <AvatarCircle name={st.name} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{st.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{st.urn} · {st.department}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{st.placedCompany}</div>
                  {st.packageLpa && (
                    <div className="text-xs text-slate-400">₹{st.packageLpa}L</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Companies */}
        <Card className={cn(glass, "p-6")}>
          <SectionHeader
            icon={<Building2 className="size-4" />}
            title="Registered Companies"
            action={
              <Link href={routes.tpo.companies} className="text-xs text-emerald-600 hover:underline dark:text-emerald-400 flex items-center gap-0.5">
                Manage <ChevronRight className="size-3" />
              </Link>
            }
          />
          <div className="space-y-3">
            {state.companies.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="inline-grid size-9 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  <Building2 className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{c.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.industry} · {c.location}</div>
                </div>
                {c.ctcMax && (
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    ₹{c.ctcMax}L
                  </div>
                )}
              </div>
            ))}
            {state.companies.length === 0 && (
              <p className="text-sm text-slate-400 py-6 text-center">No companies added yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Breakdowns: Department & Company ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Breakdown Table */}
        <Card className={cn(glass, "p-6 min-w-0")}>
          <SectionHeader
            icon={<BarChart3 className="size-4" />}
            title="Department Breakdown"
          />
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 uppercase border-y border-slate-100 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold text-center">Total Students</th>
                  <th className="px-4 py-3 font-semibold text-center">Eligible</th>
                  <th className="px-4 py-3 font-semibold text-center">Placed</th>
                  <th className="px-4 py-3 font-semibold text-center">Placement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {depBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No data available.</td>
                  </tr>
                ) : (
                  depBreakdown.map((d) => {
                    const pct = d.count > 0 ? Math.round((d.placed / d.count) * 100) : 0;
                    const deptStudents = s.filter((x) => x.department === d.d);
                    const deptEligible = deptStudents.filter((x) => isEligible(x, state.settings.eligibility)).length;
                    return (
                      <tr key={d.d} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{d.d}</td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{d.count}</td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{deptEligible}</td>
                        <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">{d.placed}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-slate-700 dark:text-slate-300 w-8 text-right text-xs font-medium">{pct}%</span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Company Breakdown Table */}
        <Card className={cn(glass, "p-6 min-w-0")}>
          <SectionHeader
            icon={<Building2 className="size-4" />}
            title="Company Breakdown"
            action={
              <Link href={routes.tpo.companies} className="text-xs text-emerald-600 hover:underline dark:text-emerald-400 flex items-center gap-0.5">
                View all <ChevronRight className="size-3" />
              </Link>
            }
          />
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 uppercase border-y border-slate-100 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Industry</th>
                  <th className="px-4 py-3 font-semibold text-center">Placed</th>
                  <th className="px-4 py-3 font-semibold text-right">Max CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {companyBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No data available.</td>
                  </tr>
                ) : (
                  companyBreakdown.slice(0, 6).map((c) => (
                    <tr key={c.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{c.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{c.industry}</td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">{c.placed}</td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{c.ctcMax ? `₹${c.ctcMax}L` : "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── Recent Activity Table ── */}
      <Card className={cn(glass, "p-6")}>
        <SectionHeader
          icon={<Activity className="size-4" />}
          title="Recent Activity"
          action={
            <Link href={routes.tpo.feed} className="text-xs text-emerald-600 hover:underline dark:text-emerald-400 flex items-center gap-0.5">
              View Feed <ChevronRight className="size-3" />
            </Link>
          }
        />
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 uppercase border-y border-slate-100 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No activity yet.</td>
                </tr>
              ) : (
                recentPosts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded-md text-xs font-medium",
                          p.type === "Notice"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : p.type === "Poll"
                              ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                        )}
                      >
                        {p.type}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-[300px] truncate">{p.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.authorName}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" /> {timeAgo(p.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
