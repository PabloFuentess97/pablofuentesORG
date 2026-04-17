import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "@/app/admin/actions";

export const metadata = { title: "Nuevo proyecto · Admin" };

export default function NewProjectPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1">
        <Link href="/admin/proyectos">
          <ArrowLeft className="h-4 w-4" /> Proyectos
        </Link>
      </Button>
      <div>
        <h2 className="font-heading text-2xl font-bold">Nuevo proyecto</h2>
        <p className="text-sm text-muted-foreground">
          Agrega un proyecto al portafolio.
        </p>
      </div>
      <ProjectForm action={createProject} submitLabel="Crear proyecto" />
    </div>
  );
}
