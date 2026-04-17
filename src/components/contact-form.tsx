"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body?.error ?? "No pude enviar tu mensaje. Intenta de nuevo.");
        return;
      }
      toast.success("Mensaje recibido. Te respondo hoy o mañana máximo.");
      form.reset();
    } catch {
      toast.error("Algo falló. ¿Probamos otra vez?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {/* Honeypot — hidden from humans */}
      <div aria-hidden="true" className="hidden">
        <Label htmlFor="website">Sitio web</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required autoComplete="name" placeholder="Tu nombre" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject">Asunto</Label>
        <Input id="subject" name="subject" placeholder="¿De qué quieres hablar?" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Cuéntame qué tienes en mente, contexto, plazos..."
        />
      </div>
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando
          </>
        ) : (
          "Enviar mensaje"
        )}
      </Button>
    </form>
  );
}
