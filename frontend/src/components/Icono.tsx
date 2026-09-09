const trazos: Record<string, React.ReactNode> = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  arrow: <><path d="M4 12h15m-6-6 6 6-6 6"/></>,
  heart: <path d="M20.5 5.5c-3-3-6.5-1-8.5 1-2-2-5.5-4-8.5-1S2 12 12 21C22 12 23.5 8.5 20.5 5.5Z"/>,
  utensils: <><path d="M5 3v7m3-7v7M2 3v7c0 4 6 4 6 0M5 13v8M18 3c-4 4-4 10 0 10V3Zm0 10v8"/></>,
  scissors: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8 8 12 12M8 16 20 4"/></>,
  bag: <><path d="M5 8h14l2 13H3L5 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></>,
  home: <><path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-8h6v8"/></>,
  car: <><path d="m4 9 2-6h12l2 6M3 9h18v9H3V9Zm2 9v3m14-3v3M6 13h2m8 0h2"/></>,
  book: <><path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/></>,
  key: <><circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-5-5 3-3m-1 5 3-3"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V3h8v4M2 12c6 4 14 4 20 0m-10 1v4"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,
  check: <><path d="m8 12 3 3 5-6"/><circle cx="12" cy="12" r="9"/></>,
  phone: <path d="m5 3 4 4-2 3c2 4 3 5 7 7l3-2 4 4c-1 5-6 4-11 0S0 7 5 3Z"/>,
  chat: <><path d="M21 11a9 9 0 0 1-13 8l-6 2 2-6A9 9 0 1 1 21 11Z"/><path d="M8 10h8m-8 4h5"/></>,
  globe: <><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  store: <><path d="M3 10 5 3h14l2 7M3 10c0 4 4 4 4 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 4 4 4 0M5 13v8h14v-8M9 21v-6h6v6"/></>,
};

// Dibuja iconos pequeños con trazos consistentes sin dependencias adicionales.
export function Icono({ nombre, size = 22 }: { nombre: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{trazos[nombre] ?? trazos.store}</svg>;
}
