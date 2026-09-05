import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-2xl p-6 sm:p-8 lg:p-10 space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Card className="p-6 gap-4">
          <CardHeader className="p-0 gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-32 ml-auto rounded-full" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
