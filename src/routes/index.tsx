import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("placeme:auth:v1");
        if (raw) {
          const u = JSON.parse(raw);
          throw redirect({ to: u.role === "student" ? "/student/home" : "/tpo/dashboard" });
        }
      } catch (e: any) {
        if (e && e.isRedirect) throw e;
      }
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
