"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Search,
  Filter,
  Trash2,
  Pencil,
  Download,
  IndianRupee,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Award,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Company } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const ALL = "__all__";

export const SECTORS = [
  "Information Technology / Software",
  "Electrical & Electronics",
  "Mechanical & Manufacturing",
  "Civil & Infrastructure",
  "Aerospace & Automotive",
  "Finance & Consulting",
] as const;

const glassCard =
  "rounded-2xl border border-white/40 bg-white/50 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl ring-1 ring-white/50 dark:border-white/10 dark:bg-slate-900/50 dark:ring-white/10 transition-all duration-300";

export function TpoCompaniesPage() {
  const { state, setState } = useApp();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Company | null>(null);
  const [editing, setEditing] = useState<Company | null>(null);
  const [toDelete, setToDelete] = useState<Company | null>(null);

  const [q, setQ] = useState("");
  const [sectorFilter, setSectorFilter] = useState(ALL);
  const [ctcRange, setCtcRange] = useState<[number, number]>([0, 30]);
  const [showFilters, setShowFilters] = useState(false);

  // Stats Counters
  const techCount = state.companies.filter((x) => {
    const ind = x.industry.toLowerCase();
    return ind.includes("tech") || ind.includes("it ") || ind.includes("services") || ind.includes("software");
  }).length;
  const coreCount = state.companies.length - techCount;
  const dreamCount = state.companies.filter((x) => x.ctcMax && x.ctcMax >= (state.settings.dreamPackageLpa ?? 8.0)).length;

  const reset = () => {
    setQ("");
    setSectorFilter(ALL);
    setCtcRange([0, 30]);
  };

  const list = useMemo(() => {
    return state.companies.filter((c) => {
      if (q && !`${c.name} ${c.industry} ${c.location || ""} ${c.hrName || ""}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (sectorFilter !== ALL) {
        if (c.industry !== sectorFilter) return false;
      }
      
      const minCTC = c.ctcMin ?? 0;
      const maxCTC = c.ctcMax ?? 0;
      if (maxCTC < ctcRange[0] || minCTC > ctcRange[1]) return false;

      return true;
    });
  }, [state.companies, q, sectorFilter, ctcRange]);

  const hasActiveFilters = q !== "" || sectorFilter !== ALL || ctcRange[0] > 0 || ctcRange[1] < 30;

  const exportCsv = (rows: Company[]) => {
    const cols = ["name", "industry", "website", "location", "ctcMin", "ctcMax", "hrName", "hrEmail", "hrPhone", "addedOn"] as const;
    const lines = [cols.join(",")];
    rows.forEach((c) =>
      lines.push(
        [
          c.name,
          c.industry,
          c.website ?? "",
          c.location ?? "",
          c.ctcMin ?? "",
          c.ctcMax ?? "",
          c.hrName ?? "",
          c.hrEmail ?? "",
          c.hrPhone ?? "",
          c.addedOn,
        ].join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recruiting_partners.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} recruiting partners`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Recruiting Partners
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage company relationships, structural domains, and campus recruitment logs.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-md shadow-emerald-600/10 self-start sm:self-center"
        >
          <Plus className="size-4" />
          Add Recruiting Partner
        </Button>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Partners
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {state.companies.length}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Registered recruiters
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl">
            <Building2 className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tech/IT Sector
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {techCount}
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
              Software & IT services
            </p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-xl">
            <ShieldCheck className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Core Engineering
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {coreCount}
            </p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
              Mech, Elec, Civil, Aero
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-xl">
            <TrendingUp className="size-5" />
          </div>
        </div>

        <div className={cn(glassCard, "p-4 flex items-center justify-between")}>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dream Partners
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {dreamCount}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              Offering packages ≥ ₹{state.settings.dreamPackageLpa ?? 8.0} LPA
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 rounded-xl">
            <Award className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter Suite Card */}
      <Card className={cn(glassCard, "p-4")}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by company name, sector, HQ..."
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

          {/* Advanced Collapsible Filters */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="h-9 min-w-[150px] rounded-lg border border-slate-200 bg-white/50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              >
                <option value={ALL}>All Sectors</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-1 px-3 py-1 bg-white/30 dark:bg-slate-900/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 min-w-[200px] sm:min-w-[240px]">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>CTC Package Offer</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[10.5px]">
                    ₹{ctcRange[0]}-{ctcRange[1]} LPA
                  </span>
                </div>
                <div className="py-1.5">
                  <Slider
                    min={0}
                    max={30}
                    step={1}
                    value={ctcRange}
                    onValueChange={(val) => setCtcRange(val as [number, number])}
                    className="cursor-pointer"
                  />
                </div>
              </div>

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
        </div>
      </Card>

      {/* Grid List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const placedStudents = state.students.filter(
            (s) => s.placedCompany === c.name && s.year === "Fourth" && s.placementStatus === "Placed"
          );

          return (
            <Card
              key={c.id}
              className={cn(
                glassCard,
                "group relative flex flex-col justify-between overflow-hidden p-6 hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 cursor-pointer"
              )}
              onClick={() => setView(c)}
            >
              {/* Inner Content */}
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:from-emerald-950/40 dark:to-teal-950/40 dark:text-emerald-400 shrink-0 border border-emerald-500/10">
                      <Building2 className="size-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {c.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/50 text-[10px] font-semibold py-0.5 px-2 mt-1 rounded-full"
                      >
                        {c.industry}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/30 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(c);
                        setOpen(true);
                      }}
                      title="Edit Recruiting Partner"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setToDelete(c);
                      }}
                      title="Remove Recruiting Partner"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                {c.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                    {c.description}
                  </p>
                )}

                {/* Key Metrics details */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="size-3.5 text-emerald-500/70" /> Placements (4th Yr)
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {placedStudents.length} Student{placedStudents.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="size-3.5 text-emerald-500/70" /> CTC Package
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {c.ctcMin != null ? `₹${c.ctcMin} - ₹${c.ctcMax} LPA` : "—"}
                    </span>
                  </div>

                  {c.location && (
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-emerald-500/70" /> HQ Location
                      </span>
                      <span className="font-medium truncate max-w-[60%]" title={c.location}>
                        {c.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bottom Row */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span className="font-medium">Added {new Date(c.addedOn).toLocaleDateString()}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setView(c);
                  }}
                >
                  View Details <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
        {list.length === 0 && (
          <Card className={cn(glassCard, "col-span-full border-dashed p-12 text-center text-sm text-slate-400 dark:text-slate-500")}>
            No recruiting partners found matching your selection filters.
          </Card>
        )}
      </div>

      {/* Add / Edit Company Dialog */}
      <AddCompanyForm
        open={open}
        onOpenChange={setOpen}
        company={editing}
        onSave={(c) => {
          setState((s) =>
            editing
              ? {
                  ...s,
                  companies: s.companies.map((x) => (x.id === editing.id ? c : x)),
                }
              : {
                  ...s,
                  companies: [
                    { ...c, id: `c-${Date.now()}`, addedOn: new Date().toISOString().slice(0, 10) },
                    ...s.companies,
                  ],
                }
          );
          toast.success(editing ? "Company details updated successfully" : "Company registered successfully");
          setOpen(false);
        }}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="max-w-md sm:rounded-2xl border-rose-500/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 ring-1 ring-black/5">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50">
              Remove Recruiting Partner?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {toDelete?.name}
              </span>
              ? This will wipe their listings and associated records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-850">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 shadow-lg shadow-rose-600/10 border-0"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  companies: s.companies.filter((x) => x.id !== toDelete!.id),
                }));
                toast.success("Recruiting partner successfully removed");
                setToDelete(null);
              }}
            >
              Remove Partner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Sheet Drawer */}
      <CompanyDetail company={view} onClose={() => setView(null)} />
    </div>
  );
}

function AddCompanyForm({
  open,
  onOpenChange,
  company,
  onSave,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  company: Company | null;
  onSave: (c: Company) => void;
}) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [hrName, setHrName] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [hrPhone, setHrPhone] = useState("");
  const [ctcMin, setCtcMin] = useState<number | undefined>(undefined);
  const [ctcMax, setCtcMax] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (open) {
      setName(company?.name ?? "");
      setIndustry(company?.industry ?? "");
      setWebsite(company?.website ?? "");
      setLocation(company?.location ?? "");
      setDescription(company?.description ?? "");
      setHrName(company?.hrName ?? "");
      setHrEmail(company?.hrEmail ?? "");
      setHrPhone(company?.hrPhone ?? "");
      setCtcMin(company?.ctcMin ?? undefined);
      setCtcMax(company?.ctcMax ?? undefined);
    }
  }, [company, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto sm:rounded-2xl border-emerald-500/20 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 ring-1 ring-black/5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {company ? "Edit recruiting partner" : "Register recruiting partner"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Company Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Google India"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Industry Sector
              </Label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-xs text-slate-700 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              >
                <option value="">Select Industry Sector</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Website
              </Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. google.co.in"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                HQ Location
              </Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Brief Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief overview of the company's business model..."
              rows={3}
              className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                HR Name
              </Label>
              <Input
                value={hrName}
                onChange={(e) => setHrName(e.target.value)}
                placeholder="HR Manager"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                HR Email
              </Label>
              <Input
                type="email"
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
                placeholder="hr@google.com"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                HR Phone
              </Label>
              <Input
                value={hrPhone}
                onChange={(e) => setHrPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Min CTC Offer (LPA)
              </Label>
              <Input
                type="number"
                value={ctcMin ?? ""}
                onChange={(e) => setCtcMin(e.target.value ? +e.target.value : undefined)}
                placeholder="e.g. 6"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Max CTC Offer (LPA)
              </Label>
              <Input
                type="number"
                value={ctcMax ?? ""}
                onChange={(e) => setCtcMax(e.target.value ? +e.target.value : undefined)}
                placeholder="e.g. 12"
                className="bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
              />
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
                id: company?.id ?? "",
                name,
                industry,
                website,
                location,
                description,
                hrName,
                hrEmail,
                hrPhone,
                ctcMin,
                ctcMax,
                addedOn: company?.addedOn ?? new Date().toISOString().slice(0, 10),
              })
            }
            disabled={!name || !industry}
            className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            {company ? "Save Changes" : "Register Partner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompanyDetail({ company, onClose }: { company: Company | null; onClose: () => void }) {
  const { state } = useApp();
  if (!company) return null;

  // Placement metrics applicable strictly to fourth year students
  const placed = state.students.filter(
    (s) => s.placedCompany === company.name && s.year === "Fourth" && s.placementStatus === "Placed"
  );

  return (
    <Sheet open={!!company} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg border-l border-slate-100 dark:border-white/10 p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:from-emerald-950/40 dark:to-teal-950/40 dark:text-emerald-400 shrink-0 border border-emerald-500/10 shadow-sm">
              <Building2 className="size-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{company.name}</h2>
              <Badge
                variant="secondary"
                className="mt-1 font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {company.industry}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {company.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Company Description
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/30 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                {company.description}
              </p>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {company.ctcMin != null && (
              <Card className="p-3.5 bg-emerald-50/20 border-emerald-500/10 dark:bg-emerald-950/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Offered package range
                </span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{company.ctcMin} - ₹{company.ctcMax} LPA
                </p>
              </Card>
            )}
            {company.location && (
              <Card className="p-3.5 bg-slate-50/40 border-slate-200/40 dark:bg-slate-950/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  HQ location
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                  {company.location}
                </p>
              </Card>
            )}
          </div>

          {/* Communication Links */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Contact & Links
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-white/5 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50/10">
              {company.website && (
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Globe className="size-4 text-emerald-500" /> Web Directory
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                    {company.website} <ChevronRight className="size-3.5" />
                  </span>
                </a>
              )}

              {company.hrName && (
                <div className="flex items-center justify-between p-3.5 text-sm text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Building2 className="size-4 text-indigo-500" /> HR Coordinator
                  </span>
                  <span className="font-semibold">{company.hrName}</span>
                </div>
              )}

              {company.hrEmail && (
                <a
                  href={`mailto:${company.hrEmail}`}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="size-4 text-blue-500" /> HR Contact Email
                  </span>
                  <span className="font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {company.hrEmail}
                  </span>
                </a>
              )}

              {company.hrPhone && (
                <a
                  href={`tel:${company.hrPhone}`}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone className="size-4 text-teal-500" /> HR Contact Phone
                  </span>
                  <span className="font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {company.hrPhone}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Placed Students list strictly fourth year graduating batch */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Graduating Recruits ({placed.length})
            </h3>
            {placed.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500">
                <AlertCircle className="size-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span className="text-xs font-medium">No 4th-year placements recorded yet.</span>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5 bg-white/30 dark:bg-slate-900/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-slate-50/60 dark:bg-slate-800/30 uppercase text-slate-500 border-b border-slate-100 dark:border-white/5 font-semibold">
                      <tr>
                        <th className="p-3">Recruit Name</th>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-right">Package</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {placed.map((s) => (
                        <tr
                          key={s.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                        >
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{s.name}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">{s.department}</td>
                          <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{s.packageLpa} LPA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
