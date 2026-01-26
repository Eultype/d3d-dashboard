"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/mailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const ResellerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  companyName: z.string().optional(),
  prefix: z.string().min(2, "Le préfixe doit faire au moins 2 caractères").toUpperCase(),
  phone: z.string().optional(),
  vatNumber: z.string().optional(),
  addressLine1: z.string().min(1, "L'adresse est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis"),
});

export type ResellerInput = z.infer<typeof ResellerSchema>;

export async function createReseller(data: ResellerInput) {
  // BLINDAGE SÉCURITÉ
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Non autorisé. Droits administrateur requis." };
  }

  const validation = ResellerSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { name, email, companyName, prefix, phone, vatNumber, addressLine1, postalCode, city, country } = validation.data;

  try {
    // 1. Vérifier existence
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { success: false, message: "Email déjà utilisé." };

    const existingPrefixUser = await prisma.user.findFirst({ where: { prefix } });
    if (existingPrefixUser) return { success: false, message: `Préfixe ${prefix} déjà pris.` };

    // 2. Génération token invitation
    const invitationToken = randomBytes(32).toString('hex');
    const invitationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    // Mot de passe bidon pour satisfaire la contrainte DB
    const dummyPassword = await bcrypt.hash(randomBytes(20).toString('hex'), 10);

    // 3. Création DB (User + Sequence)
    await prisma.user.create({
      data: { 
        email, 
        password: dummyPassword, 
        role: "REVENDEUR", 
        prefix,
        name,
        companyName,
        phone,
        vatNumber,
        addressLine1,
        postalCode,
        city,
        country,
        isActive: false,
        invitationToken,
        invitationExpires
      },
    });

    const existingSequence = await prisma.sequence.findUnique({ where: { id: prefix } });
    if (!existingSequence) {
        await prisma.sequence.create({ data: { id: prefix, currentValue: 0 } });
    }
    
    // 4. ENVOI DU MAIL (Via Nodemailer / SMTP)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteUrl = `${baseUrl}/invite/${invitationToken}`;

    const htmlContent = `
      <div style="font-family: sans-serif; background-color: #ffffff; padding: 20px; color: #484848;">
        <div style="max-width: 560px; margin: 0 auto;">
          <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Bienvenue, ${name}</h1>
          <p style="font-size: 16px; line-height: 26px; margin-bottom: 20px;">
            Votre compte revendeur D3D a été créé. Pour activer votre compte et définir votre mot de passe, veuillez cliquer sur le lien ci-dessous :
          </p>
          <div style="padding: 24px; background-color: #f2f3f3; border-radius: 4px; margin: 24px 0; font-size: 16px; text-align: center;">
            <a href="${inviteUrl}" style="background-color: #000000; border-radius: 5px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 12px 24px;">
              Activer mon compte
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

    const emailResult = await sendEmail({
      to: email,
      subject: 'Invitation : Activez votre compte D3D',
      html: htmlContent,
    });

    if (!emailResult.success) {
      console.error("Erreur envoi mail:", emailResult.error);
      return { success: true, emailError: true, message: "Compte créé mais échec de l'envoi du mail (Config Gmail ?)." };
    }

    // Notification pour info@2d3d.be
    await sendEmail({
      to: "info@2d3d.be",
      subject: `Nouveau revendeur inscrit : ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">Nouveau revendeur ajouté</h2>
          <p>Un administrateur a ajouté un nouveau revendeur :</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Nom :</strong> ${name}</li>
            <li><strong>Email :</strong> ${email}</li>
            <li><strong>Société :</strong> ${companyName || 'Non renseigné'}</li>
            <li><strong>Préfixe :</strong> ${prefix}</li>
            <li><strong>Ville :</strong> ${city}</li>
            <li><strong>Pays :</strong> ${country}</li>
          </ul>
        </div>
      `
    });

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