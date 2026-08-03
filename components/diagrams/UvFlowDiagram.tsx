type UvFlowDiagramProps = {
  title: string;
  steps: [string, string, string];
  className?: string;
};

export function UvFlowDiagram({ title, steps, className }: UvFlowDiagramProps) {
  return (
    <div className={`rounded-2xl bg-bg-soft p-6 md:p-8 ${className ?? ""}`}>
      <h3 className="mb-6 text-center text-lg font-semibold text-teal-dark md:text-xl">
        {title}
      </h3>
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-1 items-center gap-4 md:flex-col md:gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal text-lg font-bold text-white shadow-sm">
              {i + 1}
            </div>
            <p className="flex-1 text-sm text-text-muted md:text-center">{step}</p>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="hidden text-2xl font-bold text-amber md:block"
              >
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
