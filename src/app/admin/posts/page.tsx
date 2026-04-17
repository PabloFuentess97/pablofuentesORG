import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { formatShortDate } from "@/lib/utils-site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Posts · Admin" };

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">Posts</h2>
          <p className="text-sm text-muted-foreground">
            Notas del blog. Los borradores no aparecen públicamente.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4" /> Nuevo post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">
            <p>Aún no hay posts.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {posts.map((p) => (
            <Card key={p.id} className="border-border/60">
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{p.title}</p>
                    {p.category && (
                      <Badge variant="secondary" className="text-xs">
                        {p.category.name}
                      </Badge>
                    )}
                    {p.published ? (
                      <Badge className="text-xs bg-primary/10 text-primary border border-primary/20">
                        Publicado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Borrador
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    /{p.slug} ·{" "}
                    {p.publishedAt
                      ? formatShortDate(p.publishedAt)
                      : formatShortDate(p.createdAt)}{" "}
                    · {p.readingTime} min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/posts/${p.id}`}>
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Link>
                  </Button>
                  <DeletePostButton id={p.id} title={p.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
