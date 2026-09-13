import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as esperar } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Evalúa los helpers reales con entornos aislados para comprobar dominios y protección de previews.
function cargarHelper(nombre, env, dependencias = {}) {
  const codigo = ts.transpileModule(readFileSync(new URL(`../src/lib/${nombre}.ts`, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(codigo, { exports, URL, process: { env }, require: nombre => dependencias[nombre] });
  return exports;
}
const enlaces = cargarHelper("enlaces", {});
for (const [env, permitido] of [
  [{ NODE_ENV: "development", INDEXABLE: "true" }, false],
  [{ NODE_ENV: "production" }, false],
  [{ NODE_ENV: "production", INDEXABLE: "true" }, true],
  [{ NODE_ENV: "production", VERCEL_ENV: "preview", INDEXABLE: "true" }, false],
  [{ NODE_ENV: "production", VERCEL_ENV: "development", INDEXABLE: "true" }, false],
  [{ NODE_ENV: "production", VERCEL_ENV: "production" }, true],
  [{ NODE_ENV: "production", VERCEL_ENV: "production", INDEXABLE: "false" }, false],
]) {
  const seo = cargarHelper("seo", { ...env, NEXT_PUBLIC_SITE_URL: "https://directorio.example" }, { "./enlaces": enlaces });
  assert.equal(seo.indexable, permitido);
  assert.equal(seo.crearMetadata("Título", "Descripción", "/el-molar").alternates.canonical, "https://directorio.example/el-molar");
}
assert.equal(cargarHelper("seo", {}, { "./enlaces": enlaces }).sitio.origin, "https://proximolar.es");
for (const dominio of ["https://directorio.example/ruta", "https://directorio.example?x=1", "https://directorio.example#fragmento", "ftp://directorio.example", "https://usuario:clave@directorio.example"]) {
  assert.throws(() => cargarHelper("seo", { NEXT_PUBLIC_SITE_URL: dominio }, { "./enlaces": enlaces }));
}

// Fixtures sintéticas exclusivas de esta prueba: jamás se importan desde la aplicación.
const municipio = { id: 1, nombre: "El Molar", slug: "el-molar" };
const categorias = [
  { id: 1, nombre: "Restauración", slug: "restauracion", icono: null },
  { id: 2, nombre: "Servicios profesionales", slug: "servicios-profesionales", icono: null },
  { id: 3, nombre: "Hogar y reparaciones", slug: "hogar-y-reparaciones", icono: null },
];
const comercios = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1, nombre: `Negocio de prueba ${i + 1}`, slug: `prueba-${i + 1}`, municipio,
  categoria: categorias[i < 2 || i > 4 ? 0 : i < 4 ? 1 : 2],
  descripcion: i === 6 ? null : "Descripción sintética para comprobar el renderizado y los criterios de publicación.",
  direccion: "Dirección ficticia de prueba", telefono: null, whatsapp: null,
  destacado: false, verificado: false, demo: i === 5, imagenPrincipal: null,
  codigoPostal: null, email: null, web: null, instagram: null, googleMapsUrl: null,
  fechaVerificacion: null, horarios: [], imagenes: [],
  fuentes: [{ tipoFuente: "OTRO", url: "https://example.org/fixture", fechaConsulta: "2026-01-01" }],
}));
let estado = "normal";

// Sirve casos controlados en loopback sin leer ni escribir la base de datos del proyecto.
const api = createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  respuesta.setHeader("Content-Type", "application/json");
  if (estado === "error") { respuesta.writeHead(503).end("{}"); return; }
  if (url.pathname === "/api/municipios") { respuesta.end(JSON.stringify([municipio])); return; }
  if (url.pathname === "/api/categorias") { respuesta.end(JSON.stringify(categorias)); return; }
  if (url.pathname === "/api/comercios") {
    const lista = estado === "vacio" ? [] : comercios.filter(c =>
      (!url.searchParams.get("categoria") || c.categoria.slug === url.searchParams.get("categoria"))
      && (!url.searchParams.get("municipio") || c.municipio.slug === url.searchParams.get("municipio")));
    respuesta.end(JSON.stringify(lista)); return;
  }
  const comercio = comercios.find(c => url.pathname.endsWith(`/comercios/${c.slug}`));
  respuesta.writeHead(comercio ? 200 : 404).end(JSON.stringify(comercio ?? {}));
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const reserva = createServer();
reserva.listen(0, "127.0.0.1");
await once(reserva, "listening");
const puerto = reserva.address().port;
await new Promise(resolve => reserva.close(resolve));
const base = `http://127.0.0.1:${puerto}`;
const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? "https://proximolar.es";
const frontend = fileURLToPath(new URL("../", import.meta.url));
let logs = "";
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(puerto)], {
  cwd: frontend, windowsHide: true,
  env: { ...process.env, API_URL: `http://127.0.0.1:${api.address().port}/api`, NEXT_PUBLIC_SITE_URL: sitio, NODE_ENV: "production", VERCEL_ENV: "production", INDEXABLE: "true", NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
next.stdout.on("data", dato => { logs += dato; });
next.stderr.on("data", dato => { logs += dato; });

// Lee el HTML del servidor con un agente sin streaming de metadata, sin ejecutar JavaScript.
async function leer(ruta, agente = "Googlebot") {
  const respuesta = await fetch(`${base}${ruta}`, { headers: { "User-Agent": agente }, redirect: "manual" });
  return { respuesta, html: await respuesta.text() };
}

// Extrae solo scripts JSON-LD reales, excluyendo los mensajes internos de React.
function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
}

try {
  for (let intento = 0; intento < 60; intento++) {
    if (next.exitCode !== null) throw new Error(logs);
    try { await fetch(`${base}/icon.svg`); break; } catch { await esperar(500); }
  }
  const sitemap = await leer("/sitemap.xml");
  assert.equal(sitemap.respuesta.status, 200);
  const rutas = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  assert.deepEqual(rutas, ["/", "/el-molar", "/el-molar/comercios", "/el-molar/restauracion", "/el-molar/profesionales", ...comercios.slice(0, 5).map(c => `/el-molar/comercios/${c.slug}`)]);
  assert.ok(!sitemap.html.includes("<lastmod>"));
  const titulos = new Set(), descripciones = new Set();
  for (const ruta of rutas) {
    const { respuesta, html } = await leer(ruta);
    assert.equal(respuesta.status, 200, ruta);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical && new URL(canonical).href, new URL(ruta, sitio).href, `Canonical ${ruta}`);
    assert.ok(html.includes('name="robots" content="index, follow"'), ruta);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, ruta);
    assert.ok(html.includes('property="og:url"') && html.includes('name="twitter:card"'), ruta);
    const titulo = html.match(/<title>(.*?)<\/title>/)?.[1];
    const descripcion = html.match(/name="description" content="(.*?)"/)?.[1];
    assert.ok(titulo && !titulos.has(titulo), `Título único: ${ruta}`); titulos.add(titulo);
    assert.ok(descripcion && !descripciones.has(descripcion), `Descripción única: ${ruta}`); descripciones.add(descripcion);
    if (ruta !== "/") assert.ok(schemas(html).some(s => s["@type"] === "BreadcrumbList"), ruta);
  }
  const home = (await leer("/")).html;
  assert.ok(schemas(home).some(s => s["@graph"]?.some(n => n["@type"] === "WebSite")));
  assert.ok(home.includes('href="/el-molar"') && home.includes('href="/el-molar/restauracion"'));
  const lista = (await leer("/el-molar/restauracion")).html;
  assert.equal(schemas(lista).find(s => s["@type"] === "ItemList").itemListElement.length, 2);
  assert.ok(lista.includes("Negocio de prueba 1") && !lista.includes("Negocio de prueba 6"));
  const navegador = (await leer("/el-molar/restauracion", "Mozilla/5.0")).html;
  assert.ok(navegador.split("</head>")[0].includes('rel="canonical"'), "Metadata en head también para navegadores");
  const ficha = (await leer("/el-molar/comercios/prueba-1")).html;
  assert.ok(schemas(ficha).some(s => s["@type"] === "LocalBusiness"));
  for (const ruta of ["/comercios", "/comercios?municipio=el-molar&categoria=restauracion", "/comercios?buscar=sin-resultados", "/comercios?categoria=uno&categoria=dos", "/el-molar/comercios/prueba-6", "/el-molar/comercios/prueba-7"]) {
    const { html } = await leer(ruta);
    assert.ok(html.includes('name="robots" content="noindex, follow"'), ruta);
    assert.ok(!schemas(html).some(s => s["@type"] === "LocalBusiness"), ruta);
  }
  const alias = await leer("/comercios/prueba-1");
  assert.ok(alias.html.includes(`rel="canonical" href="${sitio}/el-molar/comercios/prueba-1"`));
  const redireccion = await leer("/el-molar/servicios-profesionales");
  assert.equal(redireccion.respuesta.status, 308);
  assert.equal(redireccion.respuesta.headers.get("location"), "/el-molar/profesionales");
  for (const ruta of ["/el-molar/hogar-y-reparaciones", "/el-molar/no-existe", "/otro-municipio", "/el-molar/comercios/no-existe"]) {
    const { respuesta, html } = await leer(ruta);
    assert.equal(respuesta.status, 404, ruta);
    assert.ok(html.includes('name="robots" content="noindex"'), ruta);
  }
  const robots = (await leer("/robots.txt")).html;
  assert.ok(robots.includes("Allow: /") && robots.includes(`Sitemap: ${sitio}/sitemap.xml`));
  estado = "vacio";
  assert.equal([...(await leer("/sitemap.xml")).html.matchAll(/<loc>/g)].length, 1);
  assert.ok((await leer("/el-molar")).html.includes('name="robots" content="noindex"'));
  estado = "error";
  assert.equal((await leer("/sitemap.xml")).respuesta.status, 500);
  for (const ruta of ["/", "/el-molar", "/el-molar/comercios", "/el-molar/restauracion", "/el-molar/comercios/prueba-1"]) {
    assert.equal((await leer(ruta)).respuesta.status, 500, `Error API: ${ruta}`);
  }
  console.log("SEO OK: sitemap, canonical, metadata única, SSR, enlaces, JSON-LD, filtros, demos, fichas insuficientes, 404, catálogo vacío y error API.");
} catch (error) {
  console.error(logs);
  throw error;
} finally {
  next.kill();
  api.closeAllConnections();
  await new Promise(resolve => api.close(resolve));
}
