import type { User } from "@/lib/types";
import { routes } from "@/shared/config/routes";

export function getHomeRouteForUser(user: User) {
  return user.role === "student" ? routes.student.home : routes.tpo.dashboard;
}
