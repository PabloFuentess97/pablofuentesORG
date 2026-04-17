<div align="center">

# pablofuentes.org

Marca personal, portafolio, blog, newsletter, contacto y panel admin en una sola app.
Stack moderno, despliegue con Docker, listo para un VPS.

</div>

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend & Backend | **Next.js 16** (App Router) · **React 19** · **TypeScript** |
| Estilos | **Tailwind CSS 4** · **shadcn/ui** (Radix) · `next-themes` |
| Base de datos | **PostgreSQL 16** |
| ORM | **Prisma 7** (adapter `@prisma/adapter-pg`) |
| Autenticación | **NextAuth v5** (Credentials + JWT) |
| Emails | **Resend** (welcome + notificación de contacto) |
| Validación | **Zod** |
| Contenedores | **Docker** + **docker-compose** |

---

## Estructura

```
.
├── prisma/
│   ├── schema.prisma         # Modelos: User, Post, Project, Category, Subscriber, Message
│   └── seed.ts               # Admin + 6 proyectos + 3 posts de ejemplo
├── src/
│   ├── app/
│   │   ├── (public)/         # Home, sobre-mi, proyectos, blog, contacto
│   │   ├── admin/            # Dashboard + CRUD — protegido por middleware
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── contact/
│   │   │   ├── health/       # /api/health → JSON liveness + DB check
│   │   │   └── newsletter/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── icon.tsx          # Favicon generado (monograma PF)
│   ├── auth.ts               # NextAuth config (node runtime)
│   ├── auth.config.ts        # Config edge-safe (middleware)
│   ├── proxy.ts              # Protege /admin/*
│   ├── components/
│   └── lib/
├── Dockerfile                # Multi-stage, output standalone, usuario no root
├── docker-compose.yml        # web + db + red interna + healthchecks
├── docker-entrypoint.sh      # prisma migrate deploy → node server.js
├── nginx/pablofuentes.conf   # Reverse proxy + HTTPS (ejemplo)
├── .env.example
└── .dockerignore
```

---

## Variables de entorno

Copia `.env.example` a `.env` y rellena. Resumen de las importantes:

| Variable | Dónde | Notas |
|---|---|---|
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Docker Compose | Credenciales del contenedor Postgres. |
| `DATABASE_URL` | App | En Docker, el host es `db`; en local, `localhost`. |
| `AUTH_SECRET` | App | 32+ bytes aleatorios. `openssl rand -base64 32`. |
| `AUTH_URL` | App | URL pública completa (https en prod). |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Seed | El primer usuario se crea con esto. |
| `RESEND_API_KEY` | Emails | Opcional. Si falta, los emails se omiten silenciosamente. |
| `NEXT_PUBLIC_SITE_URL` | Metadata | URL canónica para OG tags. |

**Nunca** comitees `.env`. `.env.example` es la plantilla que sí se sube al repo.

---

## Desarrollo local

### Opción 1 — PostgreSQL local (sin Docker)

```bash
# 1. Dependencias
npm install

# 2. Configura .env con tu Postgres
cp .env.example .env

# 3. Aplica schema + siembra datos de ejemplo
npm run db:push
npm run db:seed

# 4. Servidor dev
npm run dev
```

### Opción 2 — Todo con Docker

```bash
cp .env.example .env
docker compose up -d --build

# Siembra admin + ejemplos
docker compose exec web node node_modules/prisma/build/index.js db seed
```

Abrir:
- Sitio: http://localhost:3000
- Login admin: http://localhost:3000/login (credenciales del `.env`)
- Panel: http://localhost:3000/admin
- Healthcheck: http://localhost:3000/api/health

---

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Dev server con HMR |
| `npm run build` | `prisma generate` + build estándar (standalone) |
| `npm run start` | Sirve el build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenera el cliente Prisma |
| `npm run db:migrate` | Crea + aplica migración (dev) |
| `npm run db:deploy` | `prisma migrate deploy` (prod) |
| `npm run db:push` | Empuja schema sin migraciones |
| `npm run db:seed` | Siembra datos (admin + proyectos + posts) |
| `npm run db:studio` | Abre Prisma Studio |

---

## Despliegue en VPS (Ubuntu 22.04+)

### 1. Preparar el VPS

```bash
# Usuario no-root con sudo (si aún no tienes)
adduser deploy && usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
su - deploy

# Firewall básico
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Instalar Docker + Compose (oficial)

```bash
# Quita versiones viejas
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do
  sudo apt-get remove -y $pkg || true
done

# Repos de Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Permiso para no usar sudo en cada comando (cierra y vuelve a abrir sesión después)
sudo usermod -aG docker $USER
```

### 3. Clonar y configurar

```bash
git clone https://github.com/PabloFuentess97/pablofuentesORG.git
cd pablofuentesORG

cp .env.example .env
# Edita .env con valores de PRODUCCIÓN:
#   - POSTGRES_PASSWORD fuerte
#   - AUTH_SECRET = openssl rand -base64 32
#   - AUTH_URL    = https://pablofuentes.org
#   - NEXT_PUBLIC_SITE_URL = https://pablofuentes.org
#   - RESEND_API_KEY si vas a mandar emails
nano .env
```

### 4. Levantar

```bash
# Build + arranque — la primera vez tarda unos minutos
docker compose up -d --build

# Ver logs en vivo (Ctrl+C para salir)
docker compose logs -f web

# Siembra inicial (solo la primera vez)
docker compose exec web node node_modules/prisma/build/index.js db seed
```

La app escucha en `127.0.0.1:3000` (solo desde la propia máquina). Nginx termina TLS y proxea.

### 5. Nginx + HTTPS con Let's Encrypt

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Copia el sample de este repo y ajusta server_name
sudo cp nginx/pablofuentes.conf /etc/nginx/sites-available/pablofuentes.conf
sudo ln -s /etc/nginx/sites-available/pablofuentes.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # quita el bienvenida default
sudo nginx -t && sudo systemctl reload nginx

# Certificado — reemplaza el dominio
sudo certbot --nginx -d pablofuentes.org -d www.pablofuentes.org \
  --email pablo@pablofuentes.org --agree-tos --redirect --non-interactive

# Certbot programa la renovación automática. Verifica:
sudo systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

**Apuntar el dominio:** en tu registrador, crea un registro **A** `pablofuentes.org → IP_DEL_VPS` y otro **A** `www.pablofuentes.org → IP_DEL_VPS`. Espera propagación (5-30 min) antes de ejecutar `certbot`.

### 6. Mantenimiento

```bash
# Ver estado
docker compose ps
docker compose logs --tail=200 web

# Actualizar a una nueva versión
git pull
docker compose up -d --build
# El entrypoint aplica `prisma migrate deploy` automáticamente.

# Reiniciar solo el servicio web
docker compose restart web

# Backup de la base (hazlo frecuente — pon un cron)
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | \
  gzip > "backup-$(date +%F).sql.gz"

# Restaurar
gunzip -c backup-2026-04-17.sql.gz | \
  docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

# Parar todo
docker compose down

# Parar y BORRAR el volumen de la DB (⚠ destructivo)
docker compose down -v
```

---

## Seguridad

La app ya trae activado por defecto:

- Contraseñas con **bcrypt** (cost 12).
- Sesiones **JWT** firmadas con `AUTH_SECRET`.
- Middleware (`src/proxy.ts`) redirige `/admin/*` a `/login` sin sesión.
- Rate-limit básico en `/api/contact` (5 msgs/hora por IP, IP hasheada SHA-256).
- Honeypot en formulario de contacto.
- Validación Zod en todos los endpoints.
- Headers de seguridad (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) definidos en `next.config.ts`.
- Puerto `3000` y `5432` **NO** expuestos públicamente — solo a loopback / red interna.
- Imagen Docker corre como usuario no-root.
- Sin registro público: el admin se crea vía `db seed`.

Checklist adicional para el VPS:

- [ ] `ufw` habilitado (solo 22, 80, 443)
- [ ] SSH con claves (desactiva password auth en `/etc/ssh/sshd_config`)
- [ ] `fail2ban` instalado
- [ ] `unattended-upgrades` activo
- [ ] Backups de Postgres a un sitio externo (S3, rclone, etc.)
- [ ] Monitoreo del healthcheck: `curl https://pablofuentes.org/api/health`

---

## Commits sugeridos (inicial)

```bash
git add .
git commit -m "chore: initial commit — pablofuentes.org stack"

git commit -m "feat: prisma schema + seed con admin y 6 proyectos de ejemplo"
git commit -m "feat: landing pública (home, sobre-mi, proyectos, blog, contacto)"
git commit -m "feat: admin CRUD (proyectos, posts, suscriptores, mensajes)"
git commit -m "feat: auth con NextAuth v5 y middleware para /admin"
git commit -m "feat: API routes newsletter + contact con Resend opcional"
git commit -m "feat: dockerfile multi-stage + compose con postgres"
git commit -m "docs: readme con despliegue en VPS y nginx + letsencrypt"
```

---

## Licencia

MIT. Úsalo como quieras — es tuyo.
