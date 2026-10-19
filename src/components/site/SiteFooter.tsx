import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { BRAND, INSTAGRAM, NAV, CONTACT } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="container-x grid gap-12 py-20 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl">{BRAND}</p>
          <p className="mt-4 max-w-sm text-ivory/75">Quiet waters, warm light and celebrations shaped around the people you love.</p>
        </div>
        <ul className="space-y-2.5 text-[15px]">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="text-ivory/80 transition-colors hover:text-gold">{n.label}</Link>
            </li>
          ))}
        </ul>
        <div className="space-y-3 text-[15px] text-ivory/80">
          <p className="eyebrow text-gold">Connect</p>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold">
            <Instagram className="size-4" /> @kanjiras_luxeves_pavilion
          </a>
          <div className="space-y-2">{CONTACT.phones.map(p => <a key={p.tel} href={`tel:${p.tel}`} className="block hover:text-gold">{p.display}</a>)}</div>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="block hover:text-gold">WhatsApp enquiries ↗</a>
          <a href={CONTACT.map} target="_blank" rel="noreferrer" className="block hover:text-gold">{CONTACT.address}</a>
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-[13px] text-ivory/60 md:flex-row">
          <p>© {new Date().getFullYear()} {BRAND}. Website concept mockup.</p>
          <p>Photography and film are illustrative stock imagery, not images of the venue.</p>
        </div>
      </div>
    </footer>
  );
}
