import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Motion";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && <p className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</p>}
      <h2
        className={cn(
          "mt-4 text-display-lg",
          dark ? "heading-display-dark" : "heading-display"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed md:text-lg", dark ? "text-white/70" : "text-muted")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
