import { cn } from "@/lib/utils";

type IconCardProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

export function IconCard({ icon, title, description, className }: IconCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-7 shadow-sm ring-1 ring-border transition hover:shadow-md",
        className,
      )}
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-teal/10 text-teal">
        {icon}
      </div>
      <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}
