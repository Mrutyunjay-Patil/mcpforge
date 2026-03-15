import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-[#21262d]" />
        <Skeleton className="h-10 w-36 bg-[#21262d]" />
      </div>

      {/* Search bar */}
      <Skeleton className="mb-6 h-10 w-full max-w-sm bg-[#21262d]" />

      {/* Project cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[#30363d] p-6 space-y-3">
            <Skeleton className="h-5 w-3/4 bg-[#21262d]" />
            <Skeleton className="h-4 w-1/2 bg-[#21262d]" />
            <Skeleton className="h-4 w-1/3 bg-[#21262d]" />
          </div>
        ))}
      </div>
    </section>
  );
}
