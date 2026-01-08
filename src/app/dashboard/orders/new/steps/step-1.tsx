import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onNext: () => void;
};

export default function StepOne({ onNext }: Props) {
  return (
    <div className="space-y-4">
      <Input placeholder="Sélectionner un préfixe" />
      <Input placeholder="Email du client" />
      <Select className="">
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un préfixe" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="bog">BOG - Atelier Bogny</SelectItem>
          <SelectItem value="eric">ERIC - Eric</SelectItem>
          <SelectItem value="web">WEB - Site Web</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onNext}>Suivant</Button>
    </div>
  );
}
