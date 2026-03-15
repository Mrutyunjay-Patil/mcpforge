import { Skeleton } from "@/components/ui/skeleton";

export default function CreateProjectLoading() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Skeleton className="mb-6 h-4 w-32 bg-[#21262d]" />

      {/* Title */}
      <Skeleton className="mb-8 h-8 w-48 bg-[#21262d]" />

      {/* Project name */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-24 bg-[#21262d]" />
        <Skeleton className="h-10 w-full bg-[#21262d]" />
      </div>

      {/* Tabs */}
      <Skeleton className="mb-4 h-10 w-72 bg-[#21262d]" />

      {/* Upload area */}
      <Skeleton className="mb-6 h-40 w-full rounded-lg bg-[#21262d]" />

      {/* Submit button */}
      <Skeleton className="h-10 w-36 bg-[#21262d]" />
    </section>
  );
}
