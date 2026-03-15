import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Skeleton className="mb-6 h-4 w-32 bg-[#27272A]" />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-8 w-64 bg-[#27272A]" />
        <Skeleton className="h-10 w-36 bg-[#27272A]" />
      </div>

      {/* Tabs */}
      <Skeleton className="mb-6 h-10 w-72 bg-[#27272A]" />

      {/* Two-column layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-[70%] space-y-2">
          <Skeleton className="h-10 w-full bg-[#27272A]" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-[#27272A]" />
          ))}
        </div>
        <div className="lg:w-[30%] space-y-4 rounded-lg border border-white/[0.06] bg-[#18181B] p-4">
          <Skeleton className="h-6 w-32 bg-[#27272A]" />
          <Skeleton className="h-10 w-full bg-[#27272A]" />
          <Skeleton className="h-10 w-full bg-[#27272A]" />
          <Skeleton className="h-10 w-full bg-[#27272A]" />
          <Skeleton className="h-10 w-full bg-[#27272A]" />
        </div>
      </div>
    </section>
  );
}
