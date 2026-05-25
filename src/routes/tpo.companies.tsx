import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Building2, Globe, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Company } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/tpo/companies")({ component: CompaniesPage });

function CompaniesPage() {
  const { state, setState } = useApp();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Company | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">Registered recruiters and partners.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-1.5"><Plus className="size-4" />Add Company</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {state.companies.map((c) => (
          <Card key={c.id} className="cursor-pointer rounded-2xl p-5 transition hover:shadow-md" onClick={() => setView(c)}>
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary/15 to-accent/15 text-primary"><Building2 className="size-6" /></div>
              <div className="flex-1 min-w-0">
                <div className="truncate font-semibold">{c.name}</div>
                <Badge variant="secondary" className="mt-0.5">{c.industry}</Badge>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Added {new Date(c.addedOn).toLocaleDateString()}</span>
              <Button size="sm" variant="ghost">View</Button>
            </div>
          </Card>
        ))}
        {state.companies.length === 0 && <Card className="col-span-full rounded-2xl border-dashed p-10 text-center text-sm text-muted-foreground">No companies yet.</Card>}
      </div>

      <AddCompany open={open} onOpenChange={setOpen} onAdd={(c) => { setState((s) => ({ ...s, companies: [{ ...c, id: `c-${Date.now()}`, addedOn: new Date().toISOString().slice(0, 10) }, ...s.companies] })); toast.success("Company added"); setOpen(false); }} />
      <CompanyDetail company={view} onClose={() => setView(null)} />
    </div>
  );
}

function AddCompany({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (b: boolean) => void; onAdd: (c: Company) => void }) {
  const [c, setC] = useState<Partial<Company>>({});
  const update = (k: keyof Company, v: any) => setC((p) => ({ ...p, [k]: v }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>Add company</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label className="text-xs">Name</Label><Input onChange={(e) => update("name", e.target.value)} /></div>
            <div><Label className="text-xs">Industry / Sector</Label><Input onChange={(e) => update("industry", e.target.value)} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label className="text-xs">Website</Label><Input onChange={(e) => update("website", e.target.value)} placeholder="example.com" /></div>
            <div><Label className="text-xs">Location / HQ</Label><Input onChange={(e) => update("location", e.target.value)} /></div>
          </div>
          <div><Label className="text-xs">Description</Label><Textarea rows={3} onChange={(e) => update("description", e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><Label className="text-xs">HR Name</Label><Input onChange={(e) => update("hrName", e.target.value)} /></div>
            <div><Label className="text-xs">HR Email</Label><Input type="email" onChange={(e) => update("hrEmail", e.target.value)} /></div>
            <div><Label className="text-xs">HR Phone</Label><Input onChange={(e) => update("hrPhone", e.target.value)} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label className="text-xs">Min CTC (LPA)</Label><Input type="number" onChange={(e) => update("ctcMin", +e.target.value)} /></div>
            <div><Label className="text-xs">Max CTC (LPA)</Label><Input type="number" onChange={(e) => update("ctcMax", +e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onAdd(c as Company)} disabled={!c.name || !c.industry}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompanyDetail({ company, onClose }: { company: Company | null; onClose: () => void }) {
  const { state } = useApp();
  if (!company) return null;
  const placed = state.students.filter((s) => s.placedCompany === company.name);
  return (
    <Sheet open={!!company} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><Building2 className="size-6" /></div>
            <div><div>{company.name}</div><Badge variant="secondary" className="mt-0.5 font-normal">{company.industry}</Badge></div>
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 p-4">
          {company.description && <p className="text-sm text-muted-foreground">{company.description}</p>}
          <div className="grid gap-2 text-sm">
            {company.website && <div className="flex items-center gap-2"><Globe className="size-4 text-muted-foreground" />{company.website}</div>}
            {company.location && <div className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" />{company.location}</div>}
            {company.hrEmail && <div className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{company.hrEmail}</div>}
            {company.hrPhone && <div className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" />{company.hrPhone}</div>}
          </div>
          {company.ctcMin != null && (
            <Card className="p-3"><div className="text-xs text-muted-foreground">CTC Range</div><div className="text-lg font-bold text-primary">₹{company.ctcMin} – ₹{company.ctcMax} LPA</div></Card>
          )}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Students placed ({placed.length})</h3>
            {placed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No placements yet.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Dept.</th><th className="p-2 text-left">Package</th></tr></thead>
                  <tbody>{placed.map((s) => (
                    <tr key={s.id} className="border-t"><td className="p-2 font-medium">{s.name}</td><td className="p-2">{s.department}</td><td className="p-2">₹{s.packageLpa} LPA</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
