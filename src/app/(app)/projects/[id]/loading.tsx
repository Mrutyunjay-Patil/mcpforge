import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Skeleton className="mb-6 h-4 w-32 bg-[#21262d]" />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-8 w-64 bg-[#21262d]" />
        <Skeleton className="h-10 w-36 bg-[#21262d]" />
      </div>

      {/* Tabs */}
      <Skeleton className="mb-6 h-10 w-72 bg-[#21262d]" />

      {/* Two-column layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-[70%] space-y-2">
          <Skeleton className="h-10 w-full bg-[#21262d]" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-[#21262d]" />
          ))}
        </div>
        <div className="lg:w-[30%] space-y-4 rounded-lg border border-[#30363d] bg-[#161b22] p-4">
          <Skeleton className="h-6 w-32 bg-[#21262d]" />
          <Skeleton className="h-10 w-full bg-[#21262d]" />
          <Skeleton className="h-10 w-full bg-[#21262d]" />
          <Skeleton className="h-10 w-full bg-[#21262d]" />
          <Skeleton className="h-10 w-full bg-[#21262d]" />
        </div>
      </div>
    </section>
  );
}
