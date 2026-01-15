"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabelFR } from "@/lib/orders";
import { updateOrderStatus } from "@/actions/order";
import { Loader2, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function OrderProgressionCard({ order }: { order: { id: string; status: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [targetStep, setTargetStep] = useState<{ key: string; label: string } | null>(null);

  // Définition des étapes logiques
  const steps = [
    { key: "A_VERIFIER", label: "Confirmation" },
    { key: "PROD", label: "Traitement" },
    { key: "A_EXPEDIER", label: "Expédition" }, // J'ai corrigé EXPEDITION -> A_EXPEDIER pour matcher l'action
    { key: "TERMINE", label: "Livrée" },
  ];

  const currentIdx = Math.max(0, steps.findIndex((s) => s.key === order.status));

  const handleStepClick = (stepKey: string, stepLabel: string) => {
    // On ne fait rien si on clique sur l'étape actuelle ou si ça charge
    if (stepKey === order.status || isLoading) return;
    setTargetStep({ key: stepKey, label: stepLabel });
  };

  const confirmChange = async () => {
    if (!targetStep) return;
    setIsLoading(true);
    
    try {
      const res = await updateOrderStatus(order.id, targetStep.key);
      if (!res.success) {
        alert(res.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur technique");
    } finally {
      setIsLoading(false);
      setTargetStep(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-base">Progression</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cliquez sur une étape pour changer le statut
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Actuel</p>
              <p className="text-sm font-semibold flex items-center justify-end gap-2">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                {statusLabelFR(order.status)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((s, i) => {
              const isLastStep = i === steps.length - 1;
              const isDone = i < currentIdx || (isLastStep && currentIdx === i); // Si dernière étape et active -> considéré comme fini
              const isActive = i === currentIdx && !isLastStep; // Active seulement si pas la dernière (sinon elle est done)
              const isFuture = i > currentIdx;

              return (
                <button
                  key={s.key}
                  disabled={isLoading || isActive}
                  onClick={() => handleStepClick(s.key, s.label)}
                  className={`
                    relative text-left rounded-2xl border p-3 transition-all duration-200
                    ${isActive ? "ring-2 ring-foreground ring-offset-2 border-foreground bg-muted/30" : ""}
                    ${!isActive ? "hover:bg-muted/50 hover:border-foreground/30 cursor-pointer" : "cursor-default"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold transition-colors
                        ${isDone ? "border-green-600 bg-green-600 text-white" : ""}
                        ${isActive ? "border-foreground bg-foreground text-background" : ""}
                        ${isFuture ? "text-muted-foreground bg-muted border-transparent" : ""}
                      `}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <p className={`text-sm font-medium ${isActive ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                      {s.label}
                    </p>
                  </div>
                  
                  {/* Progress Bar Item */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all duration-500 ease-out
                        ${isDone ? "w-full bg-green-600" : "w-0"}
                      `}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* MODALE DE CONFIRMATION */}
      <AlertDialog open={!!targetStep} onOpenChange={(open) => !open && setTargetStep(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Changer le statut ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de passer cette commande à l&#39;étape : <span className="font-bold text-foreground">{targetStep?.label}</span>.
              <br/>
              Cela pourra déclencher l&#39;envoi d&#39;une notification au client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChange}>
              Confirmer le changement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
