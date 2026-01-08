// components/StepOne.tsx (or wherever your component is)
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

type Props = {
  onNext: () => void;
  onBack?: () => void;
  currentStep?: number;
};

const steps = [
  { number: 1, label: "Infos" },
  { number: 2, label: "Client" },
  { number: 3, label: "Produits" },
  { number: 4, label: "Recap" },
];

export default function StepOne({ onNext, onBack, currentStep = 2 }: Props) {
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
            <Select>
              <SelectTrigger className="w-full pl-4 pr-10 h-12">
                <SelectValue
                  id="select-prefix"
                  placeholder="Sélectionner Un Préfixe"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bog">BOG - Atelier Bogny</SelectItem>
                <SelectItem value="eric">ERIC - Eric</SelectItem>
                <SelectItem value="web">WEB - Site Web</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="select-canal">Canal De Réception *</FieldLabel>
            <Select>
              <SelectTrigger className="w-full pl-4 pr-10 h-12">
                <SelectValue id="select-canal" placeholder="Atelier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atelier">Atelier</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="shopify">Shopify</SelectItem>
                <SelectItem value="web">Site Web</SelectItem>
                <SelectItem value="phone">Téléphone</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Ligne 2 */}
        <Field>
          <FieldLabel>Mode De Livraison *</FieldLabel>
          <Select>
            <SelectTrigger className="w-full pl-4 pr-10 h-12">
              <SelectValue placeholder="Retrait Atelier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atelier">Retrait Atelier</SelectItem>
              <SelectItem value="livraison">Livraison</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <Button onClick={onBack}>← Retour</Button>
          <Button onClick={onNext}>Continuer →</Button>
        </div>
      </div>
    </div>
  );
}
