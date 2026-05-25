"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Download, Check, X } from "lucide-react";
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

export function TpoStudentsPage() {
  const { state, setState, user } = useApp();
  const isDept = user?.role === "tpo-department";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">
          Manage student profiles, eligibility & placement status.
        </p>
      </div>

      <Tabs defaultValue="master">
        <TabsList>
          <TabsTrigger value="master">Master List</TabsTrigger>
          <TabsTrigger value="pending">
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
  const [yr, setYr] = useState<string>(ALL);
  const [div, setDiv] = useState<string>(ALL);
  const [gen, setGen] = useState<string>(ALL);
  const [pl, setPl] = useState<string>(ALL);
  const [selected, setSelected] = useState<string[]>([]);
  const [openStudent, setOpenStudent] = useState<Student | null>(null);
  const [updateOpen, setUpdateOpen] = useState<Student | null>(null);

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
      if (q && !`${s.name} ${s.prn} ${s.rollNumber}`.toLowerCase().includes(q.toLowerCase()))
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
      "prn",
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
          s.prn,
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

  const markPlacedBulk = () => {
    setState((s) => ({
      ...s,
      students: s.students.map((x) =>
        selected.includes(x.id) ? { ...x, placementStatus: "Placed" } : x,
      ),
    }));
    toast.success(`${selected.length} marked as placed`);
    setSelected([]);
  };

  return (
    <Card className="rounded-2xl p-4">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, PRN, roll number…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          <button onClick={reset} className="text-xs font-medium text-primary hover:underline">
            Reset filters
          </button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={() => exportCsv(list)}
          >
            <Download className="size-4" />
            Export to Excel
          </Button>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
            <span className="text-sm font-medium">{selected.length} selected</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportCsv(list.filter((s) => selected.includes(s.id)))}
              >
                Export Selected
              </Button>
              <Button size="sm" onClick={markPlacedBulk}>
                Mark as Placed
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="p-2">
                  <Checkbox
                    checked={list.length > 0 && selected.length === list.length}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="p-2">Name + PRN</th>
                <th className="hidden p-2 md:table-cell">Department</th>
                <th className="hidden p-2 md:table-cell">Year</th>
                <th className="p-2">CGPA</th>
                <th className="hidden p-2 lg:table-cell">10th%</th>
                <th className="hidden p-2 lg:table-cell">12th%</th>
                <th className="p-2">Eligible</th>
                <th className="p-2">Placed</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                    No students match your filters.
                  </td>
                </tr>
              )}
              {list.map((s) => {
                const elig = isEligible(s, state.settings.eligibility);
                return (
                  <tr key={s.id} className="border-b hover:bg-secondary/40">
                    <td className="p-2">
                      <Checkbox
                        checked={selected.includes(s.id)}
                        onCheckedChange={() =>
                          setSelected((sel) =>
                            sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id],
                          )
                        }
                      />
                    </td>
                    <td className="cursor-pointer p-2" onClick={() => setOpenStudent(s)}>
                      <div className="flex items-center gap-2">
                        <AvatarCircle name={s.name} size={32} />
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.prn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-2 md:table-cell">{s.department}</td>
                    <td className="hidden p-2 md:table-cell">{s.year}</td>
                    <td className="p-2 font-medium">{s.cgpa.toFixed(2)}</td>
                    <td className="hidden p-2 lg:table-cell">{s.tenth.percentage}%</td>
                    <td className="hidden p-2 lg:table-cell">{s.twelfth.percentage}%</td>
                    <td className="p-2">
                      <Badge
                        className={
                          elig
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                        }
                      >
                        {elig ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={s.placementStatus === "Placed" ? "default" : "secondary"}
                        className={cn(s.placementStatus === "Placed" && "bg-primary")}
                      >
                        {s.placementStatus}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setOpenStudent(s)}>
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setUpdateOpen(s)}>
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setState((st) => ({
                                ...st,
                                students: st.students.map((x) =>
                                  x.id === s.id ? { ...x, blacklisted: !x.blacklisted } : x,
                                ),
                              }));
                              toast.success(s.blacklisted ? "Unblacklisted" : "Blacklisted");
                            }}
                          >
                            {s.blacklisted ? "Unblacklist" : "Blacklist"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StudentDrawer
        student={openStudent}
        onClose={() => setOpenStudent(null)}
        onUpdateStatus={(s) => {
          setOpenStudent(null);
          setUpdateOpen(s);
        }}
      />
      <UpdateStatusDialog student={updateOpen} onClose={() => setUpdateOpen(null)} />
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
      <SelectTrigger className="h-9 w-auto min-w-32">
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

function StudentDrawer({
  student,
  onClose,
  onUpdateStatus,
}: {
  student: Student | null;
  onClose: () => void;
  onUpdateStatus: (s: Student) => void;
}) {
  return (
    <Sheet open={!!student} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {student && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <AvatarCircle name={student.name} size={48} />
                <div>
                  <div className="text-base font-semibold">{student.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {student.prn} · {student.department}
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-24">
              <DTabs defaultValue="personal" className="mt-4">
                <DTabsList className="grid w-full grid-cols-4">
                  <DTabsTrigger value="personal">Personal</DTabsTrigger>
                  <DTabsTrigger value="academic">Academic</DTabsTrigger>
                  <DTabsTrigger value="education">Education</DTabsTrigger>
                  <DTabsTrigger value="docs">Documents</DTabsTrigger>
                </DTabsList>
                <DTabsContent value="personal" className="space-y-2 pt-3 text-sm">
                  <Row k="Email" v={student.email} />
                  <Row k="Mobile" v={student.mobile} />
                  <Row k="Gender" v={student.gender} />
                  <Row k="City" v={`${student.city}, ${student.state} - ${student.pin}`} />
                  <Row k="Category" v={student.category} />
                </DTabsContent>
                <DTabsContent value="academic" className="space-y-2 pt-3 text-sm">
                  <Row k="Department" v={student.department} />
                  <Row k="Year / Division" v={`${student.year} · ${student.division}`} />
                  <Row k="Roll Number" v={student.rollNumber} />
                  <Row k="CGPA" v={student.cgpa.toFixed(2)} />
                  <Row
                    k="Backlogs"
                    v={`${student.backlogs}${student.activeBacklogs ? " (active)" : ""}`}
                  />
                  <Row
                    k="Placement"
                    v={`${student.placementStatus}${student.placedCompany ? ` @ ${student.placedCompany}` : ""}`}
                  />
                </DTabsContent>
                <DTabsContent value="education" className="space-y-3 pt-3 text-sm">
                  <Card className="p-3">
                    <div className="text-xs font-semibold text-muted-foreground">10th</div>
                    <Row k="Board" v={student.tenth.board} />
                    <Row k="School" v={student.tenth.school} />
                    <Row k="Year" v={student.tenth.year} />
                    <Row k="Percentage" v={`${student.tenth.percentage}%`} />
                  </Card>
                  <Card className="p-3">
                    <div className="text-xs font-semibold text-muted-foreground">
                      {student.twelfth.type}
                    </div>
                    <Row k="Board" v={student.twelfth.board} />
                    <Row k="Institute" v={student.twelfth.school} />
                    <Row k="Year" v={student.twelfth.year} />
                    <Row k="Percentage" v={`${student.twelfth.percentage}%`} />
                    <Row k="Stream" v={student.twelfth.stream} />
                  </Card>
                </DTabsContent>
                <DTabsContent value="docs" className="pt-3 text-sm">
                  <p className="text-muted-foreground">No documents uploaded.</p>
                </DTabsContent>
              </DTabs>
            </div>
            <div className="fixed inset-x-0 bottom-0 flex gap-2 border-t bg-card p-3 sm:max-w-lg">
              <Button className="flex-1" onClick={() => onUpdateStatus(student)}>
                Update Status
              </Button>
              <Button variant="destructive" className="flex-1">
                Blacklist
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b py-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v || "—"}</span>
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
    <Card className="rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <Tabs value={subTab} onValueChange={(v) => setSubTab(v as "new" | "update")}>
          <TabsList>
            <TabsTrigger value="new">New Profiles</TabsTrigger>
            <TabsTrigger value="update">Update Requests</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={sort} onValueChange={(v) => setSort(v as "new" | "old" | "dept")}>
          <SelectTrigger className="h-9 w-40">
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
          <Card key={p.id} className="rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <AvatarCircle name={p.studentName} />
                <div>
                  <div className="font-semibold">{p.studentName}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.prn} · {p.department}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Submitted {new Date(p.submittedAt).toLocaleString()}
              </div>
            </div>
            {p.kind === "update" && p.changes && (
              <div className="mt-3 overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left">Field</th>
                      <th className="p-2 text-left">Previous</th>
                      <th className="p-2 text-left">New</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.changes.map((c) => (
                      <tr key={c.field} className="border-t">
                        <td className="p-2 font-medium">{c.field}</td>
                        <td className="bg-rose-50 p-2 text-rose-700">{c.before}</td>
                        <td className="bg-emerald-50 p-2 text-emerald-700">{c.after}</td>
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
