"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center bg-[#09090B]">
      <h1 className="font-mono text-4xl font-bold tracking-tight text-[#FAFAFA]">
        Something went wrong
      </h1>
      <p className="mt-4 font-sans text-sm text-[#A1A1AA]">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center rounded-md bg-[#F97316] px-4 py-2 text-sm font-medium text-black hover:bg-[#EA580C] transition-colors duration-150"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border border-white/[0.06] px-4 py-2 text-sm font-medium text-[#FAFAFA] hover:bg-[#18181B] transition-colors duration-150"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
