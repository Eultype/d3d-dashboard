import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

type Props = {
  onNext: () => void;
};

export default function StepOne({ onNext }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-row">
        <Field>
          <FieldLabel htmlFor="select-prefix">
            Préfixe de la commande
          </FieldLabel>
          <Select>
            <SelectTrigger className="w-2xl pl-10">
              <SelectValue
                id="select-prefix"
                placeholder="Sélectionner un préfixe"
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
          <FieldLabel htmlFor="select-canal">Canal de réception</FieldLabel>
          <Select>
            <SelectTrigger className="w-2xl pl-10">
              <SelectValue
                id="select-canal"
                placeholder="Sélectionner un canal"
              />
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

      <Button onClick={onNext}>Suivant</Button>
    </div>
  );
}
