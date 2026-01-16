"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
};

export function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
}: PaginationControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t px-2 py-4">
      {/* Infos (ex: Page 1 sur 5) */}
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> sur{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
        {totalCount !== undefined && ` (${totalCount} résultats)`}
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          asChild={currentPage > 1}
        >
          {currentPage > 1 ? (
            <Link href={createPageURL(currentPage - 1)} className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Précédent
            </Link>
          ) : (
            <span className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Précédent
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          disabled={currentPage >= totalPages}
          asChild={currentPage < totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={createPageURL(currentPage + 1)} className="flex items-center">
              Suivant
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <span className="flex items-center">
              Suivant
              <ChevronRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
