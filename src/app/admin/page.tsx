import Link from "next/link";
import {
  Briefcase,
  FileText,
  Mail,
  Users,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatShortDate } from "@/lib/utils-site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [
    projects,
    publishedProjects,
    posts,
    publishedPosts,
    subscribers,
    activeSubscribers,
    messages,
    unreadMessages,
    recentMessages,
    recentSubscribers,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { unsubscribedAt: null } }),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold">Resumen</h2>
        <p className="text-sm text-muted-foreground">
          Lo más importante a simple vista.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Proyectos"
          value={projects}
          sub={`${publishedProjects} publicados`}
          href="/admin/proyectos"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <MetricCard
          label="Posts"
          value={posts}
          sub={`${publishedPosts} publicados`}
          href="/admin/posts"
          icon={<FileText className="h-4 w-4" />}
        />
        <MetricCard
          label="Suscriptores"
          value={activeSubscribers}
          sub={`${subscribers} total`}
          href="/admin/suscriptores"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          label="Mensajes"
          value={unreadMessages}
          sub={`${messages} total · ${unreadMessages} sin leer`}
          href="/admin/mensajes"
          icon={<Mail className="h-4 w-4" />}
          accent={unreadMessages > 0}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold">Mensajes recientes</h3>
              <Link
                href="/admin/mensajes"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Ver todo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Nada por ahora.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border/60">
                {recentMessages.map((m) => (
                  <li key={m.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      {!m.read && (
                        <Badge variant="secondary" className="text-xs">
                          Nuevo
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {m.email} · {formatShortDate(m.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {m.subject ?? m.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold">Nuevos suscriptores</h3>
              <Link
                href="/admin/suscriptores"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Ver todo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recentSubscribers.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Aún no hay suscriptores.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border/60">
                {recentSubscribers.map((s) => (
                  <li key={s.id} className="py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{s.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.source ?? "site"} · {formatShortDate(s.createdAt)}
                      </p>
                    </div>
                    {s.unsubscribedAt && (
                      <Badge variant="secondary" className="text-xs">
                        Baja
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  href,
  icon,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  href: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Link href={href}>
      <Card
        className={`border-border/60 transition-colors hover:border-primary/40 ${accent ? "border-primary/40" : ""}`}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm">{label}</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              {icon}
            </span>
          </div>
          <p className="mt-3 font-heading text-3xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
