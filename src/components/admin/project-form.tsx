"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProjectData = {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  technologies?: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured?: boolean;
  published?: boolean;
  order?: number;
};

type ActionState = { error?: string } | null;

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: ProjectData;
  submitLabel?: string;
};

export function ProjectForm({ action, initial, submitLabel = "Guardar" }: Props) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    null,
  );
  const [pending, start] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(() => formAction(data));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 max-w-3xl">
      <div className="grid gap-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initial?.title ?? ""}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug (opcional)</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="Se genera del título"
            defaultValue={initial?.slug ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="order">Orden</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={initial?.order ?? 0}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="summary">Resumen corto *</Label>
        <Input
          id="summary"
          name="summary"
          required
          maxLength={240}
          placeholder="Una línea para las tarjetas"
          defaultValue={initial?.summary ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Descripción completa *</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={8}
          placeholder="Párrafos separados por línea en blanco"
          defaultValue={initial?.description ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="technologies">Tecnologías (separadas por coma)</Label>
        <Input
          id="technologies"
          name="technologies"
          placeholder="Next.js, PostgreSQL, Prisma"
          defaultValue={initial?.technologies?.join(", ") ?? ""}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="repoUrl">URL del repo</Label>
          <Input
            id="repoUrl"
            name="repoUrl"
            type="url"
            defaultValue={initial?.repoUrl ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="liveUrl">URL en vivo</Label>
          <Input
            id="liveUrl"
            name="liveUrl"
            type="url"
            defaultValue={initial?.liveUrl ?? ""}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="imageUrl">URL de imagen (mockup, opcional)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={initial?.imageUrl ?? ""}
        />
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initial?.featured ?? false}
            className="h-4 w-4 rounded border-border"
          />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? true}
            className="h-4 w-4 rounded border-border"
          />
          Publicado
        </label>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
