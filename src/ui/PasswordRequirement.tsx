import { Check } from "lucide-react";

type PasswordRequirementProps = {
  valid: boolean;
  text: string;
};

const PasswordRequirement = ( {valid, text}: PasswordRequirementProps) => {
  return (
    <div
      className={`flex items-center gap-1.5 ${
        valid ? "text-teal-600" : "text-slate-400"
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
          valid ? "bg-teal-100" : "bg-slate-200"
        }`}
      >
        {valid && <Check className="h-2.5 w-2.5" />}
      </span>

      {text}
    </div>
  );
}

export default PasswordRequirement