import { DashboardSkeleton } from "@/components/dashboard/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-6xl p-6 sm:p-8 lg:p-10">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
