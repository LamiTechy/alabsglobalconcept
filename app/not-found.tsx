import Link from "next/link";
import { Home, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-deep-950 text-white">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0 sun-glow" aria-hidden />
      <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-7xl font-bold text-sun-400">404</p>
        <h1 className="mt-4 font-display text-display-md font-bold text-white">
          This page has gone off-grid
        </h1>
        <p className="mt-3 max-w-md text-white/65">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to
          reliable power.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">
            <Home className="h-4 w-4" aria-hidden /> Back home
          </ButtonLink>
          <ButtonLink href="/products" variant="dark">
            <Search className="h-4 w-4" aria-hidden /> Browse products
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-white/50">
          Or{" "}
          <Link href="/contact" className="font-semibold text-sun-300 underline underline-offset-2">
            contact our team
          </Link>{" "}
          — we&apos;re happy to help.
        </p>
      </div>
    </section>
  );
}
