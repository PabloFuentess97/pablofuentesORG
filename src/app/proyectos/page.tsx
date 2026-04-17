import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, ExternalLink, Star } from "lucide-react";
import { GitHubIcon } from "@/components/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos recientes de Pablo Fuentes — SaaS, redes, infraestructura y automatización.",
};

export default async function ProyectosPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn("[proyectos] DB query failed:", err);
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Portafolio
          </p>
          <h1 className="mt-2 font-heading text-4xl sm:text-5xl font-bold tracking-tight">
            Proyectos
          </h1>
          <p className="mt-4 text-muted-foreground">
            Una selección de cosas que construí — algunas siguen vivas, otras
            fueron experimentos que enseñaron más de lo que produjeron. No está
            todo aquí, pero sí lo que vale la pena mostrar.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="mt-16 rounded-xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
            <p>Todavía no hay proyectos publicados.</p>
            <p className="mt-1 text-sm">
              Agrega el primero desde{" "}
              <Link href="/admin/proyectos" className="text-primary underline">
                el panel admin
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.id} href={`/proyectos/${p.slug}`} className="group">
                <Card className="h-full overflow-hidden border-border/60 transition-all hover:border-primary/40 hover:-translate-y-0.5">
                  <div className="relative h-44 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent">
                    <div className="absolute inset-0 bg-dots opacity-40" />
                    {p.featured && (
                      <Badge className="absolute top-3 right-3 gap-1 bg-background/80 backdrop-blur text-primary border border-primary/20">
                        <Star className="h-3 w-3" /> Destacado
                      </Badge>
                    )}
                    <div className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 backdrop-blur text-primary ring-1 ring-border/60">
                      <Cpu className="h-5 w-5" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h2 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {p.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 4).map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      {p.repoUrl && (
                        <span className="inline-flex items-center gap-1">
                          <GitHubIcon className="h-3.5 w-3.5" /> Código
                        </span>
                      )}
                      {p.liveUrl && (
                        <span className="inline-flex items-center gap-1">
                          <ExternalLink className="h-3.5 w-3.5" /> En vivo
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
