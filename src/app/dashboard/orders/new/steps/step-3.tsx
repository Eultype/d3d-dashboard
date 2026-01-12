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

export default function StepOne({ onNext, onBack, currentStep = 3 }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="pb-2">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Form Title */}
      <div className="pb-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Produits de la commande
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Ajoutez les produits avec leurs options
        </p>
      </div>
      {/* Form Fields */}
      <div className="flex flex-col space-y-6  ">
        {/* Ligne 1 */}
        <div className="flex justify-center items-center space-y-7 gap-6 ">
          <Field>
            <FieldLabel htmlFor="select-prefix">
              Sélectionner un produit *
            </FieldLabel>
            <Select>
              <SelectTrigger className="w-full pl-4 h-12">
                <SelectValue
                  id="select-prefix"
                  placeholder="Sélectionner un produit à ajouter"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coeur">Coeur - 55,00 €</SelectItem>
                <SelectItem value="pra">
                  PRA (Prisma Allongé) - 85,00 €
                </SelectItem>
                <SelectItem value="prc">
                  PRC (Prisma Carrée) - 65,00 €
                </SelectItem>
                <SelectItem value="rectangle_grand">
                  Rectangle grand - 75,00 €
                </SelectItem>
                <SelectItem value="rectangle_petit">
                  Rectangle petit - 45,00 €
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Button>+</Button>
        </div>

        {/* Ligne 2 */}
        <Field>
          <FieldLabel>Mode De Livraison *</FieldLabel>
          <Select>
            <SelectTrigger className="w-full pl-4  h-12">
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
