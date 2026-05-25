import { GraduationCap } from "lucide-react";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm" style={{ width: size, height: size }}>
        <GraduationCap size={size * 0.6} />
      </div>
      <div className="leading-tight">
        <div className="text-lg font-bold tracking-tight">PlaceMe</div>
      </div>
    </div>
  );
}
