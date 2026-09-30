import { ReactNode } from "react";

type AnalysisSectionProps = {
  items: string[];
  title: string;
  icon?: ReactNode;
  variant?: "success" | "warning" | "info";
};

const variantStyles = {
  success: {
    border: "border-emerald-100",
    icon: "text-emerald-500",
  },
  warning: {
    border: "border-rose-100",
    icon: "text-rose-500",
  },
  info: {
    border: "border-violet-100",
    icon: "text-violet-500",
  },
};

export default function AnalysisSection({
  items,
  title,
  icon,
  variant = "info",
}: AnalysisSectionProps) {
  const styles = variantStyles[variant];

  if (!items.length) return null;

  return (
    <section
      className={`rounded-2xl border ${styles.border} bg-white p-6 shadow-sm dark:bg-gray-900`}
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            <span
              className={`mt-0.5 shrink-0 font-semibold ${styles.icon}`}
              aria-hidden="true"
            >
              {icon ?? "→"}
            </span>

            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
