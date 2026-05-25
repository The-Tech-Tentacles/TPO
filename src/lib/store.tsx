import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STUDENTS, FACULTY, COMPANIES, POSTS, PENDING, SETTINGS, DEMO_USERS } from "./dummy-data";
import type {
  Student,
  TPOFaculty,
  Company,
  Post,
  PendingItem,
  AppSettings,
  User,
  Role,
} from "./types";

const LS_KEY = "placeme:state:v2";
const LS_AUTH = "placeme:auth:v1";

interface State {
  students: Student[];
  faculty: TPOFaculty[];
  companies: Company[];
  posts: Post[];

  pending: PendingItem[];
  settings: AppSettings;
}

const initial: State = {
  students: STUDENTS,
  faculty: FACULTY,
  companies: COMPANIES,
  posts: POSTS,

  pending: PENDING,
  settings: SETTINGS,
};

interface Ctx {
  state: State;
  setState: (updater: (s: State) => State) => void;
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<State>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return { ...initial, ...JSON.parse(raw) };
    } catch {
      // Ignore malformed localStorage payloads and fall back to defaults.
    }
    return initial;
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(LS_AUTH);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write failures.
    }
  }, [state]);
  useEffect(() => {
    try {
      if (user) localStorage.setItem(LS_AUTH, JSON.stringify(user));
      else localStorage.removeItem(LS_AUTH);
    } catch {
      // Ignore storage write failures.
    }
  }, [user]);

  const setState = (updater: (s: State) => State) => setStateRaw(updater);

  const login: Ctx["login"] = (email, password) => {
    const u = DEMO_USERS.find(
      (d) => d.email.toLowerCase() === email.toLowerCase() && d.password === password,
    );
    if (!u) return { ok: false, error: "Invalid email or password" };
    const { password: _p, ...rest } = u;
    setUser(rest);
    return { ok: true };
  };

  const register: Ctx["register"] = (name, email) => {
    const role: Role = "student";
    const newUser: User = { id: `u-${Date.now()}`, name, email, role };
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ state, setState, user, login, register, logout }), [state, user]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function isEligible(s: Student, c = SETTINGS.eligibility) {
  if (s.activeBacklogs) return false;
  return (
    s.tenth.percentage >= c.tenthMin && s.twelfth.percentage >= c.twelfthMin && s.cgpa >= c.cgpaMin
  );
}

export function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
