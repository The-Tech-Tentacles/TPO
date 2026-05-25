import { initials } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AvatarCircle({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/90 to-accent/90 font-semibold text-primary-foreground",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </div>
  );
}
