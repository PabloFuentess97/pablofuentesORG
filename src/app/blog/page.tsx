import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/newsletter-form";
import { prisma } from "@/lib/prisma";
import { formatShortDate } from "@/lib/utils-site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notas sobre programación, redes y sistemas — sin hype, sin humo, con ejemplos reales.",
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof fetchPosts>> = [];
  try {
    posts = await fetchPosts();
  } catch (err) {
    console.warn("[blog] DB query failed:", err);
  }

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Blog
          </p>
          <h1 className="mt-2 font-heading text-4xl sm:text-5xl font-bold tracking-tight">
            Notas
          </h1>
          <p className="mt-4 text-muted-foreground">
            Lo que aprendo cuando algo se rompe en producción, cuando configuro
            una red nueva o cuando alguien pregunta “¿y por qué usas eso?”.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
            <p>No hay publicaciones todavía.</p>
            <p className="mt-1 text-sm">
              Cuando publique, aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="mt-12 divide-y divide-border/60 rounded-xl border border-border/60 bg-card/40">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group grid gap-2 p-6 transition-colors hover:bg-accent/50"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {p.category && (
                    <Badge variant="secondary" className="text-xs">
                      {p.category.name}
                    </Badge>
                  )}
                  {p.publishedAt && (
                    <time dateTime={p.publishedAt.toISOString()}>
                      {formatShortDate(p.publishedAt)}
                    </time>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {p.readingTime} min
                  </span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {p.title}
                </h2>
                <p className="text-muted-foreground">{p.excerpt}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-sm text-primary/80 group-hover:text-primary">
                  Leer <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-20 rounded-2xl border border-border/60 bg-muted/40 p-8">
          <h2 className="font-heading text-2xl font-bold">
            Recibe lo nuevo por correo
          </h2>
          <p className="mt-1 text-muted-foreground">
            Una nota al mes, directa a tu bandeja. Sin trackers raros.
          </p>
          <div className="mt-4 max-w-md">
            <NewsletterForm source="blog" compact />
          </div>
        </div>
      </div>
    </section>
  );
}

async function fetchPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
}
