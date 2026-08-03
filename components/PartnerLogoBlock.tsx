import Image from "next/image";
import { cn } from "@/lib/utils";

type Partner = "armolan" | "llumar" | "city-ton";

type PartnerLogoBlockProps = {
  partner: Partner;
  name: string;
  role?: string;
  bullets?: string[];
  className?: string;
  compact?: boolean;
};

const LOGO: Record<Partner, { src: string; width: number; height: number }> = {
  armolan: {
    src: "/brand/partner-armolan.svg",
    width: 160,
    height: 40,
  },
  llumar: {
    src: "/brand/partner-llumar.svg",
    width: 160,
    height: 40,
  },
  "city-ton": {
    src: "/brand/logo-header.png",
    width: 140,
    height: 48,
  },
};

export function PartnerLogoBlock({
  partner,
  name,
  role,
  bullets,
  className,
  compact,
}: PartnerLogoBlockProps) {
  const logo = LOGO[partner];

  if (compact) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Image
          src={logo.src}
          alt={name}
          width={logo.width}
          height={logo.height}
          className="h-10 w-auto object-contain opacity-90"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <div className="mb-4 flex h-14 items-center">
        <Image
          src={logo.src}
          alt={name}
          width={logo.width}
          height={logo.height}
          className="h-10 w-auto object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold text-teal-dark">{name}</h3>
      {role ? <p className="mt-1 text-sm text-teal">{role}</p> : null}
      {bullets?.length ? (
        <ul className="mt-4 space-y-2 text-sm text-text-muted">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
