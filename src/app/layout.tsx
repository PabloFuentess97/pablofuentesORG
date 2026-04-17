import type { Metadata } from "next";
import { Space_Grotesk, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const fontHeading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const fontSans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pablo Fuentes — Programación, Redes y Sistemas",
    template: "%s · Pablo Fuentes",
  },
  description:
    "Ingeniería de software, telecomunicaciones y redes. Construyo sistemas que resisten tráfico real y equipos que lo operan.",
  keywords: [
    "Pablo Fuentes",
    "programación",
    "telecomunicaciones",
    "redes",
    "sistemas",
    "SaaS",
    "Next.js",
    "DevOps",
  ],
  authors: [{ name: "Pablo Fuentes", url: siteUrl }],
  creator: "Pablo Fuentes",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Pablo Fuentes",
    title: "Pablo Fuentes — Programación, Redes y Sistemas",
    description:
      "Construyo software y redes que funcionan bajo carga. Notas, proyectos y contacto directo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pablo Fuentes",
    description: "Programación, telecomunicaciones y redes.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fontHeading.variable} ${fontSans.variable} ${fontMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
