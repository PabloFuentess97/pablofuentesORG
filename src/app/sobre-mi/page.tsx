import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MonogramAvatar } from "@/components/monogram-avatar";
import {
  Calendar,
  Code2,
  Network,
  Radio,
  Server,
  Database,
  ShieldCheck,
  Workflow,
  Cpu,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Sobre Pablo Fuentes — ingeniero de software, telecomunicaciones y redes. Mi historia, mi stack y cómo trabajo.",
};

const TECH = {
  Programación: ["TypeScript", "Node.js", "Python", "Go", "Rust", "PHP"],
  Frameworks: ["Next.js", "NestJS", "Express", "FastAPI", "Laravel"],
  "Bases de datos": ["PostgreSQL", "Redis", "MongoDB", "SQLite", "ClickHouse"],
  Infraestructura: ["Linux", "Docker", "Kubernetes", "Terraform", "Proxmox", "Nginx"],
  Redes: ["Cisco IOS", "MikroTik", "pfSense", "WireGuard", "BGP", "VLAN", "QoS"],
  Telecom: ["Fibra óptica", "Radioenlaces", "VoIP/SIP", "GPON", "Ethernet"],
};

const TIMELINE = [
  {
    year: "2024 — hoy",
    title: "Consultor independiente",
    body:
      "Diseño e implemento backends, redes y sistemas para clientes que no quieren gastar en un equipo interno completo.",
  },
  {
    year: "2020 — 2024",
    title: "Lead de infraestructura",
    body:
      "Llevé una plataforma SaaS de 200 a 40,000 usuarios. Migración a Kubernetes, observabilidad seria, presupuesto de nube a la mitad.",
  },
  {
    year: "2016 — 2020",
    title: "Ingeniero de redes senior",
    body:
      "Despliegues de fibra, radioenlaces y troncales SIP. Aprendí que el cable físico también tiene bugs.",
  },
  {
    year: "2012 — 2016",
    title: "Desarrollador full-stack",
    body:
      "Construí de todo: e-commerce, dashboards, integraciones, scripts. Empecé a entender por qué una query mal hecha tira un servidor.",
  },
];

export default function SobreMiPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <MonogramAvatar size={120} className="rounded-3xl" />
            <div>
              <Badge variant="secondary" className="border border-primary/20 bg-primary/5 text-primary">
                Pablo Fuentes
              </Badge>
              <h1 className="mt-4 font-heading text-4xl sm:text-5xl font-bold tracking-tight">
                Llevo más de una década haciendo que las cosas{" "}
                <span className="text-primary">hablen entre sí</span>.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Empecé con un Pentium II y un módem que desconectaba el
                teléfono. Hoy diseño backends distribuidos, redes corporativas y
                sistemas que corren 24/7. El fondo sigue siendo el mismo: me
                gusta entender por qué algo no funciona y arreglarlo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Cómo trabajo
            </h2>
            <ul className="mt-4 space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <Workflow className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                <span>
                  Primero el diagrama. Si no cabe en una servilleta, probablemente
                  el problema todavía no está claro.
                </span>
              </li>
              <li className="flex gap-3">
                <Terminal className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                <span>
                  Escribo el código más simple que resuelve el caso real — no el
                  más genérico que resuelve los 17 casos hipotéticos.
                </span>
              </li>
              <li className="flex gap-3">
                <Cpu className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                <span>
                  Mido antes de optimizar. La mitad de los problemas de performance
                  desaparecen al ver el profiler.
                </span>
              </li>
              <li className="flex gap-3">
                <Calendar className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                <span>
                  Entrego en iteraciones semanales visibles. Nada de “te aviso en
                  dos meses cuando esté listo”.
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Lo que no hago
            </h2>
            <ul className="mt-4 space-y-4 text-muted-foreground">
              <li>— Proyectos sin alcance definido ni criterio de éxito.</li>
              <li>— “Reescribir todo desde cero porque sí”.</li>
              <li>— Usar una tecnología porque está de moda, si la existente funciona.</li>
              <li>— Prometer cosas que no he construido antes.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Stack actual
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Lo que uso hoy. El inventario cambia — las herramientas son medios,
            no credos.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(TECH).map(([section, items]) => (
              <Card key={section} className="border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <SectionIcon name={section} />
                    <h3 className="font-heading font-semibold">{section}</h3>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Experiencia
          </h2>
          <ol className="mt-8 relative border-l border-border/60 space-y-8">
            {TIMELINE.map((t) => (
              <li key={t.year} className="pl-6">
                <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <p className="text-xs uppercase tracking-wider text-primary font-medium">
                  {t.year}
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold">
                  {t.title}
                </h3>
                <p className="mt-1 text-muted-foreground">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function SectionIcon({ name }: { name: string }) {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    Programación: Code2,
    Frameworks: Code2,
    "Bases de datos": Database,
    Infraestructura: Server,
    Redes: Network,
    Telecom: Radio,
    Seguridad: ShieldCheck,
  };
  const Icon = map[name] ?? Cpu;
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
      <Icon className="h-4 w-4" />
    </span>
  );
}
