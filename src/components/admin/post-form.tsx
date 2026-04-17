"use client";

import { useActionState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PostData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  categoryName?: string;
  published?: boolean;
};

type ActionState = { error?: string } | null;

type Props = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: PostData;
  submitLabel?: string;
};

export function PostForm({ action, initial, submitLabel = "Guardar" }: Props) {
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
          <Input id="slug" name="slug" defaultValue={initial?.slug ?? ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="categoryName">Categoría</Label>
          <Input
            id="categoryName"
            name="categoryName"
            placeholder="Redes, Backend, Telecom..."
            defaultValue={initial?.categoryName ?? ""}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="excerpt">Resumen *</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          maxLength={300}
          defaultValue={initial?.excerpt ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content">Contenido *</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={16}
          placeholder="Markdown ligero: ## Título, ### Subtítulo, ```código```, y párrafos separados por línea en blanco."
          defaultValue={initial?.content ?? ""}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Párrafos separados por línea en blanco. <code>## Título</code>,{" "}
          <code>### Subtítulo</code>, y bloques de código entre <code>```</code>.
        </p>
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? false}
            className="h-4 w-4 rounded border-border"
          />
          Publicar ahora
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
