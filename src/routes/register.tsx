import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function RegisterPage() {
  const { register, user, state } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/student/home" }); }, [user, navigate]);

  const emailErr = useMemo(() => {
    if (!email) return null;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Invalid email format";
    if (state.settings.emailDomainRestrict && state.settings.allowedDomains.length) {
      const dom = email.split("@")[1]?.toLowerCase();
      if (!state.settings.allowedDomains.some((d) => d.toLowerCase() === dom)) {
        return `Email must end with @${state.settings.allowedDomains.join(" or @")}`;
      }
    }
    return null;
  }, [email, state.settings]);

  const strength = passwordStrength(pw);
  const strengthLabel = ["Too weak", "Weak", "Okay", "Strong", "Excellent"][strength];
  const strengthColors = ["bg-destructive", "bg-orange-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailErr) return;
    if (pw !== pw2) { toast.error("Passwords don't match"); return; }
    if (strength < 2) { toast.error("Choose a stronger password"); return; }
    setBusy(true);
    const r = register(name, email, pw);
    setBusy(false);
    if (!r.ok) { toast.error(r.error ?? "Registration failed"); return; }
    toast.success("Account created! Please complete your profile.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,oklch(0.585_0.205_280/0.18),transparent_55%),radial-gradient(circle_at_bottom_left,oklch(0.72_0.16_165/0.18),transparent_55%)]" />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-[420px] rounded-2xl border-border/60 p-7 shadow-xl">
          <div className="flex flex-col items-center gap-2">
            <Logo size={44} />
            <p className="text-sm text-muted-foreground">Create your PlaceMe account</p>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!emailErr} className={cn(emailErr && "border-destructive")} placeholder={`you@${state.settings.allowedDomains[0] ?? "example.com"}`} required />
              {emailErr && <p className="text-xs text-destructive">{emailErr}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Password</Label>
              <div className="relative">
                <Input id="pw" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} required />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {pw && (
                <div className="mt-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={cn("h-1 flex-1 rounded-full", i < strength ? strengthColors[strength - 1] : "bg-muted")} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{strengthLabel}</p>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw2">Confirm password</Label>
              <Input id="pw2" type={show ? "text" : "password"} value={pw2} onChange={(e) => setPw2(e.target.value)} required className={cn(pw2 && pw !== pw2 && "border-destructive")} />
              {pw2 && pw !== pw2 && <p className="text-xs text-destructive">Passwords don't match</p>}
            </div>
            <Button type="submit" className="h-11 w-full text-base" disabled={busy || !!emailErr}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
