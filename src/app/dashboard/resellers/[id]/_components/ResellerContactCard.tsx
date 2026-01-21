import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResellerContactCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          Coordonnées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:gap-24 lg:gap-12 xl:gap-24">
          <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
            <span className="text-right font-semibold ">Nom / Prénom</span>
            <div className="row-span-3 w-[2px] self-stretch bg-gray-300" />
            <span>{user.name}</span>

            <span className="text-right font-semibold ">Email</span>
            <span>{user.email}</span>

            <span className="text-right font-semibold ">Téléphone</span>
            <span>{user.phone}</span>

            <span className="text-right font-semibold ">Entreprise</span>
            <div className="row-span-2 w-[2px] self-stretch bg-gray-300" />
            <span>
              {user.companyName?.trim() ? (
                user.companyName
              ) : (
                <span className="italic text-muted-foreground">
                  Particulier
                </span>
              )}
            </span>

            <span className="text-right font-semibold ">Numéro de TVA</span>
            <span>
              {user.vatNumber?.trim() ? (
                user.vatNumber
              ) : (
                <span className="text-muted-foreground">❌</span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-[140px_2px_1fr] items-center gap-x-4 gap-y-4">
            <span className="text-right font-semibold ">Ligne 1</span>
            <div className="row-span-5 w-[2px] self-stretch bg-gray-300" />
            <span>{user.addressLine1}</span>

            <span className="text-right text-muted-foreground">Ligne 2</span>
            <span>
              {user.addressLine2?.trim() ? (
                user.addressLine2
              ) : (
                <span className="italic text-muted-foreground">Maison</span>
              )}
            </span>

            <span className="text-right font-semibold ">Code postal</span>
            <span>{user.postalCode}</span>

            <span className="text-right font-semibold ">Ville</span>
            <span>{user.city}</span>

            <span className="text-right font-semibold ">Pays</span>
            <span>{user.country}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
