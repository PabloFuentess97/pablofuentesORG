import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL, isResendEnabled } from "@/lib/resend";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(80).optional(),
  source: z.string().max(40).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Correo inválido. Revisa el formato." },
      { status: 400 },
    );
  }

  const { email, name, source } = parsed.data;

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.unsubscribedAt) {
        await prisma.subscriber.update({
          where: { email },
          data: { unsubscribedAt: null, confirmed: true },
        });
        return NextResponse.json({ ok: true, status: "resubscribed" });
      }
      return NextResponse.json({ ok: true, status: "already_subscribed" });
    }

    await prisma.subscriber.create({
      data: {
        email,
        name,
        source: source ?? "site",
        confirmed: true,
      },
    });

    // Welcome email (best-effort)
    if (isResendEnabled() && resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Bienvenido — Pablo Fuentes",
          html: welcomeHtml(name),
        });
      } catch (err) {
        console.warn("[newsletter] welcome email failed:", err);
      }
    }

    return NextResponse.json({ ok: true, status: "subscribed" });
  } catch (err) {
    console.error("[newsletter] failed:", err);
    return NextResponse.json(
      { error: "No pudimos guardar tu correo. Intenta más tarde." },
      { status: 500 },
    );
  }
}

function welcomeHtml(name?: string) {
  const greeting = name ? `Hola ${name},` : "Hola,";
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0A1628">
      <h1 style="font-family:'Space Grotesk',sans-serif;margin:0 0 8px;color:#2563EB">Gracias por suscribirte</h1>
      <p>${greeting}</p>
      <p>Te escribiré una vez al mes con notas sobre programación, redes y sistemas. Nada de spam.</p>
      <p>Si quieres darte de baja, responde este correo y te saco a mano.</p>
      <p style="margin-top:24px">— Pablo</p>
    </div>
  `;
}
