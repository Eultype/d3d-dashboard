import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Stepper } from "@/components/ui/stepper";
import { Input } from "@/components/ui/input";
import { getNextSequenceValue } from "@/actions/sequence";
import { checkOrderReferenceExists } from "@/actions/check-reference";
// Import du type global
import type { OrderDraft } from "@/types/order";

// On met à jour les props pour inclure draft et onChange
type Props = {
  draft: OrderDraft;
  onChange: (patch: Partial<OrderDraft>) => void;
  onNext: () => void;
  onBack?: () => void; // Le bouton retour peut être optionnel au step 1
  currentStep?: number;
};

const steps = [
  { number: 1, label: "Infos" },
  { number: 2, label: "Client" },
  { number: 3, label: "Produits" },
  { number: 4, label: "Recap" },
];

export default function StepOne({
  draft,
  onChange,
  onNext,
  onBack,
  currentStep = 1,
}: Props) {
  const [nextSeq, setNextSeq] = useState<number | null>(null);
  const [isLoadingSeq, setIsLoadingSeq] = useState(false);
  
  // Validation doublon
  const [isReferenceTaken, setIsReferenceTaken] = useState(false);
  const [isCheckingRef, setIsCheckingRef] = useState(false);

  // Fonction helper pour mettre à jour une partie spécifique de "info"
  const updateInfo = (field: keyof typeof draft.info, value: string | number | null) => {
    onChange({
      info: {
        ...draft.info,
        [field]: value,
      },
    });
  };

  // Charger la séquence quand le préfixe change
  useEffect(() => {
    async function loadSeq() {
      if (!draft.info.prefix) return;
      setIsLoadingSeq(true);
      try {
        const val = await getNextSequenceValue(draft.info.prefix);
        setNextSeq(val);
        // Si c'est WEB et qu'on n'a pas encore de valeur manuelle, on pré-remplit
        if (draft.info.prefix === "WEB" && !draft.info.manualNumber) {
          updateInfo("manualNumber", val);
        }
      } finally {
        setIsLoadingSeq(false);
      }
    }
    loadSeq();
  }, [draft.info.prefix]); // Dépendance uniquement au préfixe

  // Vérifier doublon quand le numéro manuel change
  useEffect(() => {
    const checkRef = async () => {
      // On ne vérifie que si on est en mode WEB et qu'on a un numéro
      if (draft.info.prefix === "WEB" && draft.info.manualNumber) {
        setIsCheckingRef(true);
        try {
          const refToTest = `${draft.info.prefix}-${draft.info.manualNumber}`;
          const taken = await checkOrderReferenceExists(refToTest);
          setIsReferenceTaken(taken);
        } finally {
          setIsCheckingRef(false);
        }
      } else {
        setIsReferenceTaken(false);
      }
    };

    // Debounce simple
    const t = setTimeout(checkRef, 500);
    return () => clearTimeout(t);
  }, [draft.info.prefix, draft.info.manualNumber]);

  const isWeb = draft.info.prefix === "WEB";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Form Title */}
      <div className="pb-2">
        <h2 className="text-2xl font-bold ">Informations de la commande</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sélectionnez le préfixe et le mode de livraison
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col space-y-6">
        {/* Ligne 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="select-prefix">
              Préfixe De Commande *
            </FieldLabel>
            <Select
              // 1. Liaison avec draft
              value={draft.info.prefix}
              // 2. Mise à jour via le helper
              onValueChange={(val) => {
                onChange({
                  info: {
                    ...draft.info,
                    prefix: val,
                    manualNumber: null, // Reset manual on change
                  },
                });
              }}
            >
              <SelectTrigger className="w-full pl-4 pr-10 h-12">
                <SelectValue
                  id="select-prefix"
                  placeholder="Sélectionner Un Préfixe"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOG">BOG - Atelier Bogny</SelectItem>
                <SelectItem value="ERIC">ERIC - Eric</SelectItem>
                <SelectItem value="WEB">WEB - Site Web</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* CHAMP DYNAMIQUE : NUMÉRO */}
          <Field>
            <FieldLabel>Numéro de commande</FieldLabel>
            {isLoadingSeq ? (
              <div className="h-10 w-full flex items-center px-4 border rounded-md bg-muted/20 text-sm text-muted-foreground animate-pulse">
                Chargement...
              </div>
            ) : isWeb ? (
              <div className="relative">
                <Input 
                  type="number"
                  className={`h-9.5 w-full ${isReferenceTaken ? "border-red-500 ring-red-500 focus-visible:ring-red-500" : ""}`}
                  value={draft.info.manualNumber || ""}
                  onChange={(e) => updateInfo("manualNumber", parseInt(e.target.value))}
                  placeholder="Ex: 1001"
                />
                {isReferenceTaken && (
                  <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">
                    Cette référence existe déjà.
                  </p>
                )}
                {isCheckingRef && (
                  <p className="text-xs text-muted-foreground mt-1 absolute -bottom-5 right-0">Vérification...</p>
                )}
              </div>
            ) : (
              <div className="h-9.5 w-full flex items-center px-4 border rounded-md bg-muted/50 text-muted-foreground">
                {draft.info.prefix ? (
                  <span>Sera : <strong>{draft.info.prefix}-{nextSeq}</strong> (Automatique)</span>
                ) : (
                  <span>Sélectionnez un préfixe</span>
                )}
              </div>
            )}
          </Field>
        </div>

        {/* Ligne 2 */}
        <Field>
          <FieldLabel>Mode De Livraison *</FieldLabel>
          <Select
            value={draft.info.delivery}
            onValueChange={(val) => updateInfo("delivery", val)}
          >
            <SelectTrigger className="w-full pl-4 pr-10 h-12">
              <SelectValue placeholder="Sélectionner un mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retrait Atelier">Retrait Atelier</SelectItem>
              <SelectItem value="Livraison">Livraison</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          {/* Au step 1, le bouton retour est souvent désactivé ou caché,
              mais je le laisse comme dans votre code */}
          <Button
            variant="outline"
            onClick={onBack}
            disabled={!onBack} // Sécurité si onBack n'est pas passé
            className="w-32"
          >
            ← Retour
          </Button>

          <Button
            onClick={onNext}
            className="w-32 "
            // Optionnel : Désactiver si champs vides ou ref prise
            disabled={
              !draft.info.prefix || !draft.info.delivery || isReferenceTaken || isCheckingRef
            }
          >
            Continuer →
          </Button>
        </div>
      </div>
    </div>
  );
}
