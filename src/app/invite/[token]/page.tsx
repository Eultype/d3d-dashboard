import { checkInvitation } from "@/actions/invite";
import { InviteForm } from "./invite-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const verification = await checkInvitation(token);

  if (!verification.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md bg-white text-black shadow-xl border-none">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-bold text-center text-destructive">Invitation Invalide</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4 text-center space-y-4">
            <p className="text-muted-foreground">
              {verification.message || "Ce lien d'invitation est invalide ou a expiré."}
            </p>
            <Button asChild className="w-full h-11 bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <InviteForm token={token} email={verification.email!} name={verification.name} />
    </div>
  );
}
