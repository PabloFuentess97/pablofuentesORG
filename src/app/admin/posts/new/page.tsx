import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/admin/post-form";
import { createPost } from "@/app/admin/actions";

export const metadata = { title: "Nuevo post · Admin" };

export default function NewPostPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1">
        <Link href="/admin/posts">
          <ArrowLeft className="h-4 w-4" /> Posts
        </Link>
      </Button>
      <div>
        <h2 className="font-heading text-2xl font-bold">Nuevo post</h2>
        <p className="text-sm text-muted-foreground">
          Escribe algo que valga la pena.
        </p>
      </div>
      <PostForm action={createPost} submitLabel="Crear post" />
    </div>
  );
}
