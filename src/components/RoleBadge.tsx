import type { Role } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const labels: Record<Role, string> = {
  "student": "Student",
  "tpo-admin": "TPO Admin",
  "tpo-co-admin": "TPO Co-Admin",
  "tpo-department": "Dept. TPO",
  "moderator": "Moderator",
};

export function RoleBadge({ role }: { role: Role }) {
  return <Badge variant="secondary" className="font-medium">{labels[role]}</Badge>;
}
