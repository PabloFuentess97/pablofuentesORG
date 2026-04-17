import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatShortDate } from "@/lib/utils-site";
import { SubscriberRowActions } from "@/components/admin/subscriber-row-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Suscriptores · Admin" };

export default async function AdminSuscriptoresPage() {
  const [subs, active, total] = await Promise.all([
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.subscriber.count({ where: { unsubscribedAt: null } }),
    prisma.subscriber.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold">Suscriptores</h2>
          <p className="text-sm text-muted-foreground">
            {active} activos · {total} total
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0 overflow-x-auto">
          {subs.length === 0 ? (
            <p className="p-10 text-center text-muted-foreground">
              Aún no hay suscriptores.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {s.source ?? "site"}
                    </TableCell>
                    <TableCell>
                      {s.unsubscribedAt ? (
                        <Badge variant="secondary" className="text-xs">
                          Baja
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-primary/10 text-primary border border-primary/20">
                          Activo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatShortDate(s.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <SubscriberRowActions
                        id={s.id}
                        email={s.email}
                        active={!s.unsubscribedAt}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
