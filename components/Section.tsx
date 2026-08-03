import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "aside";
  soft?: boolean;
  dark?: boolean;
};

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  soft,
  dark,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "w-full py-16 md:py-24",
        soft && "bg-bg-soft",
        dark && "bg-dark-green text-white",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </Tag>
  );
}
