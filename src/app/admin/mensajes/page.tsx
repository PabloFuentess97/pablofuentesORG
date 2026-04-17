import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils-site";
import { MessageRowActions } from "@/components/admin/message-row-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mensajes · Admin" };

export default async function AdminMensajesPage() {
  const [messages, unread] = await Promise.all([
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.message.count({ where: { read: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">Mensajes</h2>
          <p className="text-sm text-muted-foreground">
            {unread} sin leer · {messages.length} total
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">
            <p>No hay mensajes todavía.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {messages.map((m) => (
            <Card
              key={m.id}
              className={`border-border/60 ${!m.read ? "border-primary/40 bg-primary/5" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{m.name}</p>
                      {!m.read && (
                        <Badge variant="secondary" className="text-xs">
                          Nuevo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <a
                        href={`mailto:${m.email}`}
                        className="hover:text-primary"
                      >
                        {m.email}
                      </a>{" "}
                      · {formatDate(m.createdAt)}
                    </p>
                    {m.subject && (
                      <p className="mt-1 font-heading font-semibold">
                        {m.subject}
                      </p>
                    )}
                  </div>
                  <MessageRowActions id={m.id} read={m.read} />
                </div>
                <div className="mt-4 whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                  {m.message}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
