import { AlertTriangle } from "lucide-react";
import { useState } from "react";

type FloatingInputProps = {
  id: string;
  name: string;
  type: string;
  label: string;
  autoComplete?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  action?: React.ReactNode;
};

function FloatingInput({
  id,
  name,
  type,
  label,
  autoComplete,
  value,
  onChange,
  error,
  action,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isFloating = isFocused || value.length > 0;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={autoComplete}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            peer block w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-transparent
            ${
              error
                ? "border-red-400 focus:border-red-500"
                : "border-slate-300 focus:border-teal-500"
            }
            focus:ring-4
            ${
              error
                ? "focus:ring-red-500/10"
                : "focus:ring-teal-500/10"
            }

            ${action ? "pr-12" : ""}
          `}
        />

        <label
          htmlFor={id}
          className={`
            pointer-events-none absolute left-3 top-0 z-10 origin-left bg-white px-1 text-sm transition-all duration-200
            ${ isFloating
              ? "-translate-y-1/2 scale-95"
              : "top-1/2 -translate-y-1/2 scale-100"
            }
            ${ error
              ? "text-red-500"
              : isFloating
                ? "text-teal-600"
                : "text-slate-500"
            }
          `}
        >
          {label}
        </label>

        {action}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default FloatingInput;