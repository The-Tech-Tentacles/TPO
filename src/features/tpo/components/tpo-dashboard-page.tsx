"use client";

import { Building2, Briefcase, CircleCheck, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/dummy-data";
import { isEligible, useApp } from "@/lib/store";

export function TpoDashboardPage() {
  const { state } = useApp();
  const s = state.students;
  const total = s.length;
  const eligible = s.filter((x) => isEligible(x, state.settings.eligibility)).length;
  const placed = s.filter((x) => x.placementStatus === "Placed").length;
  const depBreakdown = DEPARTMENTS.map((d) => ({
    d,
    count: s.filter((x) => x.department === d).length,
  })).filter((x) => x.count > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{state.settings.collegeName}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<Users className="size-5" />} label="Total Students" value={total} />
        <Stat icon={<CircleCheck className="size-5" />} label="Eligible" value={eligible} />
        <Stat icon={<Briefcase className="size-5" />} label="Placed" value={placed} />
        <Stat
          icon={<Building2 className="size-5" />}
          label="Companies"
          value={state.companies.length}
        />
      </div>
      <Card className="rounded-2xl p-5">
        <h3 className="font-semibold">Department Distribution</h3>
        <div className="mt-3 space-y-2">
          {depBreakdown.map((d) => (
            <div
              key={d.d}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <span>{d.d}</span>
              <span className="font-semibold">{d.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="rounded-2xl p-4">
      <div className="inline-grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}
