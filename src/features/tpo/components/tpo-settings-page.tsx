"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Award, ShieldAlert, Globe, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const glassCard =
  "rounded-2xl border border-white/40 bg-white/40 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/40 dark:ring-white/20 transition-all";

const sections = [
  { id: "eligibility", label: "Eligibility Criteria", icon: ShieldAlert },
  { id: "policies", label: "Placement Rules", icon: Award },
  { id: "domain", label: "Email Domain", icon: Globe },
  { id: "general", label: "General & Season", icon: Settings2 },
] as const;

export function TpoSettingsPage() {
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("eligibility");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Portal Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure academic eligibility thresholds, placement package tiers, email domain filters, and active recruitment parameters.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className={cn(glassCard, "h-fit p-2 space-y-1")}>
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ease-out",
                  active === s.id
                    ? "bg-emerald-600/10 text-emerald-800 border border-emerald-500/10 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/30 scale-[1.02]"
                    : "text-slate-600 border border-transparent hover:bg-white/50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-emerald-300",
                )}
              >
                <Icon className="size-4" />
                {s.label}
              </button>
            );
          })}
        </Card>

        <div className="min-h-[400px]">
          {active === "eligibility" && <EligibilityForm />}
          {active === "policies" && <PoliciesForm />}
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
  const [maxBacklogs, setMaxBacklogs] = useState(state.settings.maxBacklogsAllowed ?? 0);

  const save = () => {
    setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        eligibility: c,
        maxBacklogsAllowed: maxBacklogs,
      },
    }));
    toast.success("Eligibility criteria updated successfully");
  };

  return (
    <Card className={cn(glassCard, "animate-in fade-in slide-in-from-right-4 duration-500 space-y-5")}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Eligibility Criteria</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Thresholds applied when computing student eligibility for campus registration.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">10th Percentage Min</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={c.tenthMin}
            onChange={(e) => setC({ ...c, tenthMin: +e.target.value })}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">12th / Diploma Min</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={c.twelfthMin}
            onChange={(e) => setC({ ...c, twelfthMin: +e.target.value })}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">CGPA / CPI Min</Label>
          <Input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={c.cgpaMin}
            onChange={(e) => setC({ ...c, cgpaMin: +e.target.value })}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Max Active Backlogs</Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={maxBacklogs}
            onChange={(e) => setMaxBacklogs(+e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/30 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 p-3 rounded-xl">
        <Switch checked={c.combined} onCheckedChange={(v) => setC({ ...c, combined: v })} />
        <div>
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Average Percentage Rule</Label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Apply as combined average across 10th and 12th/Diploma instead of separate thresholds.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50/50 dark:bg-slate-950/20 p-4 border border-slate-200/40 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
        <span className="font-semibold text-slate-700 dark:text-slate-350">Active Rule Preview:</span>
        <p className="leading-relaxed">
          Students must have ≥{c.tenthMin}% in 10th grade, ≥{c.twelfthMin}% in 12th grade / Diploma, and score a minimum cumulative CGPA of ≥{c.cgpaMin}{c.combined ? " (on a combined average)" : ""}.
          Additionally, students must have no more than <span className="font-bold text-emerald-600 dark:text-emerald-400">{maxBacklogs} active backlogs</span> to qualify.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={save}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
        >
          Save Eligibility Tiers
        </Button>
      </div>
    </Card>
  );
}

function PoliciesForm() {
  const { state, setState } = useApp();
  const [dreamPkg, setDreamPkg] = useState(state.settings.dreamPackageLpa ?? 8.0);
  const [superDreamPkg, setSuperDreamPkg] = useState(state.settings.superDreamPackageLpa ?? 15.0);
  const [allowMultiple, setAllowMultiple] = useState(state.settings.allowMultipleOffers ?? true);

  const save = () => {
    setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        dreamPackageLpa: dreamPkg,
        superDreamPackageLpa: superDreamPkg,
        allowMultipleOffers: allowMultiple,
      },
    }));
    toast.success("Placement rules updated successfully");
  };

  return (
    <Card className={cn(glassCard, "animate-in fade-in slide-in-from-right-4 duration-500 space-y-5")}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Placement Rules & Policies</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Establish CTC package classification tiers and rules for multiple job offers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Dream Package Threshold (LPA)</Label>
          <Input
            type="number"
            min={0}
            step={0.5}
            value={dreamPkg}
            onChange={(e) => setDreamPkg(+e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Super Dream Threshold (LPA)</Label>
          <Input
            type="number"
            min={0}
            step={0.5}
            value={superDreamPkg}
            onChange={(e) => setSuperDreamPkg(+e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/30 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 p-4 rounded-xl">
        <Switch checked={allowMultiple} onCheckedChange={setAllowMultiple} />
        <div>
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Upgrade Offer Policy</Label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Allow students placed in non-dream companies to sit for Dream and Super Dream recruitment drives.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50/50 dark:bg-slate-950/20 p-4 border border-slate-200/40 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <span className="font-semibold text-slate-700 dark:text-slate-350">CTC Package Classification Rules:</span>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 dark:bg-amber-950/10">
            <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[9px] tracking-wider block">Dream Package Range</span>
            <p className="font-semibold text-[13px] text-slate-700 dark:text-slate-300 mt-0.5">
              ₹{dreamPkg} LPA to ₹{superDreamPkg} LPA
            </p>
          </div>
          <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10 dark:bg-violet-950/10">
            <span className="font-bold text-violet-600 dark:text-violet-400 uppercase text-[9px] tracking-wider block">Super Dream Range</span>
            <p className="font-semibold text-[13px] text-slate-700 dark:text-slate-300 mt-0.5">
              Above ₹{superDreamPkg} LPA
            </p>
          </div>
        </div>
        <p className="leading-relaxed mt-1 text-[11px] text-slate-500">
          {allowMultiple
            ? "✓ Students currently placed with a non-dream offer remain eligible to participate in recruitment drives categorized as Dream or Super Dream."
            : "✗ Strict One-Student One-Job policy is active. Students placed in any company will be immediately blocked from all future drives."}
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={save}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
        >
          Save Placement Rules
        </Button>
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
    toast.success("Email domain filters updated successfully");
  };

  return (
    <Card className={cn(glassCard, "animate-in fade-in slide-in-from-right-4 duration-500 space-y-5")}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Email Domain Restriction</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Restrict student registration and logins to official institutional email address domains.
        </p>
      </div>

      <div className="flex items-center gap-3 bg-white/30 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 p-4 rounded-xl">
        <Switch checked={on} onCheckedChange={setOn} />
        <div>
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Restrict Registration</Label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Allow registrations only from the whitelisted academic domain names.
          </p>
        </div>
      </div>

      {on && (
        <div className="space-y-3.5 animate-in fade-in duration-300">
          <div className="flex flex-wrap gap-2 p-3 bg-white/30 dark:bg-slate-950/15 border border-slate-200/40 rounded-xl min-h-[50px] items-center">
            {domains.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/30 px-3 py-1 text-xs font-semibold shadow-sm"
              >
                @{d}
                <button
                  type="button"
                  onClick={() => setDomains(domains.filter((x) => x !== d))}
                  className="hover:text-emerald-950 dark:hover:text-emerald-100 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            {domains.length === 0 && (
              <span className="text-xs text-slate-400 dark:text-slate-500 italic px-1">
                No active domains whitelisted yet.
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. adcet.ac.in"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && draft.trim()) {
                  e.preventDefault();
                  if (!domains.includes(draft.trim())) {
                    setDomains([...domains, draft.trim()]);
                  }
                  setDraft("");
                }
              }}
            />
            <Button
              onClick={() => {
                if (draft.trim()) {
                  if (!domains.includes(draft.trim())) {
                    setDomains([...domains, draft.trim()]);
                  }
                  setDraft("");
                }
              }}
              className="bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Add Domain
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          onClick={save}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
        >
          Save Domain Security
        </Button>
      </div>
    </Card>
  );
}

function GeneralForm() {
  const { state, setState } = useApp();
  const [s, setS] = useState(state.settings);

  const save = () => {
    setState((p) => ({ ...p, settings: s }));
    toast.success("General configurations updated successfully");
  };

  return (
    <Card className={cn(glassCard, "animate-in fade-in slide-in-from-right-4 duration-500 space-y-5")}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">General Settings & Placement Status</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Modify global institution variables and control active student registration cycles.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">College / Institute Name</Label>
          <Input
            value={s.collegeName}
            onChange={(e) => setS({ ...s, collegeName: e.target.value })}
            className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Placement Session (Year)</Label>
            <Input
              value={s.academicYear}
              onChange={(e) => setS({ ...s, academicYear: e.target.value })}
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">TPO Contact Email Address</Label>
            <Input
              type="email"
              value={s.tpoEmail}
              onChange={(e) => setS({ ...s, tpoEmail: e.target.value })}
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/30 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 p-4 rounded-xl">
        <Switch
          checked={s.placementSeasonActive ?? true}
          onCheckedChange={(v) => setS({ ...s, placementSeasonActive: v })}
        />
        <div>
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Placement Registration Portal</Label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Enable or disable active profile editing, resume submissions, and campus recruitment applications for students.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50/50 dark:bg-slate-950/20 p-4 border border-slate-200/40 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {s.placementSeasonActive ?? true ? (
          <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
            ✓ Registration Cycle is ACTIVE. Students can modify profiles, submit resumes, and apply for active recruiting drives.
          </p>
        ) : (
          <p className="text-rose-700 dark:text-rose-400 font-semibold">
            ✗ Registration Cycle is CLOSED. Student profiles are locked in their current state; new applications and profile edits are disabled.
          </p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={save}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
        >
          Save Configurations
        </Button>
      </div>
    </Card>
  );
}
