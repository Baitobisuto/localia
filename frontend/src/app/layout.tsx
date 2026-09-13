import type { Metadata } from "next";
import Link from "next/link";
import { Icono } from "@/components/Icono";
import { sitio, indexable } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: sitio,
  title: { default: "ProxiMolar · Lo bueno está cerca", template: "%s | ProxiMolar" },
  description: "Descubre negocios locales en El Molar. Encuentra tiendas, restaurantes y servicios cerca de ti.",
  robots: { index: indexable, follow: true },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
};

// Mantiene la navegación, el acceso directo al contenido y el pie compartidos.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header"><div className="container header-inner">
      <Link href="/" className="logo" aria-label="ProxiMolar, inicio"><span className="logo-mark"><Icono nombre="store" size={23}/></span>proximolar<span className="logo-dot">.</span></Link>
      <nav aria-label="Navegación principal"><Link href="/comercios">Explorar negocios</Link><Link href="/#categorias" className="nav-secondary">Categorías</Link></nav>
      <Link href="/el-molar" className="location-link"><Icono nombre="pin" size={17}/><span>El Molar, Madrid</span></Link>
    </div></header>
    <main id="contenido">{children}</main>
    <footer className="site-footer"><div className="container footer-top">
      <div><Link href="/" className="logo">proximolar<span className="logo-dot">.</span></Link><p>La vida de tu pueblo, un poco más cerca.</p></div>
      <nav aria-label="Navegación del pie"><Link href="/comercios">Descubrir negocios</Link><Link href="/#categorias">Todas las categorías</Link><Link href="/#como-funciona">Sobre ProxiMolar</Link></nav>
    </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} ProxiMolar</span><span>Hecho para mirar cerca <Icono nombre="heart" size={14}/></span></div></footer>
  </body></html>;
}
