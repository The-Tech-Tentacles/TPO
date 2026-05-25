import { createFileRoute } from "@tanstack/react-router";
import { StudentLayout } from "@/components/StudentLayout";

export const Route = createFileRoute("/student")({ component: StudentLayout });
