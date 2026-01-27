import { getTeamMembers } from "@/actions/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, UserCheck } from "lucide-react";
import { formatDateFR } from "@/lib/utils/dates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link> / <span className="text-foreground">Équipe</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Équipe</h1>
            <p className="text-sm text-muted-foreground">Gérez les accès administrateurs de la plateforme.</p>
          </div>
        </div>

        <Button asChild>
          <Link href="/dashboard/team/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un employé
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {/* VUE MOBILE : Liste de cartes (1 col mobile, 2 cols tablette) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:hidden">
          {members.map((m) => (
            <div key={m.id} className="rounded-lg border bg-card p-4 shadow-sm flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                <div className="flex items-center justify-between mb-3 gap-1">
                  <div className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[9px] font-bold">
                    ACTIF
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="font-bold text-sm text-foreground truncate">
                    {m.name ?? "Sans nom"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {m.email}
                  </p>
                  <p className="text-[9px] text-muted-foreground pt-1">
                    Ajouté le {formatDateFR(new Date(m.createdAt))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VUE DESKTOP : Tableau classique */}
        <div className="hidden xl:block overflow-hidden rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employé</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date d'ajout</TableHead>
                <TableHead className="text-right">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Aucun membre dans l'équipe.
                  </TableCell>
                </TableRow>
              )}
              {members.map((m) => (
                <TableRow key={m.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <span className="font-medium">{m.name || "—"}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {m.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Administrateur</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateFR(new Date(m.createdAt))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <div className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <UserCheck className="h-3 w-3" />
                        ACTIF
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
