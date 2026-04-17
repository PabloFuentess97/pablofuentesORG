import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
import { GitHubIcon } from "@/components/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils-site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) return { title: "Proyecto no encontrado" };
    return {
      title: project.title,
      description: project.summary,
    };
  } catch {
    return { title: "Proyecto" };
  }
}

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params;

  let project;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn("[proyecto] DB query failed:", err);
  }

  if (!project || !project.published) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <Button asChild variant="ghost" size="sm" className="gap-1 -ml-3">
        <Link href="/proyectos">
          <ArrowLeft className="h-4 w-4" /> Todos los proyectos
        </Link>
      </Button>

      <header className="mt-6">
        <div className="flex items-center gap-2">
          {project.featured && (
            <Badge className="gap-1 border border-primary/20 bg-primary/10 text-primary">
              <Star className="h-3 w-3" /> Destacado
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(project.createdAt)}
          </span>
        </div>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl font-bold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{project.summary}</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {project.technologies.map((t: string) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && (
          <Button asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Ver en vivo
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button asChild variant="outline">
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="h-4 w-4" /> Código fuente
            </a>
          </Button>
        )}
      </div>

      <div className="mt-12 relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
        {project.description.split("\n\n").map((para, i) => (
          <p key={i} className="mt-4 text-foreground/90 leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
