"use client";

import FloatingInput from "@/ui/FloatingInput";
import PasswordRequirement from "@/ui/PasswordRequirement";
import { EyeIcon, EyeOffIcon, UserPlus } from "lucide-react";
import { useState, ChangeEvent, SubmitEvent } from "react";
import Link from "next/link";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // Name
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (name.length > 50) {
      newErrors.name = "Name must be less than 50 characters.";
    }

    // Email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the current field error while typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace this with your API call.
      //
      // Example:
      //
      // const response = await fetch("/api/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Signup data:", formData);

      // Reset after successful signup if needed
      // setFormData({
      //   name: "",
      //   email: "",
      //   password: "",
      //   confirmPassword: "",
      // });
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-6">
      <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-xl shadow-teal-900/5 mx-3">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="ml-4 text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Sign up to get started with your account.
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <FloatingInput
              id="name"
              name="name"
              type="text"
              label="Full name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            {/* Email */}
            <FloatingInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Password */}
            <FloatingInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              action={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:text-teal-600 focus:outline-none"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              }
            />

            {/* Password requirements */}
            {formData.password && (
              <div className="-mt-2 rounded-lg bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium text-slate-600">
                  Password must contain:
                </p>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <PasswordRequirement
                    valid={formData.password.length >= 8}
                    text="8+ characters"
                  />
                  <PasswordRequirement
                    valid={/[A-Z]/.test(formData.password)}
                    text="Uppercase"
                  />
                  <PasswordRequirement
                    valid={/[a-z]/.test(formData.password)}
                    text="Lowercase"
                  />
                  <PasswordRequirement
                    valid={/[0-9]/.test(formData.password)}
                    text="Number"
                  />
                  <PasswordRequirement
                    valid={/[^A-Za-z0-9]/.test(formData.password)}
                    text="Special character"
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <FloatingInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              action={
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:text-teal-600 focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              }
            />

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-2 focus:ring-teal-500"
              />

              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition cursor-pointer hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/auth?mode=signup"
              className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;