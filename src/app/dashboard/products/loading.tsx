import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg border" />
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-background overflow-hidden">
        <div className="border-b bg-muted/40 p-4 grid grid-cols-6 gap-4">
          <Skeleton className="h-4 w-48" /> {/* Produit */}
          <Skeleton className="h-4 w-24" /> {/* SKU */}
          <Skeleton className="h-4 w-16 text-right" /> {/* Prix */}
          <Skeleton className="h-4 w-24" /> {/* Statut */}
          <Skeleton className="h-4 w-24" /> {/* Date */}
          <Skeleton className="h-4 w-16 mx-auto" /> {/* Actions */}
        </div>

        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 grid grid-cols-6 gap-4 items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-4 w-20 font-mono" />
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <div className="flex justify-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}