import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronDown, Lock, Pencil, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { DEPARTMENTS } from "@/lib/dummy-data";
import type { Student } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { AvatarCircle } from "@/components/AvatarCircle";
import { TagInput } from "@/components/TagInput";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/profile")({ component: ProfilePage });

const emptyStudent = (name: string, email: string, id: string): Student => ({
  id, userId: id, name, email,
  prn: "", rollNumber: "", department: "", year: "Fourth", division: "A",
  cgpa: 0, backlogs: 0, activeBacklogs: false,
  tenth: { board: "", school: "", year: "", percentage: 0 },
  twelfth: { board: "", school: "", year: "", percentage: 0, stream: "Science", type: "12th" },
  gender: "Male", mobile: "", city: "", state: "", pin: "",
  category: "General", skills: [], languages: [],
  status: "draft", placementStatus: "Not Placed",
});

function ProfilePage() {
  const { user, state, setState } = useApp();
  const existing = state.students.find((s) => s.userId === user?.id || s.email.toLowerCase() === user?.email.toLowerCase());
  const [draft, setDraft] = useState<Student>(() => existing ?? emptyStudent(user?.name ?? "", user?.email ?? "", `s-${user?.id}`));
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [unlocked, setUnlocked] = useState<Record<number, boolean>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isLocked = draft.status === "verified" || draft.status === "pending";

  const sections = useMemo(() => ([
    { title: "Personal Info", done: !!(draft.mobile && draft.city && draft.state && draft.pin) },
    { title: "Academic Info (Current)", done: !!(draft.department && draft.rollNumber && draft.prn && draft.cgpa > 0) },
    { title: "12th Grade / Diploma", done: !!(draft.twelfth.board && draft.twelfth.school && draft.twelfth.percentage > 0) },
    { title: "10th Grade", done: !!(draft.tenth.board && draft.tenth.school && draft.tenth.percentage > 0) },
    { title: "Other Details", done: draft.skills.length > 0 },
  ]), [draft]);

  const completed = sections.filter((s) => s.done).length;
  const pct = Math.round((completed / sections.length) * 100);

  const update = <K extends keyof Student>(k: K, v: Student[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const updateTenth = (k: keyof Student["tenth"], v: any) => setDraft((d) => ({ ...d, tenth: { ...d.tenth, [k]: v } }));
  const updateTwelfth = (k: keyof Student["twelfth"], v: any) => setDraft((d) => ({ ...d, twelfth: { ...d.twelfth, [k]: v } }));

  const persist = (next: Student) => {
    setState((s) => {
      const exists = s.students.find((x) => x.id === next.id);
      return { ...s, students: exists ? s.students.map((x) => x.id === next.id ? next : x) : [...s.students, next] };
    });
  };

  const saveDraft = () => {
    persist({ ...draft, status: "draft" });
    toast.success("Draft saved");
  };

  const confirmSubmit = () => {
    const next = { ...draft, status: "pending" as const };
    setDraft(next);
    persist(next);
    setSubmitted(true);
    setConfirmOpen(false);
    setState((s) => ({
      ...s,
      pending: [
        { id: `pv-${Date.now()}`, kind: "new", studentId: next.id, studentName: next.name, prn: next.prn, department: next.department, submittedAt: new Date().toISOString() },
        ...s.pending.filter((p) => p.studentId !== next.id || p.kind !== "new"),
      ],
      notifications: [
        { id: `n-${Date.now()}`, title: "Profile submitted for verification", createdAt: new Date().toISOString(), read: false, type: "info" },
        ...s.notifications,
      ],
    }));
    toast.success("Profile submitted!");
  };

  if (submitted) {
    return (
      <div className="grid place-items-center py-20 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="size-12 text-emerald-600" /></div>
        <h2 className="mt-4 text-xl font-bold">Profile submitted!</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">You'll be notified once it's verified by the TPO.</p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>Back to profile</Button>
      </div>
    );
  }

  const sectionLocked = (idx: number) => isLocked && !unlocked[idx];

  return (
    <div className="space-y-4 pb-32">
      <Card className="rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <AvatarCircle name={draft.name} size={56} />
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-lg font-bold">{draft.name}</h1>
            <p className="truncate text-xs text-muted-foreground">{draft.email}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Completion</div>
            <div className="text-lg font-bold text-primary">{pct}%</div>
          </div>
        </div>
        <Progress value={pct} className="mt-4 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">{completed} of {sections.length} sections complete · Status: <span className="font-semibold capitalize text-foreground">{draft.status}</span></p>
      </Card>

      {sections.map((sec, idx) => {
        const open = openSection === idx;
        const locked = sectionLocked(idx);
        return (
          <Card key={sec.title} className="overflow-hidden rounded-2xl p-0">
            <button onClick={() => setOpenSection(open ? null : idx)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-secondary/50">
              <div className={cn("grid size-7 place-items-center rounded-full border", sec.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-card text-muted-foreground")}>
                {sec.done ? <Check className="size-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center gap-2">{sec.title}{locked && <Lock className="size-3.5 text-muted-foreground" />}</div>
                <div className="text-xs text-muted-foreground">{sec.done ? "Complete" : "Incomplete"}</div>
              </div>
              {isLocked && !unlocked[idx] && (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setUnlocked((u) => ({ ...u, [idx]: true })); setOpenSection(idx); }} className="gap-1.5"><Pencil className="size-3" />Edit</Button>
              )}
              <ChevronDown className={cn("size-4 text-muted-foreground transition", open && "rotate-180")} />
            </button>

            {open && (
              <div className={cn("space-y-3 border-t p-4", locked && "pointer-events-none opacity-60")}>
                {idx === 0 && (
                  <>
                    <Field label="Full Name"><Input value={draft.name} readOnly /></Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Date of Birth"><Input type="date" /></Field>
                      <Field label="Gender">
                        <RadioGroup value={draft.gender} onValueChange={(v) => update("gender", v as any)} className="flex gap-4 pt-2">
                          {["Male", "Female", "Other"].map((g) => (
                            <label key={g} className="flex items-center gap-1.5 text-sm"><RadioGroupItem value={g} />{g}</label>
                          ))}
                        </RadioGroup>
                      </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Mobile Number"><Input value={draft.mobile} onChange={(e) => update("mobile", e.target.value)} maxLength={10} /></Field>
                      <Field label="Alternate Mobile"><Input maxLength={10} /></Field>
                    </div>
                    <Field label="Permanent Address"><Textarea rows={2} /></Field>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="City"><Input value={draft.city} onChange={(e) => update("city", e.target.value)} /></Field>
                      <Field label="State"><Input value={draft.state} onChange={(e) => update("state", e.target.value)} /></Field>
                      <Field label="PIN Code"><Input value={draft.pin} onChange={(e) => update("pin", e.target.value)} maxLength={6} /></Field>
                    </div>
                  </>
                )}
                {idx === 1 && (
                  <>
                    <Field label="Department">
                      <Select value={draft.department} onValueChange={(v) => update("department", v)}>
                        <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Year"><Select value={draft.year} onValueChange={(v) => update("year", v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["First", "Second", "Third", "Fourth"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select></Field>
                      <Field label="Division"><Select value={draft.division} onValueChange={(v) => update("division", v as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["A", "B", "C"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select></Field>
                      <Field label="Roll Number"><Input value={draft.rollNumber} onChange={(e) => update("rollNumber", e.target.value)} /></Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="PRN Number"><Input value={draft.prn} onChange={(e) => update("prn", e.target.value)} /></Field>
                      <Field label="Current CGPA (0–10)"><Input type="number" min={0} max={10} step={0.01} value={draft.cgpa || ""} onChange={(e) => update("cgpa", Math.min(10, Math.max(0, +e.target.value)))} /></Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Backlog Count"><Input type="number" min={0} value={draft.backlogs} onChange={(e) => update("backlogs", +e.target.value)} /></Field>
                      <Field label="Active Backlogs?"><div className="flex items-center gap-2 pt-2"><Switch checked={draft.activeBacklogs} onCheckedChange={(v) => update("activeBacklogs", v)} /><span className="text-sm">{draft.activeBacklogs ? "Yes" : "No"}</span></div></Field>
                    </div>
                  </>
                )}
                {idx === 2 && (
                  <>
                    <Field label="Board Type">
                      <RadioGroup value={draft.twelfth.type} onValueChange={(v) => updateTwelfth("type", v)} className="flex gap-4 pt-2">
                        <label className="flex items-center gap-1.5 text-sm"><RadioGroupItem value="12th" />12th Standard</label>
                        <label className="flex items-center gap-1.5 text-sm"><RadioGroupItem value="Diploma" />Diploma</label>
                      </RadioGroup>
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Board Name"><Input value={draft.twelfth.board} onChange={(e) => updateTwelfth("board", e.target.value)} /></Field>
                      <Field label="School / College"><Input value={draft.twelfth.school} onChange={(e) => updateTwelfth("school", e.target.value)} /></Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Year of Passing"><Input value={draft.twelfth.year} onChange={(e) => updateTwelfth("year", e.target.value)} /></Field>
                      <Field label="Percentage (0–100)"><Input type="number" min={0} max={100} value={draft.twelfth.percentage || ""} onChange={(e) => updateTwelfth("percentage", Math.min(100, Math.max(0, +e.target.value)))} /></Field>
                    </div>
                    {draft.twelfth.type === "12th" && (
                      <Field label="Stream">
                        <Select value={draft.twelfth.stream} onValueChange={(v) => updateTwelfth("stream", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{["Science", "Commerce", "Arts"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </Field>
                    )}
                    <Field label="Certificate Upload"><Input type="file" accept="application/pdf,image/*" /></Field>
                  </>
                )}
                {idx === 3 && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Board Name"><Input value={draft.tenth.board} onChange={(e) => updateTenth("board", e.target.value)} /></Field>
                      <Field label="School"><Input value={draft.tenth.school} onChange={(e) => updateTenth("school", e.target.value)} /></Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Year of Passing"><Input value={draft.tenth.year} onChange={(e) => updateTenth("year", e.target.value)} /></Field>
                      <Field label="Percentage (0–100)"><Input type="number" min={0} max={100} value={draft.tenth.percentage || ""} onChange={(e) => updateTenth("percentage", Math.min(100, Math.max(0, +e.target.value)))} /></Field>
                    </div>
                    <Field label="Certificate Upload"><Input type="file" accept="application/pdf,image/*" /></Field>
                  </>
                )}
                {idx === 4 && (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="LinkedIn URL"><Input value={draft.linkedin ?? ""} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/…" /></Field>
                      <Field label="GitHub URL"><Input value={draft.github ?? ""} onChange={(e) => update("github", e.target.value)} placeholder="github.com/…" /></Field>
                    </div>
                    <Field label="Portfolio URL"><Input value={draft.portfolio ?? ""} onChange={(e) => update("portfolio", e.target.value)} /></Field>
                    <Field label="Skills"><TagInput value={draft.skills} onChange={(v) => update("skills", v)} placeholder="e.g. React, Node.js" /></Field>
                    <Field label="Languages"><TagInput value={draft.languages} onChange={(v) => update("languages", v)} placeholder="e.g. English, Marathi" /></Field>
                    <Field label="Category"><Select value={draft.category} onValueChange={(v) => update("category", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["General", "OBC", "SC", "ST", "NT", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></Field>
                  </>
                )}
              </div>
            )}
          </Card>
        );
      })}

      <div className="fixed inset-x-0 bottom-16 z-20 border-t bg-card/95 p-3 backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Button variant="outline" className="flex-1" onClick={saveDraft}>Save Draft</Button>
          <Button className="flex-1" onClick={() => setConfirmOpen(true)} disabled={isLocked && !Object.values(unlocked).some(Boolean)}>
            {isLocked && Object.values(unlocked).some(Boolean) ? "Submit Update Request" : "Submit for Verification"}
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit for verification?</DialogTitle>
            <DialogDescription>
              Once submitted, your profile will be reviewed by the TPO. You cannot edit until reviewed. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmSubmit}>Submit</Button>
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
