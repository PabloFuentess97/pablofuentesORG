"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { removeSubscriber, deleteSubscriber } from "@/app/admin/actions";

export function SubscriberRowActions({
  id,
  email,
  active,
}: {
  id: string;
  email: string;
  active: boolean;
}) {
  const [pending, start] = useTransition();

  function softDelete() {
    start(async () => {
      const res = await removeSubscriber(id);
      if (res && "error" in res && res.error) toast.error(res.error);
      else toast.success("Suscriptor marcado como baja.");
    });
  }

  function hardDelete() {
    if (!confirm(`Eliminar ${email} permanentemente?`)) return;
    start(async () => {
      const res = await deleteSubscriber(id);
      if (res && "error" in res && res.error) toast.error(res.error);
      else toast.success("Eliminado.");
    });
  }

  return (
    <div className="inline-flex gap-1">
      {active && (
        <Button variant="ghost" size="sm" onClick={softDelete} disabled={pending}>
          Dar de baja
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={hardDelete}
        disabled={pending}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        Eliminar
      </Button>
    </div>
  );
}
