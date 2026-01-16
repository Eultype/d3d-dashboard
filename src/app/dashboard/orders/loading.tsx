import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" /> {/* Search */}
          <Skeleton className="h-10 w-40" /> {/* New Order Button */}
        </div>
      </div>

      {/* Stats (si présentes, ou juste le tableau direct) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg border" />
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-lg border bg-background overflow-hidden">
        {/* Table Header */}
        <div className="border-b bg-muted/40 p-4 grid grid-cols-6 gap-4">
          <Skeleton className="h-4 w-20" /> {/* ID */}
          <Skeleton className="h-4 w-32" /> {/* Client */}
          <Skeleton className="h-4 w-24" /> {/* Statut */}
          <Skeleton className="h-4 w-16 ml-auto" /> {/* Total */}
          <Skeleton className="h-4 w-24" /> {/* Date */}
          <Skeleton className="h-4 w-16 mx-auto" /> {/* Actions */}
        </div>

        {/* Rows */}
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-4 grid grid-cols-6 gap-4 items-center">
              <div className="space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 ml-auto" />
              <Skeleton className="h-4 w-24" />
              <div className="flex justify-center">
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}