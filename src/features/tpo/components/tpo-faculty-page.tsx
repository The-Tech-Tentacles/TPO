"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Shield,
  Building,
  UserCheck,
  Users,
  Mail,
  Phone,
  UserPlus,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarCircle } from "@/components/AvatarCircle";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/dummy-data";
import { useApp } from "@/lib/store";
import type { Role, TPOFaculty } from "@/lib/types";
import { routes } from "@/shared/config/routes";
import { cn } from "@/lib/utils";

const ALL = "__all__";

const glassCard =
  "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all";

export function TpoFacultyPage() {
  const { state, setState, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user && !["tpo-admin", "tpo-co-admin"].includes(user.role))
      router.replace(routes.tpo.dashboard);
  }, [router, user]);

  const [q, setQ] = useState("");
  const [dep, setDep] = useState(ALL);
  const [roleFilter, setRoleFilter] = useState(ALL);
  const [editing, setEditing] = useState<TPOFaculty | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<TPOFaculty | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(
    () =>
      state.faculty.filter(
        (f) =>
          (!q ||
            `${f.name} ${f.email} ${f.phone}`
              .toLowerCase()
              .includes(q.toLowerCase())) &&
          (dep === ALL || f.department === dep) &&
          (roleFilter === ALL || f.role === roleFilter),
      ),
    [state.faculty, q, dep, roleFilter],
  );

  const hasActiveFilters = q !== "" || dep !== ALL || roleFilter !== ALL;

  const reset = () => {
    setQ("");
    setDep(ALL);
    setRoleFilter(ALL);
  };

  const exportCsv = (rows: TPOFaculty[]) => {
    const cols = ["name", "email", "phone", "department", "role"] as const;
    const lines = [cols.join(",")];
    rows.forEach((f) =>
      lines.push(
        [f.name, f.email, f.phone, f.department, f.role].join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faculty_directory.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} faculty members`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Faculty Directory
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage departmental TPO coordinators, administrators, and portal moderators.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md shadow-emerald-600/10 self-start sm:self-center"
        >
          <UserPlus className="size-4" />
          Add Faculty Member
        </Button>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Faculty
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {state.faculty.length}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Across all departments
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl">
            <Users className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Co-Admins
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {state.faculty.filter((f) => f.role === "tpo-co-admin").length}
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
              Full portal privileges
            </p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-xl">
            <Shield className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dept. TPOs
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {state.faculty.filter((f) => f.role === "tpo-department").length}
            </p>
            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
              Departmental coordinators
            </p>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 rounded-xl">
            <Building className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Moderators
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {state.faculty.filter((f) => f.role === "moderator").length}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              Standard moderators
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-xl">
            <UserCheck className="size-5" />
          </div>
        </div>
      </div>

      {/* Main Filter & List Card */}
      <Card className={cn(glassCard, "p-4")}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                className={cn(
                  "gap-2 border-slate-200/60 dark:border-slate-700/50",
                  !showFilters &&
                  "bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="size-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              <Button
                variant="outline"
                className="gap-1.5 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                onClick={() => exportCsv(list)}
              >
                <Download className="size-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>

          {/* Collapsible Advanced Filters */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <FilterSelect
                value={dep}
                onValueChange={setDep}
                placeholder="Department"
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              />
              <FilterSelect
                value={roleFilter}
                onValueChange={setRoleFilter}
                placeholder="Role"
                options={[
                  { value: "tpo-co-admin", label: "TPO Co-Admin" },
                  { value: "tpo-department", label: "Dept. TPO" },
                  { value: "moderator", label: "Moderator" },
                ]}
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

          {/* Table Directory */}
          <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6 mt-2">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 uppercase border-y border-slate-100 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name & Contact</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">System Role</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Email</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Phone</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {list.map((f) => (
                  <tr
                    key={f.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarCircle
                          name={f.name}
                          size={36}
                          className="ring-2 ring-emerald-500/10 shadow-sm"
                        />
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {f.name}
                          </div>
                          <div className="text-xs text-slate-400 md:hidden flex flex-col gap-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="size-3" /> {f.email}
                            </span>
                            {f.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="size-3" /> {f.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/50 font-medium"
                      >
                        {f.department === "All" ? "All Departments" : f.department}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {f.role === "tpo-co-admin" && (
                        <Badge className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-300 font-medium gap-1">
                          <Shield className="size-3.5" />
                          Co-Admin
                        </Badge>
                      )}
                      {f.role === "tpo-department" && (
                        <Badge className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-900/40 dark:text-emerald-300 font-medium gap-1">
                          <Building className="size-3.5" />
                          Dept. TPO
                        </Badge>
                      )}
                      {f.role === "moderator" && (
                        <Badge className="bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900/40 dark:text-amber-300 font-medium gap-1">
                          <UserCheck className="size-3.5" />
                          Moderator
                        </Badge>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell text-slate-600 dark:text-slate-400 font-medium">
                      {f.email}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell text-slate-600 dark:text-slate-400 font-medium">
                      {f.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                          onClick={() => {
                            setEditing(f);
                            setOpen(true);
                          }}
                          title="Edit Faculty Member"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                          onClick={() => setToDelete(f)}
                          title="Remove Faculty Member"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                    >
                      No faculty members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Faculty Add/Edit Form */}
      <FacultyForm
        open={open}
        onOpenChange={setOpen}
        faculty={editing}
        onSave={(f) => {
          setState((s) =>
            editing
              ? {
                ...s,
                faculty: s.faculty.map((x) => (x.id === editing.id ? f : x)),
              }
              : {
                ...s,
                faculty: [
                  ...s.faculty,
                  { ...f, id: `f-${Date.now()}` },
                ],
              },
          );
          toast.success(
            editing
              ? "Faculty member updated successfully"
              : "Faculty member added successfully",
          );
          setOpen(false);
        }}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="max-w-md sm:rounded-2xl border-rose-500/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50">
              Remove Faculty Member?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {toDelete?.name}
              </span>
              ? This will revoke their access to the TPO admin portal immediately. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-850">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 shadow-lg shadow-rose-600/10"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  faculty: s.faculty.filter((x) => x.id !== toDelete!.id),
                }));
                toast.success("Faculty member successfully removed");
                setToDelete(null);
              }}
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-auto min-w-36 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/50">
        <SelectItem value={ALL}>All {placeholder}s</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FacultyForm({
  open,
  onOpenChange,
  faculty,
  onSave,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  faculty: TPOFaculty | null;
  onSave: (f: TPOFaculty) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("All");
  const [role, setRole] = useState<Exclude<Role, "student">>("tpo-department");

  useEffect(() => {
    if (open) {
      setName(faculty?.name ?? "");
      setEmail(faculty?.email ?? "");
      setPhone(faculty?.phone ?? "");
      setDepartment(faculty?.department ?? "All");
      setRole(faculty?.role ?? "tpo-department");
    }
  }, [faculty, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-2xl border-emerald-500/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 ring-1 ring-black/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {faculty ? "Edit Faculty Member" : "Add Faculty Member"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Full Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Patil"
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-emerald-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Email Address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh.patil@adcet.in"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Phone Number
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Department
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/50">
                  {["All", ...DEPARTMENTS].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d === "All" ? "All Departments" : d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Portal Role
              </Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as Exclude<Role, "student">)}
              >
                <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/50">
                  <SelectItem value="tpo-co-admin">TPO Co-Admin</SelectItem>
                  <SelectItem value="tpo-department">Dept. TPO</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                id: faculty?.id ?? "",
                name,
                email,
                phone,
                department,
                role,
              })
            }
            disabled={!name || !email}
            className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            {faculty ? "Save Changes" : "Add Faculty"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
