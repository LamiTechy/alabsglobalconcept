import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "dark" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-sun-400 text-deep-900 hover:bg-sun-300 shadow-glow/40 hover:shadow-glow font-semibold",
  secondary:
    "bg-deep-900 text-white hover:bg-deep-800 font-semibold",
  dark: "bg-white text-deep-900 hover:bg-sun-50 font-semibold",
  outline:
    "border-2 border-deep-900/15 text-deep-900 hover:border-sun-400 hover:text-deep-900 font-semibold bg-transparent",
  ghost: "text-deep-900 hover:bg-deep-900/5 font-semibold",
  whatsapp: "bg-energy-500 text-white hover:bg-energy-600 font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-13 px-7 py-3.5 text-base rounded-xl",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
