import Image from "next/image";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Parallax } from "@/components/motion/Parallax";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
  cta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  children?: React.ReactNode;
  /** Disable parallax for LCP-critical heroes */
  staticImage?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  lede,
  imageSrc,
  imageAlt = "",
  className,
  cta,
  secondaryCta,
  children,
  staticImage = false,
}: PageHeroProps) {
  const image = (
    <Image
      src={imageSrc}
      alt={imageAlt}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  );

  return (
    <section
      className={cn(
        "relative flex min-h-[52vh] items-end overflow-hidden bg-dark-green text-white md:min-h-[60vh]",
        className,
      )}
    >
      <div className="absolute inset-0">
        {staticImage ? image : <Parallax strength={0.15} className="h-full w-full">{image}</Parallax>}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-green via-dark-green/70 to-dark-green/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-green/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-14 pt-32 sm:px-8 lg:px-10 lg:pb-20">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-display text-white">{title}</h1>
        {lede ? (
          <p className="mt-5 max-w-2xl text-lede text-white/80">{lede}</p>
        ) : null}
        {(cta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {cta ? (
              <Link
                href={cta.href}
                className="inline-flex items-center rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-dark"
              >
                {cta.label}
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
