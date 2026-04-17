import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Terminal } from "lucide-react";
import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main className="min-h-screen grid place-items-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 font-heading font-bold text-lg"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Terminal className="h-4 w-4" />
          </span>
          pablofuentes<span className="text-primary">.org</span>
        </Link>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Panel admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acceso privado. Solo para el dueño del sitio.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Volver al sitio?{" "}
          <Link href="/" className="text-primary hover:underline">
            Ir a inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
