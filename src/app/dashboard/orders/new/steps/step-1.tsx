"use client";

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
// Import du type global
import { OrderDraft } from "../page";

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
  // Fonction helper pour mettre à jour une partie spécifique de "info"
  const updateInfo = (field: keyof typeof draft.info, value: string) => {
    onChange({
      info: {
        ...draft.info,
        [field]: value,
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Form Title */}
      <div className="pb-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Informations de la commande
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Sélectionnez le préfixe, le canal et le mode de livraison
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
              onValueChange={(val) => updateInfo("prefix", val)}
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

          <Field>
            <FieldLabel htmlFor="select-canal">Canal De Réception *</FieldLabel>
            <Select
              value={draft.info.channel}
              onValueChange={(val) => updateInfo("channel", val)}
            >
              <SelectTrigger className="w-full pl-4 pr-10 h-12">
                <SelectValue
                  id="select-canal"
                  placeholder="Sélectionner un canal"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Atelier">Atelier</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Shopify">Shopify</SelectItem>
                <SelectItem value="Site Web">Site Web</SelectItem>
                <SelectItem value="Téléphone">Téléphone</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
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
            className="w-32 bg-slate-800 hover:bg-slate-900"
            // Optionnel : Désactiver si champs vides
            disabled={
              !draft.info.prefix || !draft.info.channel || !draft.info.delivery
            }
          >
            Continuer →
          </Button>
        </div>
      </div>
    </div>
  );
}
