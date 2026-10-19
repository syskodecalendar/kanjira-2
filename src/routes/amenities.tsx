import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Accessibility, BedDouble, Car, Check, CloudRain, Lightbulb, Music, Plug, Sparkles, Truck, UtensilsCrossed, Users, Wifi, type LucideIcon } from "lucide-react";
import { useState } from "react";
import dining from "@/assets/dining.jpg";
import bridal from "@/assets/bridal.jpg";
import reception from "@/assets/reception.jpg";
import { btn, EnquiryCTA, Eyebrow, PageHero } from "@/components/site/ui";
import { AMENITIES } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/amenities")({
  head: () => ({
    meta: [
      { title: "Amenities — Kanjira’s Luxeves Pavilion" },
      { name: "description", content: "Bridal rooms, dining, lighting, accessibility, weather planning and more — the considered comforts behind your celebration." },
      { property: "og:title", content: "Amenities — Kanjira’s Luxeves Pavilion" },
      { property: "og:description", content: "The considered comforts behind a graceful lakeside celebration." },
    ],
  }),
  component: Amenities,
});

const icons: Record<string, LucideIcon> = {
  parking: Car, bridal: Sparkles, stay: BedDouble, dining: UtensilsCrossed, lighting: Lightbulb, power: Plug,
  sound: Music, wifi: Wifi, access: Accessibility, comfort: Users, weather: CloudRain, vendors: Truck,
};

function Amenities() {
  const [sel, setSel] = useState<string[]>([]);
  const navigate = useNavigate();
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <>
      <PageHero image={dining} eyebrow="Amenities" title={<>Thoughtfully<br /><em>prepared.</em></>} text="The quiet details that let you and your guests simply enjoy the day." />

      <section className="container-x grid items-end gap-10 py-20 md:grid-cols-[1fr_auto]">
        <div className="max-w-2xl">
          <Eyebrow>Select what matters to you</Eyebrow>
          <h2 className="display-lg mt-6">Build your enquiry around your needs.</h2>
          <p className="mt-5 text-muted-foreground">Tap any amenity to add it to your list, then carry your selection straight into your enquiry.</p>
        </div>
        <img src={bridal} alt="" loading="lazy" className="arch hidden aspect-[3/4] w-56 object-cover md:block" />
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a) => {
            const Icon = icons[a.id]!;
            const on = sel.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggle(a.id)} aria-pressed={on}
                className={cn("group relative bg-background p-8 text-left transition-colors md:p-10", on ? "bg-card" : "hover:bg-muted")}>
                <span className={cn("absolute right-6 top-6 flex size-7 items-center justify-center rounded-full border transition", on ? "border-accent bg-accent text-accent-foreground" : "border-input")}>
                  {on && <Check className="size-4" />}
                </span>
                <Icon className="size-9 text-accent" strokeWidth={1.1} />
                <h3 className="mt-6 text-3xl">{a.title}</h3>
                <p className="mt-3 text-muted-foreground">{a.text}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-8 max-w-2xl text-[13px] text-muted-foreground">
          Note: these are proposed amenity categories for presentation. Specific facilities and availability require confirmation with the venue.
        </p>
      </section>

      <div className="sticky bottom-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
          <p className="text-[15px]">{sel.length ? `${sel.length} amenit${sel.length === 1 ? "y" : "ies"} selected` : "No amenities selected yet"}</p>
          <button disabled={!sel.length} onClick={() => navigate({ to: "/contact", search: { amenities: sel.join(",") } })}
            className={cn(btn.solid, "py-3 disabled:cursor-not-allowed disabled:opacity-40")}>Add to My Enquiry</button>
        </div>
      </div>

      <EnquiryCTA image={reception} />
    </>
  );
}
