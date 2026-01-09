"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CustomerLite = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  companyName: string | null;
};

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function CustomerSearch({
  value,
  onPick,
  onClear,
}: {
  value: CustomerLite | null;
  onPick: (c: CustomerLite) => void;
  onClear: () => void;
}) {
  const [q, setQ] = React.useState("");
  const debounced = useDebouncedValue(q, 250);
  const [items, setItems] = React.useState<CustomerLite[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      if (debounced.trim().length < 2) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/customers/search?q=${encodeURIComponent(debounced)}`,
        );
        const data = (await res.json()) as CustomerLite[];
        if (!cancelled) setItems(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Rechercher un client (nom, email, téléphone)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {value && (
          <Button type="button" variant="outline" onClick={onClear}>
            Retirer
          </Button>
        )}
      </div>

      {value && (
        <div className="rounded-lg border p-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Sélectionné</Badge>

          <div className="text-sm">
            <span className="font-medium">{value.name ?? "Sans nom"}</span>

            {value.companyName ? (
              <span className="text-muted-foreground">
                {" "}
                • {value.companyName}
              </span>
            ) : null}

            {value.email ? (
              <span className="text-muted-foreground"> • {value.email}</span>
            ) : null}
          </div>
        </div>
      )}

      {!value && debounced.trim().length > 0 && (
        <div className="rounded-lg border bg-background">
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Recherche…
            </div>
          )}

          {!loading && debounced.trim().length >= 2 && items.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Aucun résultat
            </div>
          )}

          {!loading && items.length > 0 && (
            <ul className="max-h-64 overflow-auto p-2">
              {items.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="w-full rounded-md px-2 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      onPick(c);
                      setQ("");
                      setItems([]);
                    }}
                  >
                    <div className="text-sm font-medium">
                      {c.name ?? "Sans nom"}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {[c.companyName, c.email, c.phone]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
