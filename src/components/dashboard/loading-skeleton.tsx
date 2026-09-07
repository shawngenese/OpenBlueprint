import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6 gap-4">
            <CardHeader className="p-0 gap-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent className="p-0">
              <Skeleton className="h-6 w-28 rounded-full" />
            </CardContent>
            <CardFooter className="p-0 pt-2 pb-6 flex gap-2 bg-transparent border-0">
              <Skeleton className="h-9 flex-1 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
