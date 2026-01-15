"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchInput({ 
  placeholder = "Rechercher...", 
  className 
}: { 
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isPending, startTransition] = React.useTransition();
  const [value, setValue] = React.useState(searchParams.get("q") ?? "");

  // Effet de debounce pour ne pas spammer l'URL
  React.useEffect(() => {
    const handler = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      
      // On ne met à jour que si ça a changé
      if (currentQ === value) return;

      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300); // 300ms de délai

    return () => clearTimeout(handler);
  }, [value, router, pathname, searchParams]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9 pr-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-3 top-3">
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
