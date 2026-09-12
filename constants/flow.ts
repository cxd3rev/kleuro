export const FLOW_ROUTES = [
  { href: "/home", title: "Home", description: "Start je kleurvoorstel" },
  { href: "/foto", title: "Foto", description: "Upload een foto van je woning" },
  {
    href: "/oppervlakken",
    title: "Oppervlakken",
    description: "Kies wat je wilt laten schilderen",
  },
  { href: "/kleuren", title: "Kleuren", description: "Selecteer je favoriete kleuren" },
  {
    href: "/visualisatie",
    title: "Visualisatie",
    description: "Bekijk je woning in nieuwe kleuren",
  },
  {
    href: "/projectinfo",
    title: "Projectinfo",
    description: "Vertel kort over je project",
  },
  { href: "/prijs", title: "Prijs", description: "Ontvang een eerste inschatting" },
  { href: "/contact", title: "Contact", description: "Laat je gegevens achter" },
  { href: "/bedankt", title: "Bedankt", description: "We nemen contact met je op" },
] as const;

export type FlowHref = (typeof FLOW_ROUTES)[number]["href"];
