"use server";

import { prisma } from "@/lib/services/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/services/mailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const EmployeeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
});

export type EmployeeInput = z.infer<typeof EmployeeSchema>;

export async function createEmployee(data: EmployeeInput) {
  // BLINDAGE SÉCURITÉ
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Non autorisé. Droits administrateur requis." };
  }

  const validation = EmployeeSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Données invalides." };
  }

  const { name, email } = validation.data;

  try {
    // 1. Vérifier existence
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { success: false, message: "Email déjà utilisé." };

    // 2. Génération token invitation
    const invitationToken = randomBytes(32).toString('hex');
    const invitationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    // Mot de passe bidon pour satisfaire la contrainte DB
    const dummyPassword = await bcrypt.hash(randomBytes(20).toString('hex'), 10);

    // 3. Création DB (User)
    await prisma.user.create({
      data: { 
        email, 
        password: dummyPassword, 
        role: "ADMIN",
        name,
        isActive: false, // Inactif jusqu'à l'activation du compte
        invitationToken,
        invitationExpires
      },
    });

    // 4. ENVOI DU MAIL (Même template que reseller.ts)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteUrl = `${baseUrl}/invite/${invitationToken}`;

    const htmlContent = `
      <div style="font-family: sans-serif; background-color: #ffffff; padding: 20px; color: #484848;">
        <div style="max-width: 560px; margin: 0 auto;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Bienvenue dans l'équipe, ${name}</h1>
          <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
            Votre compte administrateur D3D a été créé. Pour activer votre accès et définir votre mot de passe, veuillez cliquer sur le lien ci-dessous :
          </p>
          <div style="padding: 24px; background-color: #f2f3f3; border-radius: 4px; margin: 24px 0; font-size: 16px; text-align: center;">
            <a href="${inviteUrl}" style="background-color: #000000; border-radius: 5px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 12px 24px;">
              Activer mon accès administrateur
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Ce lien est valable 7 jours. Si vous ne pouvez pas cliquer sur le bouton, copiez ce lien :<br>
            <a href="${inviteUrl}" style="color: #000;">${inviteUrl}</a>
          </p>
          <p style="color: #8898aa; font-size: 12px; margin-top: 24px;">L'équipe D3D</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Invitation : Activez votre accès administrateur D3D',
      html: htmlContent,
    });

    revalidatePath("/dashboard/team");
    return { success: true }; 

  } catch (error) {
    console.error("Erreur création employé:", error);
    return { success: false, message: "Une erreur technique est survenue." };
  }
}

export async function getTeamMembers() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Non autorisé");
  }

  return prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      isActive: true
    }
  });
}