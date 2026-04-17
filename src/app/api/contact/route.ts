import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  resend,
  FROM_EMAIL,
  NOTIFY_EMAIL,
  isResendEnabled,
} from "@/lib/resend";
import { hashIp } from "@/lib/utils-site";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(10).max(5000),
  website: z.string().optional().nullable(), // honeypot
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
      { error: "Revisa los campos del formulario." },
      { status: 400 },
    );
  }

  // Honeypot — if filled, bots
  if (parsed.data.website && parsed.data.website.trim() !== "") {
    return NextResponse.json({ ok: true }); // Silently drop
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  try {
    // Basic rate limit: no more than 5 messages from same IP in the last hour
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await prisma.message.count({
      where: { ipHash: hashIp(ip), createdAt: { gte: since } },
    });
    if (recent >= 5) {
      return NextResponse.json(
        { error: "Demasiados mensajes. Intenta en una hora." },
        { status: 429 },
      );
    }

    const msg = await prisma.message.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        subject: parsed.data.subject?.trim() || null,
        message: parsed.data.message.trim(),
        ipHash: hashIp(ip),
      },
    });

    if (isResendEnabled() && resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          replyTo: msg.email,
          subject: `[Contacto] ${msg.subject ?? "Nuevo mensaje"} — ${msg.name}`,
          html: `
            <div style="font-family:Inter,system-ui,sans-serif;max-width:560px">
              <p><strong>De:</strong> ${escapeHtml(msg.name)} &lt;${escapeHtml(msg.email)}&gt;</p>
              <p><strong>Asunto:</strong> ${escapeHtml(msg.subject ?? "(sin asunto)")}</p>
              <hr />
              <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(msg.message)}</pre>
            </div>
          `,
        });
      } catch (err) {
        console.warn("[contact] notify email failed:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed:", err);
    return NextResponse.json(
      { error: "No pudimos guardar tu mensaje. Intenta más tarde." },
      { status: 500 },
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
