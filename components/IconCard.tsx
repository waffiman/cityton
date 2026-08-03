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
        "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border transition hover:shadow-md",
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-teal-dark">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}
