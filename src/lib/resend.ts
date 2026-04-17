import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "noreply@pablofuentes.org";

export const NOTIFY_EMAIL =
  process.env.CONTACT_NOTIFY_EMAIL ?? "pablo@pablofuentes.org";

export function isResendEnabled(): boolean {
  return resend !== null;
}
