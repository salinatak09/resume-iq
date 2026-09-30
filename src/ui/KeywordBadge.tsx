import { ReactNode } from "react";

interface PageProps {
  skill:string,
  icon: ReactNode,
  color: 'teal' | 'emerald' | 'amber',
}

const variantStyles = {
  emerald: {
    skill: "bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-500",
  },
  amber: {
    skill: "bg-amber-50 text-amber-700",
    icon: "bg-amber-500",
  },
  teal: {
    skill: "bg-teal-50 text-teal-700",
    icon: "bg-teal-500",
  },
};

const KeywordBadge = ({skill, icon, color}: PageProps) => {
  const styles = variantStyles[color];

  return (
    <span className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${styles.skill}`}>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs text-white ${styles.icon}`}>
        {icon ?? "✓"}
      </span>
      {skill}
    </span>
  )
}

export default KeywordBadge;