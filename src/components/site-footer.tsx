"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rss, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/brand-icons";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (pathname === "/login") return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="font-heading font-bold text-lg">
            pablofuentes<span className="text-primary">.org</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Notas y proyectos sobre programación, redes y sistemas. Sin hype ni
            humo — código que se va a producción y aguanta.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink href="https://github.com/" icon={<GitHubIcon className="h-4 w-4" />} label="GitHub" />
            <SocialLink href="https://linkedin.com/" icon={<LinkedInIcon className="h-4 w-4" />} label="LinkedIn" />
            <SocialLink href="https://twitter.com/" icon={<TwitterIcon className="h-4 w-4" />} label="Twitter" />
            <SocialLink href="/rss.xml" icon={<Rss className="h-4 w-4" />} label="RSS" />
            <SocialLink href="mailto:pablo@pablofuentes.org" icon={<Mail className="h-4 w-4" />} label="Email" />
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold font-heading">Navegación</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/">Inicio</Link></li>
            <li><Link className="hover:text-foreground" href="/sobre-mi">Sobre mí</Link></li>
            <li><Link className="hover:text-foreground" href="/proyectos">Proyectos</Link></li>
            <li><Link className="hover:text-foreground" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-foreground" href="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-sm font-semibold font-heading">Newsletter</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Una nota al mes. Cosas reales que aprendí construyendo. Cero relleno.
          </p>
          <div className="mt-3">
            <NewsletterForm source="footer" compact />
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} Pablo Fuentes</p>
          <p>
            Desarrollado por{" "}
            <Link
              href="https://uxea.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Uxea Soluciones
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
    >
      {icon}
    </Link>
  );
}
