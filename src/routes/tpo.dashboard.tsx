import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Users, CircleCheck, Briefcase, Building2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp, isEligible, timeAgo } from "@/lib/store";
import { DEPARTMENTS } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tpo/dashboard")({ component: Dashboard });

function Dashboard() {
  const { state } = useApp();
  const s = state.students;
  const total = s.length;
  const eligible = s.filter((x) => isEligible(x, state.settings.eligibility)).length;
  const placed = s.filter((x) => x.placementStatus === "Placed").length;
  const boys = s.filter((x) => x.gender === "Male").length;
  const girls = s.filter((x) => x.gender === "Female").length;
  const other = s.filter((x) => x.gender === "Other").length;

  const depBreakdown = DEPARTMENTS.map((d) => {
    const inDept = s.filter((x) => x.department === d);
    return { d, total: inDept.length, eligible: inDept.filter((x) => isEligible(x, state.settings.eligibility)).length };
  }).filter((x) => x.total > 0);
  const maxDept = Math.max(1, ...depBreakdown.map((d) => d.total));

  const years: Array<"First" | "Second" | "Third" | "Fourth"> = ["First", "Second", "Third", "Fourth"];
  const yearData = years.map((y) => ({ y, count: s.filter((x) => x.year === y).length }));
  const maxYear = Math.max(1, ...yearData.map((d) => d.count));

  const activity = [
    { color: "bg-emerald-500", text: `Profile approved for Aryan Patil`, at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { color: "bg-primary", text: `New company "L&T" added`, at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { color: "bg-amber-500", text: `New profile submitted by Priya More`, at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { color: "bg-rose-500", text: `Update request rejected for Omkar Shinde`, at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{state.settings.collegeName} · AY {state.settings.academicYear}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<Users className="size-5" />} label="Total Students" value={total} tone="primary" />
        <Stat icon={<CircleCheck className="size-5" />} label="Eligible" value={eligible} tone="emerald" />
        <Stat icon={<Briefcase className="size-5" />} label="Placed" value={placed} tone="primary" />
        <Stat icon={<Building2 className="size-5" />} label="Companies" value={state.companies.length} tone="amber" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <GenderCard label="Boys" value={boys} />
        <GenderCard label="Girls" value={girls} />
        <GenderCard label="Other" value={other} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-5">
          <h3 className="font-semibold">Eligibility by Department</h3>
          <p className="text-xs text-muted-foreground">Eligible vs total per branch</p>
          <div className="mt-4 space-y-3">
            {depBreakdown.map(({ d, total, eligible }) => (
              <div key={d}>
                <div className="flex justify-between text-xs"><span className="font-medium">{d}</span><span className="text-muted-foreground">{eligible}/{total}</span></div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(eligible / maxDept) * 100}%` }} />
                </div>
              </div>
            ))}
            {depBreakdown.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
          </div>
        </Card>

        <Card className="rounded-2xl p-5">
          <h3 className="font-semibold">Year-wise Distribution</h3>
          <p className="text-xs text-muted-foreground">Students per academic year</p>
          <div className="mt-4 flex h-44 items-end gap-3">
            {yearData.map((d) => (
              <div key={d.y} className="flex flex-1 flex-col items-center gap-2">
                <div className="text-xs font-semibold">{d.count}</div>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all" style={{ height: `${(d.count / maxYear) * 100}%`, minHeight: 4 }} />
                <div className="text-xs text-muted-foreground">{d.y}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold">Recent Activity</h3>
          <ul className="mt-4 space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={cn("size-2.5 rounded-full", a.color)} />
                  {i < activity.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(a.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-2xl p-5">
          <h3 className="font-semibold">Pending Verifications</h3>
          <div className="mt-3 grid place-items-center rounded-xl bg-primary/10 py-6">
            <div className="text-4xl font-bold text-primary">{state.pending.length}</div>
            <div className="text-xs text-muted-foreground">items awaiting review</div>
          </div>
          <Button className="mt-4 w-full gap-1.5" asChild>
            <Link to="/tpo/students">Review Now<ArrowRight className="size-4" /></Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: "primary" | "emerald" | "amber" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <Card className="rounded-2xl p-4">
      <div className={cn("inline-grid size-10 place-items-center rounded-lg", tones[tone])}>{icon}</div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}

function GenderCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className="grid size-10 place-items-center rounded-full bg-accent/20 text-accent-foreground">
          <div className="size-5 rounded-full border-4 border-accent" />
        </div>
      </div>
    </Card>
  );
}
