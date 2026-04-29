"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

const variantClasses: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "border border-zinc-200 text-zinc-800 hover:bg-zinc-50",
  danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  ghost: "text-zinc-700 hover:bg-zinc-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
};

export function AppButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

