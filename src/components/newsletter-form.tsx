"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  source?: string;
  compact?: boolean;
  className?: string;
};

export function NewsletterForm({ source = "site", compact = false, className }: Props) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "No se pudo guardar tu correo. Intenta de nuevo.");
        return;
      }
      toast.success("Listo. Te escribo la próxima vez que publique algo.");
      setEmail("");
    } catch {
      toast.error("Algo falló del lado de la red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex w-full gap-2",
        compact ? "flex-col sm:flex-row" : "flex-col",
        className,
      )}
    >
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-9 bg-background"
          aria-label="Correo electrónico"
        />
      </div>
      <Button type="submit" disabled={loading} className={compact ? "" : "w-full"}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando
          </>
        ) : (
          "Suscribirme"
        )}
      </Button>
    </form>
  );
}
