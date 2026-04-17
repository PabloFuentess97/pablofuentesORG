"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();

  function handle() {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    start(async () => {
      const res = await deletePost(id);
      if (res && "error" in res && res.error) toast.error(res.error);
      else toast.success("Post eliminado.");
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
