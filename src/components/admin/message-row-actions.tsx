"use client";

import { useTransition } from "react";
import { Check, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markMessageRead, deleteMessage } from "@/app/admin/actions";

export function MessageRowActions({ id, read }: { id: string; read: boolean }) {
  const [pending, start] = useTransition();

  function toggleRead() {
    start(async () => {
      const res = await markMessageRead(id, !read);
      if (res && "error" in res && res.error) toast.error(res.error);
    });
  }

  function remove() {
    if (!confirm("¿Eliminar este mensaje?")) return;
    start(async () => {
      const res = await deleteMessage(id);
      if (res && "error" in res && res.error) toast.error(res.error);
      else toast.success("Mensaje eliminado.");
    });
  }

  return (
    <div className="inline-flex gap-1">
      <Button variant="outline" size="sm" onClick={toggleRead} disabled={pending}>
        {read ? (
          <>
            <Mail className="h-3.5 w-3.5" /> Marcar no leído
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5" /> Marcar leído
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={remove}
        disabled={pending}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
