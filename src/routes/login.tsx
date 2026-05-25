import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: user.role === "student" ? "/student/home" : "/tpo/dashboard" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = login(email, password);
    setBusy(false);
    if (!res.ok) { toast.error(res.error ?? "Login failed"); return; }
    toast.success("Welcome back!");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,oklch(0.585_0.205_280/0.18),transparent_55%),radial-gradient(circle_at_bottom_right,oklch(0.72_0.16_165/0.18),transparent_55%)]" />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-[420px] rounded-2xl border-border/60 p-7 shadow-xl">
          <div className="flex flex-col items-center gap-2">
            <Logo size={44} />
            <p className="text-sm text-muted-foreground">Your placement journey starts here</p>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@adcet.ac.in" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Password</Label>
              <div className="relative">
                <Input id="pw" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="h-11 w-full text-base" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
          </p>
          <div className="mt-6 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Demo accounts (password: <span className="font-mono">password</span>)</p>
            <ul className="mt-1 space-y-0.5">
              <li>• student@adcet.ac.in — Student</li>
              <li>• admin@adcet.ac.in — TPO Admin</li>
              <li>• dept@adcet.ac.in — Dept. TPO</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
