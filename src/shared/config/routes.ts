export const routes = {
  auth: {
    login: "/login",
    register: "/register",
  },
  student: {
    home: "/student/home",
    calendar: "/student/calendar",
    profile: "/student/profile",
    help: "/student/help",
  },
  tpo: {
    dashboard: "/tpo/dashboard",
    students: "/tpo/students",
    faculty: "/tpo/faculty",
    companies: "/tpo/companies",
    feed: "/tpo/feed",
    calendar: "/tpo/calendar",
    settings: "/tpo/settings",
  },
} as const;
