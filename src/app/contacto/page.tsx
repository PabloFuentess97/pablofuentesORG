import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbeme para hablar de un proyecto, una consulta puntual o una colaboración.",
};

export default function ContactoPage() {
  return (
    <section>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Contacto
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
            Hablemos
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Escríbeme si tienes un proyecto en mente, una pregunta técnica o
            quieres ver si encajamos para trabajar juntos. Respondo en menos de
            24 horas hábiles.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Correo</p>
                <a
                  href="mailto:pablo@pablofuentes.org"
                  className="text-muted-foreground hover:text-primary"
                >
                  pablo@pablofuentes.org
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Ubicación</p>
                <p className="text-muted-foreground">España · Remoto</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Disponibilidad</p>
                <p className="text-muted-foreground">Lun — Vie · 9 a 18 h (CET/CEST)</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
            <ContactForm />
            <p className="mt-4 text-xs text-muted-foreground">
              Tus datos sólo se usan para responderte. Nada de listas de marketing
              compradas ni reventas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
