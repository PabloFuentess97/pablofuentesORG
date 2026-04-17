import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils-site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return { title: "Post no encontrado" };
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return { title: "Post" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: { category: true, author: true },
    });
  } catch (err) {
    console.warn("[post] DB query failed:", err);
  }

  if (!post || !post.published) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <Button asChild variant="ghost" size="sm" className="gap-1 -ml-3">
        <Link href="/blog">
          <ArrowLeft className="h-4 w-4" /> Todas las notas
        </Link>
      </Button>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category.name}
            </Badge>
          )}
          {post.publishedAt && (
            <time dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingTime} min
          </span>
          {post.author?.name && <span>por {post.author.name}</span>}
        </div>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
      </header>

      <div className="mt-12 text-foreground/90 leading-relaxed">
        {paragraphs.map((para, i) => {
          if (para.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="mt-10 font-heading text-2xl font-bold tracking-tight"
              >
                {para.replace(/^##\s+/, "")}
              </h2>
            );
          }
          if (para.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="mt-8 font-heading text-xl font-semibold tracking-tight"
              >
                {para.replace(/^###\s+/, "")}
              </h3>
            );
          }
          if (para.startsWith("```")) {
            const code = para.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
            return (
              <pre
                key={i}
                className="mt-6 overflow-x-auto rounded-lg border border-border/60 bg-muted/60 p-4 font-mono text-sm"
              >
                <code>{code}</code>
              </pre>
            );
          }
          return (
            <p key={i} className="mt-5">
              {para}
            </p>
          );
        })}
      </div>
    </article>
  );
}
