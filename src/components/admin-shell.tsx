"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  Users,
  LogOut,
  Menu,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/proyectos", label: "Proyectos", icon: Briefcase },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/suscriptores", label: "Suscriptores", icon: Users },
  { href: "/admin/mensajes", label: "Mensajes", icon: Mail },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name: string | null; email: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5 border-b border-border/60">
        <Link href="/admin" className="flex items-center gap-2 font-heading font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Terminal className="h-4 w-4" />
          </span>
          <span>Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" /> Ver sitio
        </Link>
        <div className="rounded-lg border border-border/60 p-3 text-xs">
          <p className="font-medium truncate">{user.name ?? "Admin"}</p>
          <p className="text-muted-foreground truncate">{user.email ?? ""}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" /> Salir
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-border/60 bg-card">
        {sidebar}
      </aside>

      {/* Top bar */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Menú admin</SheetTitle>
                {sidebar}
              </SheetContent>
            </Sheet>
            <h1 className="font-heading font-semibold text-sm">Panel</h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
