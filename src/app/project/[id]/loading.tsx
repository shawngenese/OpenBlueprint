import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-3xl p-6 sm:p-8 lg:p-10 space-y-6">
        <Skeleton className="h-5 w-32" />
        <Card className="p-6">
          <CardHeader className="p-0 gap-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
