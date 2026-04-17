"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify, estimateReadingTime } from "@/lib/utils-site";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  return session.user;
}

/* -------------------------- PROJECTS -------------------------- */

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  summary: z.string().min(1).max(240),
  description: z.string().min(1),
  technologies: z.string().optional(), // comma-separated
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  featured: z.union([z.literal("on"), z.literal("off")]).optional(),
  published: z.union([z.literal("on"), z.literal("off")]).optional(),
  order: z.coerce.number().int().default(0),
});

export async function createProject(_prev: unknown, formData: FormData) {
  const user = await requireAdmin();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Datos inválidos. Revisa los campos." };
  }
  const d = parsed.data;
  const slug = (d.slug && d.slug.trim()) || slugify(d.title);

  try {
    await prisma.project.create({
      data: {
        title: d.title.trim(),
        slug,
        summary: d.summary.trim(),
        description: d.description.trim(),
        technologies: parseTech(d.technologies),
        repoUrl: d.repoUrl || null,
        liveUrl: d.liveUrl || null,
        imageUrl: d.imageUrl || null,
        featured: d.featured === "on",
        published: d.published !== "off",
        order: d.order ?? 0,
        authorId: user.id,
      },
    });
  } catch (err) {
    console.error("[createProject]", err);
    return { error: "No se pudo crear. Quizá el slug ya existe." };
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
  redirect("/admin/proyectos");
}

export async function updateProject(
  id: string,
  _prev: unknown,
  formData: FormData,
) {
  await requireAdmin();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Datos inválidos." };
  }
  const d = parsed.data;
  const slug = (d.slug && d.slug.trim()) || slugify(d.title);

  try {
    await prisma.project.update({
      where: { id },
      data: {
        title: d.title.trim(),
        slug,
        summary: d.summary.trim(),
        description: d.description.trim(),
        technologies: parseTech(d.technologies),
        repoUrl: d.repoUrl || null,
        liveUrl: d.liveUrl || null,
        imageUrl: d.imageUrl || null,
        featured: d.featured === "on",
        published: d.published !== "off",
        order: d.order ?? 0,
      },
    });
  } catch (err) {
    console.error("[updateProject]", err);
    return { error: "No se pudo actualizar." };
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${slug}`);
  revalidatePath("/");
  redirect("/admin/proyectos");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  try {
    await prisma.project.delete({ where: { id } });
  } catch (err) {
    console.error("[deleteProject]", err);
    return { error: "No se pudo eliminar." };
  }
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
  return { ok: true };
}

/* -------------------------- POSTS -------------------------- */

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().min(1).max(300),
  content: z.string().min(1),
  categoryName: z.string().optional(),
  published: z.union([z.literal("on"), z.literal("off")]).optional(),
});

export async function createPost(_prev: unknown, formData: FormData) {
  const user = await requireAdmin();
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Datos inválidos." };
  const d = parsed.data;
  const slug = (d.slug && d.slug.trim()) || slugify(d.title);
  const published = d.published === "on";

  try {
    let categoryId: string | null = null;
    if (d.categoryName && d.categoryName.trim()) {
      const name = d.categoryName.trim();
      const catSlug = slugify(name);
      const existing = await prisma.category.findUnique({
        where: { slug: catSlug },
      });
      categoryId = existing
        ? existing.id
        : (await prisma.category.create({ data: { name, slug: catSlug } })).id;
    }

    await prisma.post.create({
      data: {
        title: d.title.trim(),
        slug,
        excerpt: d.excerpt.trim(),
        content: d.content,
        readingTime: estimateReadingTime(d.content),
        published,
        publishedAt: published ? new Date() : null,
        categoryId,
        authorId: user.id,
      },
    });
  } catch (err) {
    console.error("[createPost]", err);
    return { error: "No se pudo crear. Quizá el slug ya existe." };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/posts");
}

export async function updatePost(
  id: string,
  _prev: unknown,
  formData: FormData,
) {
  await requireAdmin();
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Datos inválidos." };
  const d = parsed.data;
  const slug = (d.slug && d.slug.trim()) || slugify(d.title);
  const published = d.published === "on";

  try {
    let categoryId: string | null = null;
    if (d.categoryName && d.categoryName.trim()) {
      const name = d.categoryName.trim();
      const catSlug = slugify(name);
      const existing = await prisma.category.findUnique({
        where: { slug: catSlug },
      });
      categoryId = existing
        ? existing.id
        : (await prisma.category.create({ data: { name, slug: catSlug } })).id;
    }

    const existing = await prisma.post.findUnique({ where: { id } });

    await prisma.post.update({
      where: { id },
      data: {
        title: d.title.trim(),
        slug,
        excerpt: d.excerpt.trim(),
        content: d.content,
        readingTime: estimateReadingTime(d.content),
        published,
        publishedAt:
          published && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null,
        categoryId,
      },
    });
  } catch (err) {
    console.error("[updatePost]", err);
    return { error: "No se pudo actualizar." };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireAdmin();
  try {
    await prisma.post.delete({ where: { id } });
  } catch (err) {
    console.error("[deletePost]", err);
    return { error: "No se pudo eliminar." };
  }
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath("/");
  return { ok: true };
}

/* -------------------------- SUBSCRIBERS -------------------------- */

export async function removeSubscriber(id: string) {
  await requireAdmin();
  try {
    await prisma.subscriber.update({
      where: { id },
      data: { unsubscribedAt: new Date() },
    });
  } catch (err) {
    console.error("[removeSubscriber]", err);
    return { error: "No se pudo marcar como baja." };
  }
  revalidatePath("/admin/suscriptores");
  return { ok: true };
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  try {
    await prisma.subscriber.delete({ where: { id } });
  } catch (err) {
    console.error("[deleteSubscriber]", err);
    return { error: "No se pudo eliminar." };
  }
  revalidatePath("/admin/suscriptores");
  return { ok: true };
}

/* -------------------------- MESSAGES -------------------------- */

export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  try {
    await prisma.message.update({ where: { id }, data: { read } });
  } catch (err) {
    console.error("[markMessageRead]", err);
    return { error: "No se pudo actualizar." };
  }
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  try {
    await prisma.message.delete({ where: { id } });
  } catch (err) {
    console.error("[deleteMessage]", err);
    return { error: "No se pudo eliminar." };
  }
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
  return { ok: true };
}

/* -------------------------- helpers -------------------------- */

function parseTech(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
