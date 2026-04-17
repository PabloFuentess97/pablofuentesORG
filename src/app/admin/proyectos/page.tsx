import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { formatShortDate } from "@/lib/utils-site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Proyectos · Admin" };

export default async function AdminProyectosPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">Proyectos</h2>
          <p className="text-sm text-muted-foreground">
            Administra el portafolio público.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/proyectos/new">
            <Plus className="h-4 w-4" /> Nuevo proyecto
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">
            <p>No hay proyectos todavía.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <Card key={p.id} className="border-border/60">
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{p.title}</p>
                    {p.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Destacado
                      </Badge>
                    )}
                    {!p.published && (
                      <Badge variant="outline" className="text-xs">
                        Borrador
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    /{p.slug} · {formatShortDate(p.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/proyectos/${p.id}`}>
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Link>
                  </Button>
                  <DeleteProjectButton id={p.id} title={p.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
