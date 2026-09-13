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
      <Link href="/" className="logo" aria-label="ProxiMolar, inicio"><span className="logo-mark"><Icono nombre="store" size={23}/></span>ProxiMolar<span className="logo-dot">.</span></Link>
      <nav aria-label="Navegación principal"><Link href="/comercios">Explorar negocios</Link><Link href="/#categorias" className="nav-secondary">Categorías</Link></nav>
      <Link href="/el-molar" className="location-link" aria-label="Guía de El Molar, Madrid"><Icono nombre="pin" size={17}/><span>El Molar, Madrid</span></Link>
    </div></header>
    <main id="contenido">{children}</main>
    <footer className="site-footer"><div className="container footer-top">
      <div><Link href="/" className="footer-brand">ProxiMolar.</Link><p>Tu guía local para descubrir comercios y profesionales de El Molar.</p><p className="footer-local">Hecho en El Molar · Cerca de ti</p></div>
      <nav aria-labelledby="footer-explora"><h2 id="footer-explora">Explora</h2><ul><li><Link href="/comercios">Negocios</Link></li><li><Link href="/el-molar">Guía de El Molar</Link></li><li><Link href="/#como-funciona">Cómo funciona</Link></li></ul></nav>
    </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} ProxiMolar</span></div></footer>
  </body></html>;
}
