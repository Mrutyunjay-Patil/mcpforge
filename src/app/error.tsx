"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center bg-[#0d1117]">
      <h1 className="text-4xl font-bold tracking-tight text-[#c9d1d9]">
        Something went wrong
      </h1>
      <p className="mt-4 text-sm text-[#8b949e]">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#58a6ff]/90 transition-colors duration-150"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border border-[#30363d] px-4 py-2 text-sm font-medium text-[#c9d1d9] hover:bg-[#161b22] transition-colors duration-150"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
