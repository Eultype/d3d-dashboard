import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn("⚠️ [Mailer] GMAIL_USER ou GMAIL_APP_PASSWORD manquant dans .env");
    return { success: false, error: "Configuration email manquante" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"D3D Dashboard" <${GMAIL_USER}>`, // Expéditeur
      to,
      subject,
      html,
    });
    console.log("✅ [Mailer] Email envoyé:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ [Mailer] Erreur envoi:", error);
    return { success: false, error };
  }
}
