import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

/**
 * Image with graceful placeholder fallback — swap src with real photography
 * (mark: [REPLACE_IMAGE]) via the CMS or public/images.
 */
export function SmartImage({
  src,
  alt,
  className,
  ratio = "aspect-[16/10]",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-deep-900 pattern-grid-dark",
          ratio,
          className
        )}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 sun-glow" aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-2 text-white/80">
          <ImageIcon className="h-8 w-8" aria-hidden />
          <span className="px-4 text-center text-xs font-medium tracking-wide text-white/70">
            [REPLACE_IMAGE] {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-deep-900", ratio, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}
