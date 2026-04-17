import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Network,
  Server,
  Radio,
  Database,
  ShieldCheck,
  Cpu,
  GitBranch,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MonogramAvatar } from "@/components/monogram-avatar";
import { NewsletterForm } from "@/components/newsletter-form";
import { prisma } from "@/lib/prisma";
import { formatShortDate } from "@/lib/utils-site";

export const dynamic = "force-dynamic";

const SKILLS = [
  {
    icon: Code2,
    title: "Programación",
    description:
      "TypeScript, Node.js, Python, Go. Construyo APIs, SaaS y scripts que nadie odia mantener seis meses después.",
  },
  {
    icon: Network,
    title: "Redes",
    description:
      "Routing, switching, VLANs, VPN, BGP. Diseño redes que escalan sin convertirse en arqueología el día que se caen.",
  },
  {
    icon: Radio,
    title: "Telecomunicaciones",
    description:
      "Fibra óptica, radioenlaces, VoIP, SIP. Llevar datos del punto A al B sin perder paquetes ni dinero.",
  },
  {
    icon: Server,
    title: "Sistemas",
    description:
      "Linux, Docker, Kubernetes, Proxmox. Infraestructura que se levanta a las 3 AM sin despertar a nadie.",
  },
  {
    icon: Database,
    title: "Datos",
    description:
      "PostgreSQL, Redis, diseño de esquemas, queries que no tardan 8 segundos. Datos normales, índices en serio.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad",
    description:
      "Hardening, firewalls, auth, secretos. Defensa en capas sin convertir todo en un bunker imposible de usar.",
  },
];

export default async function HomePage() {
  const [featuredProjects, recentPosts] = await Promise.all([
    safeQuery(() =>
      prisma.project.findMany({
        where: { published: true, featured: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: 3,
      }),
    ),
    safeQuery(() =>
      prisma.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { category: true },
      }),
    ),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        <div className="absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32 grid gap-12 md:grid-cols-12 items-center">
          <div className="md:col-span-7">
            <Badge
              variant="secondary"
              className="gap-1.5 border border-primary/20 bg-primary/5 text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Disponible para proyectos
            </Badge>
            <h1 className="mt-5 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Construyo{" "}
              <span className="text-primary">software y redes</span>{" "}
              que aguantan lo que les tiren.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Soy Pablo Fuentes. Programo, diseño redes y levanto sistemas desde
              hace más de una década. Aquí dejo las notas, los proyectos y una
              puerta abierta para trabajar juntos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/proyectos">
                  Ver proyectos
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contacto">Hablemos</Link>
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <Stat value="12+" label="años programando" />
              <Stat value="40+" label="proyectos vivos" />
              <Stat value="99.9%" label="de uptime buscado" />
            </dl>
          </div>

          <div className="md:col-span-5">
            <HeroAvatarCard />
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              En qué trabajo
            </p>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Seis áreas que se hablan entre sí
            </h2>
            <p className="mt-3 text-muted-foreground">
              Nada de esto vive aislado. Un backend lento casi siempre es una base
              de datos mal indexada, una red mal segmentada o un sistema sin
              observabilidad. Trabajo en todas las capas.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((s) => (
              <Card
                key={s.title}
                className="group relative overflow-hidden border-border/60 transition-colors hover:border-primary/40"
              >
                <CardContent className="p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  Proyectos
                </p>
                <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold tracking-tight">
                  Cosas que construí recientemente
                </h2>
              </div>
              <Button asChild variant="ghost" className="gap-1">
                <Link href="/proyectos">
                  Ver todos <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {featuredProjects.map((p) => (
                <Link key={p.id} href={`/proyectos/${p.slug}`} className="group">
                  <Card className="h-full overflow-hidden border-border/60 transition-all hover:border-primary/40 hover:-translate-y-0.5">
                    <div className="relative h-44 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
                      <div className="absolute inset-0 bg-dots opacity-40" />
                      <div className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-background/80 backdrop-blur text-primary ring-1 ring-border/60">
                        <Cpu className="h-5 w-5" />
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {p.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.technologies.slice(0, 3).map((t: string) => (
                          <Badge key={t} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECENT POSTS */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  Blog
                </p>
                <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold tracking-tight">
                  Notas recientes
                </h2>
              </div>
              <Button asChild variant="ghost" className="gap-1">
                <Link href="/blog">
                  Ver todas <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-0 divide-y divide-border/60 rounded-xl border border-border/60 bg-card/40">
              {recentPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-3 p-5 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {p.category && <span>{p.category.name}</span>}
                      {p.publishedAt && (
                        <>
                          <span>·</span>
                          <time dateTime={p.publishedAt.toISOString()}>
                            {formatShortDate(p.publishedAt)}
                          </time>
                        </>
                      )}
                      <span>·</span>
                      <span>{p.readingTime} min</span>
                    </div>
                    <h3 className="mt-1 font-heading text-lg font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {p.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-12">
            <div className="absolute inset-0 bg-dots opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
            <div className="relative grid gap-8 md:grid-cols-5 items-center">
              <div className="md:col-span-3">
                <GitBranch className="h-8 w-8 text-primary" />
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight">
                  Una nota al mes. Nada de spam.
                </h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Suscríbete si quieres leer lo que aprendo cuando algo se rompe
                  en producción. Puedes darte de baja con un click.
                </p>
              </div>
              <div className="md:col-span-2">
                <NewsletterForm source="home" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-heading text-2xl font-bold">{value}</dd>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </p>
    </div>
  );
}

function HeroAvatarCard() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-2xl" />
      <Card className="relative overflow-hidden border-border/60 bg-card/80 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <MonogramAvatar size={72} />
            <div>
              <p className="font-heading text-lg font-semibold">Pablo Fuentes</p>
              <p className="text-sm text-muted-foreground">
                Ingeniero de software y redes
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border/60 bg-background/60 p-4 font-mono text-xs">
            <p className="text-muted-foreground">~/about</p>
            <p className="mt-2">
              <span className="text-primary">$</span> whoami
            </p>
            <p className="mt-1">pablo.fuentes</p>
            <p className="mt-3">
              <span className="text-primary">$</span> cat skills.txt
            </p>
            <p className="mt-1 text-muted-foreground">
              backend, devops, networking,
              <br />
              telecom, postgres, linux
            </p>
            <p className="mt-3">
              <span className="text-primary">$</span> uptime
            </p>
            <p className="mt-1 text-muted-foreground">
              since 2012. mantenido a mano.
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border/60 p-3">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Ubicación
              </dt>
              <dd className="mt-1 font-medium">España · Remoto</dd>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Estado
              </dt>
              <dd className="mt-1 font-medium">Aceptando clientes</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

async function safeQuery<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    console.warn("[home] DB query failed:", err);
    return null;
  }
}
