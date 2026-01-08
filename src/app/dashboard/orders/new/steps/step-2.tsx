import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  onNext: () => void;
};

export default function StepOne({ onNext }: Props) {
  return (
    <div className="space-y-4">
      <Input placeholder="Nom du client" />
      <Input placeholder="Email du client" />

      <Button onClick={onNext}>Suivant</Button>
    </div>
  );
}
