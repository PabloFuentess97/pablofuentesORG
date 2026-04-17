"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/app/admin/actions";

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();

  function handle() {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    start(async () => {
      const res = await deleteProject(id);
      if (res && "error" in res && res.error) toast.error(res.error);
      else toast.success("Proyecto eliminado.");
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handle}
      disabled={pending}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="h-3.5 w-3.5" /> Eliminar
    </Button>
  );
}
