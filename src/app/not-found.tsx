import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center bg-[#0d1117]">
      <h1 className="text-6xl font-bold tracking-tight text-[#c9d1d9]">404</h1>
      <p className="mt-4 text-lg text-[#8b949e]">
        Page not found
      </p>
      <p className="mt-2 text-sm text-[#8b949e]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#58a6ff]/90 transition-colors duration-150"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
