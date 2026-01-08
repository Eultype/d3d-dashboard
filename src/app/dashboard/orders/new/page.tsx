import OrderForm from "./form";

export default function NewOrderPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouvelle commande</h1>

      <OrderForm />
    </div>
  );
}
