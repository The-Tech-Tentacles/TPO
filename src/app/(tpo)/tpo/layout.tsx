import { TpoShell } from "@/features/tpo/components/tpo-shell";

export default function TpoLayout({ children }: { children: React.ReactNode }) {
  return <TpoShell>{children}</TpoShell>;
}
