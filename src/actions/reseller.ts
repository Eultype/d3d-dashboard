"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/mailer"; // ✅ Changement ici : Nodemailer

const ResellerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  prefix: z.string().min(2, "Le préfixe doit faire au moins 2 caractères").toUpperCase(),
});

export type ResellerInput = z.infer<typeof ResellerSchema>;

export async function createReseller(data: ResellerInput) {
  const validation = ResellerSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { name, email, prefix } = validation.data;

  try {
    // 1. Vérifier existence
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { success: false, message: "Email déjà utilisé." };

    const existingPrefixUser = await prisma.user.findFirst({ where: { prefix } });
    if (existingPrefixUser) return { success: false, message: `Préfixe ${prefix} déjà pris.` };

    // 2. Génération mot de passe sécurisé
    const generatedPassword = randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 3. Création DB (Client + User + Sequence)
    let customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { name, email, isActive: true, addressLine1: "", city: "", country: "Belgique", postalCode: "" }
      });
    }

    await prisma.user.create({
      data: { email, password: hashedPassword, role: "REVENDEUR", prefix },
    });

    const existingSequence = await prisma.sequence.findUnique({ where: { id: prefix } });
    if (!existingSequence) {
        await prisma.sequence.create({ data: { id: prefix, currentValue: 0 } });
    }
    
    // 4. ENVOI DU MAIL (Via Nodemailer / Gmail)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const htmlContent = `
      <div style="font-family: sans-serif; background-color: #ffffff; padding: 20px; color: #484848;">
        <div style="max-width: 560px; margin: 0 auto;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Bienvenue, ${name}</h1>
          <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
            Votre compte revendeur D3D a été créé avec succès. Voici vos identifiants pour accéder à votre espace de commande :
          </p>
          <div style="padding: 24px; background-color: #f2f3f3; border-radius: 4px; margin: 24px 0; font-size: 16px;">
            <p style="margin: 0 0 10px;"><strong>Email :</strong> ${email}</p>
            <p style="margin: 0;"><strong>Mot de passe temporaire :</strong> ${generatedPassword}</p>
          </div>
          <a href="${baseUrl}" style="background-color: #000000; border-radius: 5px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; display: block; width: 100%; padding: 12px; margin-top: 20px; margin-bottom: 20px;">
            Se connecter au Dashboard
          </a>
          <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
            Pour des raisons de sécurité, nous vous conseillons de ne pas partager ces accès.
          </p>
          <p style="color: #8898aa; font-size: 12px; margin-top: 24px;">L'équipe D3D</p>
        </div>
      </div>
    `;

    const emailResult = await sendEmail({
      to: email,
      subject: 'Bienvenue sur D3D - Vos accès',
      html: htmlContent,
    });

    if (!emailResult.success) {
      console.error("Erreur envoi mail:", emailResult.error);
      return { success: true, emailError: true, message: "Compte créé mais échec de l'envoi du mail (Config Gmail ?)." };
    }

    revalidatePath("/dashboard/resellers");
    return { success: true }; 

  } catch (error) {
    console.error("Erreur création revendeur:", error);
    if (error instanceof Error) {
        return { success: false, message: `Erreur technique : ${error.message}` };
    }
    return { success: false, message: "Une erreur technique inconnue est survenue." };
  }
}
