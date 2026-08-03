import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "aside";
  soft?: boolean;
  dark?: boolean;
  fullBleed?: boolean;
};

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  soft,
  dark,
  fullBleed,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "w-full",
        !fullBleed && "py-20 md:py-28",
        soft && "bg-bg-soft",
        dark && "bg-dark-green text-white",
        className,
      )}
    >
      {fullBleed ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-10">
          {children}
        </div>
      )}
    </Tag>
  );
}

export function Eyebrow({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-4 text-xs font-semibold tracking-[0.18em] uppercase",
        light ? "text-teal" : "text-teal-dark/70",
        className,
      )}
    >
      {children}
    </p>
  );
}
