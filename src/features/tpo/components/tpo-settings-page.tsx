"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "eligibility", label: "Eligibility Criteria" },
  { id: "domain", label: "Email Domain" },
  { id: "general", label: "General" },
] as const;

export function TpoSettingsPage() {
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("eligibility");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your TPC portal.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit rounded-2xl p-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium",
                active === s.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
              )}
            >
              {s.label}
            </button>
          ))}
        </Card>

        <div>
          {active === "eligibility" && <EligibilityForm />}
          {active === "domain" && <DomainForm />}
          {active === "general" && <GeneralForm />}
        </div>
      </div>
    </div>
  );
}

function EligibilityForm() {
  const { state, setState } = useApp();
  const [c, setC] = useState(state.settings.eligibility);
  const save = () => {
    setState((s) => ({ ...s, settings: { ...s.settings, eligibility: c } }));
    toast.success("Saved");
  };
  return (
    <Card className="rounded-2xl p-5">
      <h2 className="text-lg font-semibold">Eligibility Criteria</h2>
      <p className="text-xs text-muted-foreground">
        Thresholds applied when computing student eligibility.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <Label className="text-xs">10th percentage min</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={c.tenthMin}
            onChange={(e) => setC({ ...c, tenthMin: +e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">12th / Diploma min</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={c.twelfthMin}
            onChange={(e) => setC({ ...c, twelfthMin: +e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">CGPA / CPI min</Label>
          <Input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={c.cgpaMin}
            onChange={(e) => setC({ ...c, cgpaMin: +e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Switch checked={c.combined} onCheckedChange={(v) => setC({ ...c, combined: v })} />
        <Label className="text-sm">
          Apply as combined average instead of individual thresholds
        </Label>
      </div>
      <p className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        Currently: Students must score ≥{c.tenthMin}% in 10th, ≥{c.twelfthMin}% in 12th, ≥
        {c.cgpaMin} CPI{c.combined ? " (combined)" : ""}.
      </p>
      <div className="mt-4 flex justify-end">
        <Button onClick={save}>Save Criteria</Button>
      </div>
    </Card>
  );
}

function DomainForm() {
  const { state, setState } = useApp();
  const [on, setOn] = useState(state.settings.emailDomainRestrict);
  const [domains, setDomains] = useState<string[]>(state.settings.allowedDomains);
  const [draft, setDraft] = useState("");
  const save = () => {
    setState((s) => ({
      ...s,
      settings: { ...s.settings, emailDomainRestrict: on, allowedDomains: domains },
    }));
    toast.success("Saved");
  };
  return (
    <Card className="rounded-2xl p-5">
      <h2 className="text-lg font-semibold">Email Domain Restriction</h2>
      <div className="mt-4 flex items-center gap-3">
        <Switch checked={on} onCheckedChange={setOn} />
        <Label className="text-sm">Restrict registration to specific email domains</Label>
      </div>
      {on && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
              >
                @{d}
                <button onClick={() => setDomains(domains.filter((x) => x !== d))}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. adcet.ac.in"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Button
              onClick={() => {
                if (draft.trim()) {
                  setDomains([...domains, draft.trim()]);
                  setDraft("");
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button onClick={save}>Save</Button>
      </div>
    </Card>
  );
}

function GeneralForm() {
  const { state, setState } = useApp();
  const [s, setS] = useState(state.settings);
  const save = () => {
    setState((p) => ({ ...p, settings: s }));
    toast.success("Saved");
  };
  return (
    <Card className="rounded-2xl p-5">
      <h2 className="text-lg font-semibold">General Settings</h2>
      <div className="mt-4 space-y-3">
        <div>
          <Label className="text-xs">College / Institute name</Label>
          <Input
            value={s.collegeName}
            onChange={(e) => setS({ ...s, collegeName: e.target.value })}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Academic year</Label>
            <Input
              value={s.academicYear}
              onChange={(e) => setS({ ...s, academicYear: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">TPO contact email</Label>
            <Input
              type="email"
              value={s.tpoEmail}
              onChange={(e) => setS({ ...s, tpoEmail: e.target.value })}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={save}>Save</Button>
      </div>
    </Card>
  );
}


