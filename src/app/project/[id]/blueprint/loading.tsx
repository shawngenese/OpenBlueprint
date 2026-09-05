import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-6xl p-6 sm:p-8 lg:p-10 space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-10 w-72 rounded-full" />
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 gap-3">
              <CardHeader className="p-0">
                <Skeleton className="h-5 w-32 rounded-full" />
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
