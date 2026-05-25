"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
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

const ALL = "__all__";

export function TpoFacultyPage() {
  const { state, setState, user } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (user && !["tpo-admin", "tpo-co-admin"].includes(user.role))
      router.replace(routes.tpo.dashboard);
  }, [router, user]);
  const [q, setQ] = useState("");
  const [dep, setDep] = useState(ALL);
  const [editing, setEditing] = useState<TPOFaculty | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<TPOFaculty | null>(null);
  const list = useMemo(
    () =>
      state.faculty.filter(
        (f) =>
          (!q || `${f.name} ${f.email}`.toLowerCase().includes(q.toLowerCase())) &&
          (dep === ALL || f.department === dep),
      ),
    [state.faculty, q, dep],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty</h1>
          <p className="text-sm text-muted-foreground">
            TPO faculty & moderators across departments.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus className="size-4" />
          Add Faculty
        </Button>
      </div>
      <Card className="rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search faculty..."
              className="pl-9"
            />
          </div>
          <Select value={dep} onValueChange={setDep}>
            <SelectTrigger className="h-10 w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Departments</SelectItem>
              {["All", ...DEPARTMENTS].map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="p-2">Name</th>
                <th className="p-2">Department</th>
                <th className="p-2">Role</th>
                <th className="hidden p-2 md:table-cell">Email</th>
                <th className="hidden p-2 md:table-cell">Phone</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="p-2 font-medium">{f.name}</td>
                  <td className="p-2">{f.department}</td>
                  <td className="p-2 capitalize">{f.role.replace("-", " ")}</td>
                  <td className="hidden p-2 md:table-cell">{f.email}</td>
                  <td className="hidden p-2 md:table-cell">{f.phone}</td>
                  <td className="p-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(f);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setToDelete(f)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <FacultyForm
        open={open}
        onOpenChange={setOpen}
        faculty={editing}
        onSave={(f) => {
          setState((s) =>
            editing
              ? { ...s, faculty: s.faculty.map((x) => (x.id === editing.id ? f : x)) }
              : { ...s, faculty: [...s.faculty, { ...f, id: `f-${Date.now()}` }] },
          );
          toast.success(editing ? "Faculty updated" : "Faculty added");
          setOpen(false);
        }}
      />
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove faculty?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  faculty: s.faculty.filter((x) => x.id !== toDelete!.id),
                }));
                toast.success("Removed");
                setToDelete(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
  const [name, setName] = useState(faculty?.name ?? "");
  const [email, setEmail] = useState(faculty?.email ?? "");
  const [phone, setPhone] = useState(faculty?.phone ?? "");
  const [department, setDepartment] = useState(faculty?.department ?? "All");
  const [role, setRole] = useState<Exclude<Role, "student">>(faculty?.role ?? "tpo-department");
  useEffect(() => {
    setName(faculty?.name ?? "");
    setEmail(faculty?.email ?? "");
    setPhone(faculty?.phone ?? "");
    setDepartment(faculty?.department ?? "All");
    setRole(faculty?.role ?? "tpo-department");
  }, [faculty, open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faculty ? "Edit faculty" : "Add faculty"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["All", ...DEPARTMENTS].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Exclude<Role, "student">)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tpo-co-admin">TPO Co-Admin</SelectItem>
                <SelectItem value="tpo-department">Dept. TPO</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave({ id: faculty?.id ?? "", name, email, phone, department, role })}
            disabled={!name || !email}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
