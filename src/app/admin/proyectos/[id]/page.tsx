import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProject } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar proyecto · Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const boundAction = updateProject.bind(null, project.id);

  return (
    <div className="space-y-6 max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1">
        <Link href="/admin/proyectos">
          <ArrowLeft className="h-4 w-4" /> Proyectos
        </Link>
      </Button>
      <div>
        <h2 className="font-heading text-2xl font-bold">Editar proyecto</h2>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </div>
      <ProjectForm
        action={boundAction}
        initial={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description,
          technologies: project.technologies,
          repoUrl: project.repoUrl,
          liveUrl: project.liveUrl,
          imageUrl: project.imageUrl,
          featured: project.featured,
          published: project.published,
          order: project.order,
        }}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
