import { Skeleton } from "@/components/ui/skeleton";

export default function CreateProjectLoading() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Skeleton className="mb-6 h-4 w-32" />

      {/* Title */}
      <Skeleton className="mb-8 h-8 w-48" />

      {/* Project name */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Tabs */}
      <Skeleton className="mb-4 h-10 w-72" />

      {/* Upload area */}
      <Skeleton className="mb-6 h-40 w-full rounded-lg" />

      {/* Submit button */}
      <Skeleton className="h-10 w-36" />
    </section>
  );
}
