import Image from "next/image";
import { cn } from "@/lib/utils";
import { PARTNERS, type PartnerId } from "@/content/partners";
import { media } from "@/content/media";

type Partner = PartnerId | "city-ton";

type PartnerLogoBlockProps = {
  partner: Partner;
  name: string;
  role?: string;
  bullets?: string[];
  className?: string;
  compact?: boolean;
};

function PartnerLogoLink({
  partner,
  name,
  compact,
  className,
}: {
  partner: PartnerId;
  name: string;
  compact?: boolean;
  className?: string;
}) {
  const p = PARTNERS[partner];
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal",
        p.onDark ? "bg-ink px-4 py-3" : "bg-white px-4 py-3 ring-1 ring-border",
        className,
      )}
      aria-label={`${name} — website`}
    >
      <Image
        src={p.logo}
        alt={name}
        width={p.width}
        height={p.height}
        className={cn(
          "w-auto object-contain",
          compact ? "h-8 max-w-[140px]" : "h-10 max-w-[180px] md:h-12",
        )}
      />
    </a>
  );
}

export function PartnerLogoBlock({
  partner,
  name,
  role,
  bullets,
  className,
  compact,
}: PartnerLogoBlockProps) {
  if (partner === "city-ton") {
    if (compact) {
      return (
        <div className={cn("flex items-center justify-center", className)}>
          <Image
            src={media.brand.logo}
            alt={name}
            width={140}
            height={48}
            className="h-10 w-auto object-contain"
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
            src={media.brand.logo}
            alt={name}
            width={140}
            height={48}
            className="h-10 w-auto object-contain"
          />
        </div>
        <h3 className="text-lg font-semibold text-ink">{name}</h3>
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

  if (compact) {
    return (
      <PartnerLogoLink
        partner={partner}
        name={name}
        compact
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <div className="mb-5">
        <PartnerLogoLink partner={partner} name={name} />
      </div>
      <h3 className="text-lg font-semibold text-ink">{name}</h3>
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

/** Standalone linked partner logo for footer / inline use. */
export function PartnerLogo({
  partner,
  className,
  compact,
}: {
  partner: PartnerId;
  className?: string;
  compact?: boolean;
}) {
  return (
    <PartnerLogoLink
      partner={partner}
      name={PARTNERS[partner].name}
      compact={compact}
      className={className}
    />
  );
}
