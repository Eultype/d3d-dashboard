"use server";

import { prisma } from "@/lib/services/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const PasswordSchema = z.object({
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export async function checkInvitation(token: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { invitationToken: token },
      select: { email: true, invitationExpires: true, name: true }
    });

    if (!user) {
      return { success: false, message: "Invitation invalide ou introuvable." };
    }

    if (user.invitationExpires && user.invitationExpires < new Date()) {
      return { success: false, message: "L'invitation a expiré." };
    }

    return { success: true, email: user.email, name: user.name };
  } catch (error) {
    console.error("Erreur vérification invitation:", error);
    return { success: false, message: "Erreur technique." };
  }
}

export async function acceptInvitation(token: string, formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validation = PasswordSchema.safeParse({ password, confirmPassword });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { invitationToken: token },
    });

    if (!user) {
      return { success: false, message: "Invitation invalide." };
    }

    if (user.invitationExpires && user.invitationExpires < new Date()) {
      return { success: false, message: "L'invitation a expiré." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        invitationToken: null,
        invitationExpires: null,
        isActive: true, // Activate user if they were pending
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur acceptation invitation:", error);
    return { success: false, message: "Erreur technique lors de la mise à jour." };
  }
}
