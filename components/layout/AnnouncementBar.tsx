import Link from "next/link";

export function AnnouncementBar({ text, link }: { text: string; link?: string | null }) {
  const inner = (
    <span className="text-center text-[0.8rem] font-medium leading-snug">
      {text}
      {link ? (
        <span className="ml-2 font-semibold text-sun-300 underline underline-offset-2">Learn more →</span>
      ) : null}
    </span>
  );
  return (
    <div className="bg-deep-950 text-white">
      <div className="container-page flex min-h-10 items-center justify-center py-2">
        {link ? (
          <Link href={link} className="transition hover:text-sun-200">
            {inner}
          </Link>
        ) : (
          inner
        )}
      </div>
    </div>
  );
}
