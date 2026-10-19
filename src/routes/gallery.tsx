import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Instagram, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import hero from "@/assets/hero.jpg";
import ceremony from "@/assets/ceremony.jpg";
import reception from "@/assets/reception.jpg";
import decor from "@/assets/decor.jpg";
import mehndi from "@/assets/mehndi.jpg";
import lake from "@/assets/lake.jpg";
import dining from "@/assets/dining.jpg";
import bridal from "@/assets/bridal.jpg";
import engagement from "@/assets/engagement.jpg";
import { btn, Eyebrow, FilmVideo, PageHero } from "@/components/site/ui";
import { FILM_URL, INSTAGRAM } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Kanjira’s Luxeves Pavilion" },
      { name: "description", content: "An editorial gallery of ceremonies, receptions, décor and lakeside atmosphere." },
      { property: "og:title", content: "Gallery — Kanjira’s Luxeves Pavilion" },
      { property: "og:description", content: "Light, colour and detail from lakeside celebrations." },
    ],
  }),
  component: Gallery,
});

const FILTERS = ["All", "Ceremonies", "Receptions", "Décor & Details", "Destination Atmosphere"] as const;
const PHOTOS = [
  { src: ceremony, cat: "Ceremonies", alt: "Floral mandap beside the lake at sunset", tall: true },
  { src: hero, cat: "Destination Atmosphere", alt: "Pavilion reflected in the lake at dusk" },
  { src: decor, cat: "Décor & Details", alt: "Brass lamp and marigold garlands", tall: true },
  { src: reception, cat: "Receptions", alt: "Candlelit reception tables by the water" },
  { src: engagement, cat: "Ceremonies", alt: "Couple at the shore at sunset" },
  { src: dining, cat: "Décor & Details", alt: "Gold-rimmed table setting with florals", tall: true },
  { src: lake, cat: "Destination Atmosphere", alt: "Misty morning over the lake" },
  { src: mehndi, cat: "Receptions", alt: "Haldi and mehndi setting with floral swing" },
  { src: bridal, cat: "Décor & Details", alt: "Bridal outfit in a preparation room", tall: true },
];

function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [idx, setIdx] = useState<number | null>(null);
  const list = PHOTOS.filter((p) => filter === "All" || p.cat === filter);
  const step = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (idx === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", on);
    return () => { window.removeEventListener("keydown", on); document.body.style.overflow = ""; };
  }, [idx, step]);

  return (
    <>
      <PageHero image={decor} eyebrow="Gallery" title={<>Moments in<br /><em>warm light.</em></>} text="An illustrative collection of the colours, rituals and atmosphere we love to celebrate." />

      <section className="container-x py-20">
        <div className="flex flex-wrap gap-3" role="group" aria-label="Filter gallery">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={cn("border px-5 py-2.5 text-[15px] transition", filter === f ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-primary")}>{f}</button>
          ))}
        </div>
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {list.map((p, i) => (
            <button key={p.alt} onClick={() => setIdx(i)} className="group mb-5 block w-full overflow-hidden break-inside-avoid" aria-label={`View ${p.alt}`}>
              <img src={p.src} alt={p.alt} loading="lazy" className={cn("w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]", p.tall ? "aspect-[4/5]" : "aspect-[3/2]")} />
            </button>
          ))}
        </div>
      </section>

      <section className="relative h-[80vh] min-h-[480px] overflow-hidden text-ivory">
        <FilmVideo src={FILM_URL} poster={hero} />
        <div className="pointer-events-none absolute inset-0 bg-ink/35" />
        <div className="container-x pointer-events-none relative flex h-full flex-col justify-end pb-20">
          <Eyebrow className="text-gold">The lakeside film</Eyebrow>
          <h2 className="display-lg mt-5 max-w-xl">Evening, on the water.</h2>
        </div>
      </section>

      <section className="container-x flex flex-col items-center py-24 text-center">
        <Instagram className="size-8 text-accent" strokeWidth={1.2} />
        <h2 className="display-lg mt-6">Follow the celebrations.</h2>
        <p className="mt-4 text-muted-foreground">See the latest moments on Instagram.</p>
        <a href={INSTAGRAM} target="_blank" rel="noreferrer" className={cn(btn.solid, "mt-8")}>@kanjiras_luxeves_pavilion</a>
      </section>

      {idx !== null && list[idx] && (
        <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 text-ivory" onClick={() => setIdx(null)}>
          <button className="absolute right-5 top-5 p-2" aria-label="Close" onClick={() => setIdx(null)}><X className="size-7" /></button>
          <button className="absolute left-3 p-3 md:left-8" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); step(-1); }}><ChevronLeft className="size-9" /></button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-5xl">
            <img src={list[idx].src} alt={list[idx].alt} className="max-h-[80vh] w-auto object-contain" />
            <figcaption className="mt-4 text-center text-[15px] text-ivory/75">{list[idx].alt} · {idx + 1} / {list.length}</figcaption>
          </figure>
          <button className="absolute right-3 p-3 md:right-8" aria-label="Next image" onClick={(e) => { e.stopPropagation(); step(1); }}><ChevronRight className="size-9" /></button>
        </div>
      )}
    </>
  );
}
