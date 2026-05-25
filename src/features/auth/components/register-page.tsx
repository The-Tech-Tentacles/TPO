"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { routes } from "@/shared/config/routes";

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export function RegisterPage() {
  const { register, user, state } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace(routes.student.home);
  }, [router, user]);

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailErr) return;
    if (pw !== pw2) return toast.error("Passwords don't match");
    if (strength < 2) return toast.error("Choose a stronger password");
    setBusy(true);
    const r = register(name, email, pw);
    setBusy(false);
    if (!r.ok) return toast.error(r.error ?? "Registration failed");
    toast.success("Account created");
    router.replace(routes.student.home);
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
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(emailErr && "border-destructive")}
                required
              />
              {emailErr && <p className="text-xs text-destructive">{emailErr}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Password</Label>
              <div className="relative">
                <Input
                  id="pw"
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw2">Confirm password</Label>
              <Input
                id="pw2"
                type={show ? "text" : "password"}
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                required
                className={cn(pw2 && pw !== pw2 && "border-destructive")}
              />
            </div>
            <Button type="submit" className="h-11 w-full text-base" disabled={busy || !!emailErr}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href={routes.auth.login} className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
