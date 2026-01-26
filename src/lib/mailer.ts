import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM;

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

let transporterConfig: any;

if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
  transporterConfig = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  };
} else {
  transporterConfig = {
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  };
}

export const transporter = nodemailer.createTransport(transporterConfig);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const isSmtpConfigured = SMTP_HOST && SMTP_USER && SMTP_PASSWORD;
  const isGmailConfigured = GMAIL_USER && GMAIL_APP_PASSWORD;

  if (!isSmtpConfigured && !isGmailConfigured) {
    console.warn("⚠️ [Mailer] Configuration email manquante (SMTP ou GMAIL)");
    return { success: false, error: "Configuration email manquante" };
  }

  const from = SMTP_FROM || (isSmtpConfigured ? `"D3D Dashboard" <${SMTP_USER}>` : `"D3D Dashboard" <${GMAIL_USER}>`);

  try {
    const info = await transporter.sendMail({
      from,
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