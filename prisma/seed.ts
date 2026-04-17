import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL no está configurado. Revisa tu .env");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "pablo@pablofuentes.org";
  const password = process.env.ADMIN_PASSWORD ?? "Admin12345!";
  const name = process.env.ADMIN_NAME ?? "Pablo Fuentes";
  const passwordHash = await bcrypt.hash(password, 12);

  console.log("→ Creando usuario admin…");
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: "ADMIN" },
    create: { email, name, passwordHash, role: "ADMIN" },
  });
  console.log(`   ${user.email}`);

  console.log("→ Categorías…");
  const categories = await Promise.all(
    [
      { name: "Redes", slug: "redes" },
      { name: "Backend", slug: "backend" },
      { name: "Telecom", slug: "telecom" },
      { name: "Sistemas", slug: "sistemas" },
    ].map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      }),
    ),
  );
  const cat = (slug: string) => categories.find((c) => c.slug === slug)!;

  console.log("→ Proyectos de ejemplo…");
  const projects = [
    {
      slug: "mesh-observability",
      title: "Mesh Observability",
      summary:
        "Monitoreo de redes MikroTik para ISPs pequeños — 120 routers, 11,000 suscriptores, alerta antes que el cliente llame.",
      description: `Construí esta plataforma para un WISP que perdía clientes cada vez que un radioenlace fallaba de madrugada.

La idea fue simple: pollear SNMP cada 10 segundos, guardar series de tiempo en TimescaleDB y disparar alertas contextuales por Telegram cuando algo salía del baseline.

La parte difícil no fue el dashboard. Fue domar los 120 routers que reportaban métricas en formatos levemente distintos según la versión del RouterOS. Acabé escribiendo un adaptador que normaliza antes de guardar — y eso solo ya cortó el 40% de los falsos positivos.

Hoy el MTTR bajó de 45 minutos a 6. Los clientes reciben un SMS con la ETA antes de alzar la mano.`,
      technologies: ["Next.js", "TimescaleDB", "Go", "SNMP", "Telegram", "Tailwind"],
      repoUrl: null,
      liveUrl: null,
      featured: true,
      order: 1,
    },
    {
      slug: "nodo-saas",
      title: "Nodo SaaS",
      summary:
        "Plataforma multi-tenant para facturación electrónica española. Empezó siendo un script y terminó procesando 180k facturas VERI*FACTU al mes.",
      description: `Un cliente pedía “solo un pequeño sistema para emitir facturas electrónicas”. Seis meses después era multi-tenant, con colas, retry exponencial, y un panel para cada uno de sus 24 clientes finales.

Core en NestJS con PostgreSQL. BullMQ para colas de envío porque los servicios de la AEAT se caen más de lo que admiten. Cada tenant vive en su propio schema para poder migrar datos sin tocar a los demás.

La lección más cara: no mezclar lógica fiscal con la UI. Cuando la AEAT publicó el borrador de VERI*FACTU, pude responder con un deploy en vez de un mes de patches.`,
      technologies: ["NestJS", "PostgreSQL", "BullMQ", "Redis", "Docker", "Prisma"],
      repoUrl: null,
      liveUrl: null,
      featured: true,
      order: 2,
    },
    {
      slug: "fiber-planner",
      title: "Fiber Planner",
      summary:
        "Herramienta interna para planear despliegues de fibra — KMZ en entrada, órdenes de trabajo en salida, sin abrir AutoCAD.",
      description: `Herramienta nacida de una frustración: los técnicos pasaban tardes enteras pasando datos de KMZ a Excel a órdenes de trabajo.

Ahora cargan el KMZ, la app detecta nodos, splitters y rutas, calcula atenuación esperada y genera la OT en PDF. Integración con el ERP vía webhooks para no duplicar captura.

Frontend en React con Mapbox. Backend en Python (shapely es insuperable para manipular geometría). Despliegue en Docker sobre un VPS modesto — 4 GB de RAM y sobra.`,
      technologies: ["React", "Mapbox", "Python", "FastAPI", "PostGIS", "Docker"],
      repoUrl: null,
      liveUrl: null,
      featured: true,
      order: 3,
    },
    {
      slug: "sip-router-dashboard",
      title: "SIP Router Dashboard",
      summary:
        "Visor en tiempo real de llamadas SIP sobre Kamailio. Útil cuando una empresa te dice “se cortan las llamadas” y no sabes por dónde empezar.",
      description: `Panel que se conecta al socket de Kamailio y grafica llamadas activas, CPS, ASR y NER por ruta.

Hecho originalmente para una troncal SIP que tenía problemas intermitentes con un operador. En dos días identificamos que el operador retornaba 486 con rate inusual solo entre 11 y 13 horas — probablemente saturación de su lado. Con el dato, renegociaron el contrato.

Backend en Go, WebSockets al navegador, frontend con D3.`,
      technologies: ["Go", "Kamailio", "WebSockets", "D3.js"],
      repoUrl: null,
      liveUrl: null,
      featured: false,
      order: 4,
    },
    {
      slug: "homelab-k3s",
      title: "Homelab K3s",
      summary:
        "Mi laboratorio casero — 3 nodos Raspberry Pi, Tailscale, GitOps con ArgoCD. Donde pruebo antes de cobrar.",
      description: `Cluster K3s sobre 3 Raspberry Pi 4 en la bodega, accesible desde fuera vía Tailscale.

Todo lo que aprendo nuevo lo pongo aquí primero. Monitoring con kube-prometheus-stack, ingress con Traefik, secretos con sealed-secrets. GitOps puro: el repo es la fuente de verdad.

Es simple a propósito. Si algo no entra en un Helm chart decente, probablemente no debería estar corriendo en producción todavía.`,
      technologies: ["Kubernetes", "K3s", "ArgoCD", "Tailscale", "Prometheus", "Raspberry Pi"],
      repoUrl: null,
      liveUrl: null,
      featured: false,
      order: 5,
    },
    {
      slug: "ledger-cli",
      title: "Ledger CLI",
      summary:
        "Contabilidad personal en texto plano con categorías, presupuestos y export a Excel. Git-friendly.",
      description: `No encontraba una app de finanzas que no me pidiera conectar mi banco a un servicio gringo con TOS raros.

Hice una CLI en Rust que lee archivos .ledger (sintaxis propia) y saca reportes. Presupuesto mensual, alertas cuando una categoría se dispara, export a CSV para llevar al contador.

Lleva tres años cubriendo mis finanzas. Cero bugs en producción porque literalmente son archivos de texto.`,
      technologies: ["Rust", "SQLite", "clap"],
      repoUrl: null,
      liveUrl: null,
      featured: false,
      order: 6,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        ...p,
        authorId: user.id,
      },
      create: {
        ...p,
        authorId: user.id,
      },
    });
    console.log(`   ${p.slug}`);
  }

  console.log("→ Posts de ejemplo…");
  const posts = [
    {
      slug: "postgres-indices-que-si-sirven",
      title: "Los índices de Postgres que sí sirven (y los que te hacen perder tiempo)",
      excerpt:
        "Revisión rápida sobre cuándo usar B-tree, GIN, BRIN y por qué ese EXPLAIN ANALYZE sigue tardando tres segundos.",
      content: `Todos hemos visto el EXPLAIN que dice "Seq Scan" y corremos a crear un índice. A veces funciona. Muchas veces no cambia nada.

## Por qué crear un índice puede ser contraproducente

Un índice no es gratis. Postgres tiene que mantenerlo en cada INSERT, UPDATE y DELETE. Si tu tabla recibe 2,000 escrituras por segundo y tu query solo se ejecuta cien veces al día, quizá el índice está costando más de lo que ahorra.

## B-tree — el que casi siempre quieres

Para igualdades, rangos y ORDER BY. Es el default y para 90% de los casos es correcto.

### Tip: índices compuestos no son conmutativos

Un índice en (a, b) sirve para WHERE a = ? AND b = ? y para WHERE a = ?, pero NO para WHERE b = ?.

## GIN — para arrays, JSONB y full-text

Si tu columna es jsonb y consultas @> para contención, GIN es la única opción seria.

## BRIN — el tapado

Cuando tienes una tabla enorme con datos ordenados físicamente (por ejemplo, logs por fecha de inserción), BRIN ocupa el 1% del espacio de un B-tree y responde casi igual de rápido para rangos.

## La regla de oro

Mide antes. Mide después. Si no mejoró, tira el índice.`,
      published: true,
      categoryId: cat("backend").id,
      readingTime: 4,
    },
    {
      slug: "bgp-sesion-caida-a-las-3am",
      title: "Sesión BGP caída a las 3 AM — y cómo no volver a pasarlo",
      excerpt:
        "Historia corta: un hold-timer mal configurado, un keepalive perdido, y cuatro horas de propagación. Lo que aprendí.",
      content: `Una noche de enero, una sesión BGP entre mi AS y un peer cayó. No avisó nadie porque el monitoreo solo validaba que el proceso estuviera corriendo, no que la sesión estuviera "Established".

## Lo que pasó

El peer subió un cambio de hardware con un hold-timer de 30 segundos. El mío estaba en 180. Postgres del lado ajeno reiniciaba una sesión SSH cada minuto y medio — coincidencia suficiente para que un keepalive se perdiera y la sesión se fuera a "Idle".

## Por qué tardó tanto en detectarse

Tenía alertas en Zabbix, pero basadas en conteo de rutas en tabla RIB. Cuando el peer cae, sus rutas siguen anunciadas por IBGP desde el otro edge durante hasta 3 horas antes de que la memoria caché se limpie. El dashboard decía "todo verde".

## Lo que cambié

Ahora alerto sobre el estado de la sesión directamente — bgpPeerState == 6 o FATAL. Y además verifico latencia end-to-end desde dos lados. Si las rutas existen pero el RTT subió 300ms, algo pasó.

## El mantra

Monitorear lo que el usuario final experimenta, no lo que tu consola dice que está bien.`,
      published: true,
      categoryId: cat("redes").id,
      readingTime: 5,
    },
    {
      slug: "prisma-postgres-adapter",
      title: "Prisma 7 y adapters — por qué vale la pena migrar ya",
      excerpt:
        "El nuevo sistema de adapters de Prisma 7 quita la dependencia del engine binario. Spoiler: cold start más rápido.",
      content: `Prisma 6 usaba un binario en Rust para hablar con la base de datos. Servía bien, pero cada cold start tardaba ~300ms solo en levantar el engine.

## El cambio

Prisma 7 introduce adapters — pasas tu propio driver (pg, mysql2, etc.) y Prisma lo envuelve. El binario Rust desaparece.

## Cómo se ve

\`\`\`ts
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
\`\`\`

## Qué me gustó

Cold start baja a ~50ms en serverless. Puedo usar el mismo cliente pg para pooling externo (PgBouncer). No más problemas de compatibilidad de arquitectura en Docker multi-arch.

## Pega que te vas a topar

El generator cambió de nombre: era prisma-client-js, ahora es prisma-client y el output se va a un folder tuyo. Toca actualizar imports en todo el proyecto.

Vale la pena.`,
      published: true,
      categoryId: cat("backend").id,
      readingTime: 3,
    },
  ];

  const now = Date.now();
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        published: p.published,
        categoryId: p.categoryId,
        readingTime: p.readingTime,
        authorId: user.id,
      },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        published: p.published,
        publishedAt: new Date(now - i * 1000 * 60 * 60 * 24 * 7),
        categoryId: p.categoryId,
        readingTime: p.readingTime,
        authorId: user.id,
      },
    });
    console.log(`   ${p.slug}`);
  }

  console.log("✔ Seed completo.");
  console.log(`\nLogin:\n  email:    ${email}\n  password: ${password}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
