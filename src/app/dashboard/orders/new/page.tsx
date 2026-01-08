import OrderForm from "./form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Nouvelle commande</h1>
      <div
        className="mx-auto flex self-center justify-center"
        style={{ width: "50%", margin: "auto" }}
      >
        <Card className="w-full">
          <CardContent className="pt-6">
            <OrderForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
