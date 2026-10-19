import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import ceremony from "@/assets/ceremony.jpg";
import reception from "@/assets/reception.jpg";
import mehndi from "@/assets/mehndi.jpg";
import engagement from "@/assets/engagement.jpg";
import decor from "@/assets/decor.jpg";
import dining from "@/assets/dining.jpg";
import { btn, EnquiryCTA, Eyebrow, PageHero } from "@/components/site/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/celebrations")({
  head: () => ({
    meta: [
      { title: "Celebrations — Kanjira’s Luxeves Pavilion" },
      { name: "description", content: "Intimate weddings, grand receptions and wedding weekends by the lake. Explore proposed celebration collections." },
      { property: "og:title", content: "Celebrations — Kanjira’s Luxeves Pavilion" },
      { property: "og:description", content: "Weddings, engagements, haldi, mehndi, sangeet, receptions and private celebrations by the lake." },
    ],
  }),
  component: Celebrations,
});

const styles = [
  { key: "intimate", label: "Intimate Weddings", img: ceremony, text: "A gathering of your closest people beside the water — unhurried, personal and deeply felt.", details: ["Lakeside ceremony setting", "Family dinner under soft lighting", "Bridal preparation room", "Personal planning support"] },
  { key: "grand", label: "Grand Weddings & Receptions", img: reception, text: "A celebration with presence: a ceremony to remember and a reception that glows into the night.", details: ["Ceremony and reception settings", "Layered event lighting and décor", "Catering for extended families", "Sound, stage and entertainment support"] },
  { key: "weekend", label: "Wedding Weekends", img: mehndi, text: "Haldi in the morning light, sangeet under the stars and vows by the lake — every ritual given its own moment.", details: ["Multi-day celebration planning", "Haldi, mehndi and sangeet settings", "Guest accommodation discussions", "Coordinated vendor schedules"] },
];

const occasions = [
  { title: "Wedding ceremonies", img: ceremony },
  { title: "Engagements", img: engagement },
  { title: "Haldi, Mehndi & Sangeet", img: mehndi },
  { title: "Receptions", img: reception },
  { title: "Private celebrations", img: dining },
];

const collections = [
  { name: "The Gathering", text: "For intimate weddings and engagements, with the lake at the heart of a smaller celebration.", items: ["One celebration setting", "Curated dining", "Bridal preparation"] },
  { name: "The Signature", text: "Our most complete single-day celebration, from ceremony to reception.", items: ["Ceremony and reception", "Lighting and décor planning", "Sound and entertainment"] },
  { name: "The Wedding Weekend", text: "Every ritual across multiple days, coordinated as one beautiful journey.", items: ["Multiple ceremonies", "Accommodation planning", "Dedicated coordination"] },
];

const journey = ["Share Your Vision", "Explore the Possibilities", "Plan the Details", "Celebrate"];

function Celebrations() {
  const [active, setActive] = useState(0);
  const s = styles[active]!;
  return (
    <>
      <PageHero image={ceremony} eyebrow="Celebrations" title={<>Every ritual,<br /><em>beautifully held.</em></>} text="From an intimate ceremony to a weekend of festivities, shaped around your families and traditions." />

      <section className="container-x py-24 md:py-32">
        <Eyebrow>Choose your celebration</Eyebrow>
        <div role="tablist" aria-label="Celebration style" className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-b">
          {styles.map((st, i) => (
            <button key={st.key} role="tab" aria-selected={i === active} onClick={() => setActive(i)}
              className={cn("-mb-px border-b-2 pb-4 font-display text-2xl transition-colors md:text-3xl", i === active ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {st.label}
            </button>
          ))}
        </div>
        <div key={s.key} className="mt-12 grid animate-rise items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <img src={s.img} alt={s.label} className="aspect-[4/3] w-full object-cover" />
          <div>
            <h2 className="display-lg">{s.label}</h2>
            <p className="mt-6 text-muted-foreground">{s.text}</p>
            <ul className="mt-8 space-y-3">
              {s.details.map((d) => (
                <li key={d} className="flex items-center gap-3 border-b pb-3"><Check className="size-4 text-accent" />{d}</li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-muted-foreground">Suggested details; final arrangements confirmed with the venue.</p>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-ivory md:py-32">
        <div className="container-x">
          <Eyebrow className="text-gold">Occasions</Eyebrow>
          <h2 className="display-lg mt-6 max-w-2xl">For every chapter of your celebration.</h2>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5">
            {occasions.map((o, i) => (
              <div key={o.title} className={cn("group relative overflow-hidden", i === 0 && "col-span-2 md:col-span-1")}>
                <img src={o.img} alt="" loading="lazy" className={cn("aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-105", i % 2 === 0 && "md:arch")} />
                <div className="fade-overlay absolute inset-0" />
                <h3 className="absolute bottom-5 left-5 right-5 text-2xl">{o.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="max-w-2xl">
          <Eyebrow>Proposed collections</Eyebrow>
          <h2 className="display-lg mt-6">Three ways to begin.</h2>
          <p className="mt-5 text-muted-foreground">Each collection is a starting point. Select one to begin your enquiry and we’ll tailor it from there.</p>
        </div>
        <div className="mt-14 grid gap-px bg-border md:grid-cols-3">
          {collections.map((c, i) => (
            <article key={c.name} className={cn("flex flex-col bg-background p-8 md:p-10", i === 1 && "bg-card")}>
              <p className="eyebrow text-accent">0{i + 1}</p>
              <h3 className="mt-4 text-4xl">{c.name}</h3>
              <p className="mt-4 text-muted-foreground">{c.text}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {c.items.map((it) => <li key={it} className="flex gap-3"><span className="mt-3 h-px w-4 bg-accent" />{it}</li>)}
              </ul>
              <p className="mt-8 font-display text-xl italic">Request a personalised proposal</p>
              <Link to="/contact" search={{ collection: c.name }} className={cn(btn.solid, "mt-5")}>Select {c.name} <ArrowRight className="size-4" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-card py-24">
        <div className="container-x">
          <Eyebrow>The planning journey</Eyebrow>
          <ol className="mt-12 grid gap-10 md:grid-cols-4">
            {journey.map((j, i) => (
              <li key={j} className="relative border-t border-foreground/30 pt-6">
                <span className="font-display text-6xl text-accent">{i + 1}</span>
                <p className="mt-2 font-display text-3xl">{j}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <EnquiryCTA image={decor} />
    </>
  );
}
