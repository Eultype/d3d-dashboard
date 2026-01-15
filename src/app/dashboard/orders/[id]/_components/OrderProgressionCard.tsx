import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabelFR } from "@/lib/orders";

export function OrderProgressionCard({ order }: { order: { status: string } }) {
  const steps = [
    { key: "A_VERIFIER", label: "Confirmation" },
    { key: "PROD", label: "Traitement" },
    { key: "EXPEDITION", label: "Expédition" },
    { key: "TERMINE", label: "Livrée" },
  ];

  const idx = Math.max(
    0,
    steps.findIndex((s) => s.key === order.status),
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base">Progression</CardTitle>
            <p className="text-sm text-muted-foreground">
              Statut actuel de la commande
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Actuel</p>
            <p className="text-sm font-semibold">
              {statusLabelFR(order.status)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((s, i) => {
            const done = i < idx;
            const active = i === idx;

            return (
              <div
                key={s.key}
                className="rounded-2xl border bg-background p-3 "
              >
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ",
                      done ? "   border-foreground" : "",
                      active ? "border-foreground" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {i + 1}
                  </span>
                  <p
                    className={[
                      "text-sm font-medium",
                      active ? "" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {s.label}
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted ">
                  <div
                    className={[
                      "h-full rounded-full bg-foreground transition-all",
                      done
                        ? "w-full bg-green-500"
                        : active
                          ? "w-2/3 bg-green-500"
                          : "w-0",
                    ].join(" ")}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
