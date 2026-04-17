import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");

  return (
    <AdminShell
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
      }}
    >
      {children}
    </AdminShell>
  );
}
