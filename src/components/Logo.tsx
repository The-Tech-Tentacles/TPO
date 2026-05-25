import Image from "next/image";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      {/* <Image
        src="/adcet_logo.png"
        alt="ADCET Logo"
        width={size}
        height={size}
        className="object-contain"
      /> */}
      <div className="leading-tight flex items-center">
        <div className="text-lg font-bold tracking-tight">
          <span className="text-red-600">AD</span>
          <span className="text-foreground">CE</span>
          <span className="relative inline-block">
            {/* Red horizontal line for T */}
            <span className="text-foreground relative">T</span>
          </span>
          <span className="text-foreground ml-1">TPP</span>
        </div>
      </div>
    </div>
  );
}
