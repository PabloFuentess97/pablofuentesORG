import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/admin/post-form";
import { updatePost } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar post · Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!post) notFound();

  const boundAction = updatePost.bind(null, post.id);

  return (
    <div className="space-y-6 max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1">
        <Link href="/admin/posts">
          <ArrowLeft className="h-4 w-4" /> Posts
        </Link>
      </Button>
      <div>
        <h2 className="font-heading text-2xl font-bold">Editar post</h2>
        <p className="text-sm text-muted-foreground">{post.title}</p>
      </div>
      <PostForm
        action={boundAction}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          categoryName: post.category?.name,
          published: post.published,
        }}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
