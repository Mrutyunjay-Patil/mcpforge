import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center bg-[#09090B]">
      <h1 className="font-mono text-6xl font-bold tracking-tight text-[#FAFAFA]">404</h1>
      <p className="mt-4 font-sans text-lg text-[#A1A1AA]">
        Page not found
      </p>
      <p className="mt-2 font-sans text-sm text-[#A1A1AA]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-[#F97316] hover:text-[#FB923C] transition-colors duration-150"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
