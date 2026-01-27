"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createEmployee } from "@/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function NewEmployeeForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    try {
      const result = await createEmployee(data);
      if (result.success) {
        toast.success("Employé ajouté avec succès !");
        router.push("/dashboard/team");
      } else {
        toast.error(result.message || "Erreur lors de l'ajout.");
      }
    } catch (error) {
      toast.error("Erreur technique.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Nom complet</FieldLabel>
            <Input id="name" name="name" placeholder="Ex: Marc Lavoine" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email professionnel</FieldLabel>
            <Input id="email" name="email" type="email" placeholder="marc@2d3d.be" required />
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-[150px]">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création...
            </>
          ) : (
            "Ajouter à l'équipe"
          )}
        </Button>
      </div>
    </form>
  );
}
