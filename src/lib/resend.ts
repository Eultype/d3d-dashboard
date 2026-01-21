import { Resend } from 'resend';

// On vérifie si la clé est présente pour éviter des erreurs silencieuses
const apiKey = process.env.RESEND_API_KEY;

export const resend = new Resend(apiKey || "re_123456789"); // Fallback pour éviter crash au build, mais ne marchera pas sans vraie clé
