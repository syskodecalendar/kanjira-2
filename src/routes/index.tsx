import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car, Lightbulb, Sparkles, UtensilsCrossed } from "lucide-react";
import hero from "@/assets/hero.jpg";
import ceremony from "@/assets/ceremony.jpg";
import reception from "@/assets/reception.jpg";
import decor from "@/assets/decor.jpg";
import lake from "@/assets/lake.jpg";
import engagement from "@/assets/engagement.jpg";
import { btn, EnquiryCTA, Eyebrow, FilmVideo } from "@/components/site/ui";
import { FILM_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kanjira’s Luxeves Pavilion — Where your forever begins" },
      { name: "description", content: "A lakeside wedding and celebration destination. Quiet waters, warm light and a beautiful beginning shaped around you." },
      { property: "og:title", content: "Kanjira’s Luxeves Pavilion — Where your forever begins" },
      { property: "og:description", content: "Quiet waters. Warm light. Your favourite people. Lakeside weddings and celebrations." },
    ],
  }),
  component: Home,
});

const links = [
  { to: "/celebrations", label: "Celebrations", img: ceremony, text: "Ceremonies, receptions and every ritual between." },
  { to: "/amenities", label: "Amenities", img: reception, text: "The considered comforts behind a graceful day." },
  { to: "/gallery", label: "Gallery", img: decor, text: "Light, colour and detail, gathered in one place." },
] as const;

const highlights = [
  { icon: Sparkles, title: "Bridal preparation", text: "Calm, light-filled rooms to get ready with your closest people." },
  { icon: UtensilsCrossed, title: "Dining & catering", text: "Menus shaped around your family’s traditions." },
  { icon: Lightbulb, title: "Event lighting", text: "Warm, layered light that carries the evening glow." },
  { icon: Car, title: "Arrival & parking", text: "A gentle welcome for every guest, from the very first moment." },
];

function Home() {
  return (
    <>
      <section className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden text-ivory">
        <FilmVideo src={FILM_URL} poster={hero} hero />
        <div className="hero-overlay pointer-events-none absolute inset-0" />
        <div className="container-x relative pb-24 md:pb-32">
          <Eyebrow className="animate-rise text-gold">A lakeside celebration destination</Eyebrow>
          <h1 className="display-xl mt-6 animate-rise [animation-delay:150ms]">Where your<br /><em className="italic">forever begins.</em></h1>
          <p className="mt-7 max-w-lg animate-rise text-ivory/90 [animation-delay:300ms]">
            Quiet waters. Warm light. Your favourite people.<br />A beautiful beginning, shaped around you.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-rise [animation-delay:450ms]">
            <Link to="/venues" className={btn.light}>Explore Venues & Rates</Link>
            <Link to="/booking" search={{ option: "v1" }} className={btn.ghostLight}>Try Booking & Payment</Link>
          </div>
        </div>
      </section>

      <section className="container-x grid items-center gap-14 py-24 md:grid-cols-2 md:py-36">
        <div className="relative mx-auto w-full max-w-md">
          <img src={lake} alt="Misty lake beside a resort deck at sunrise" loading="lazy" width={1600} height={1072} className="arch aspect-[3/4] w-full object-cover" />
          <img src={engagement} alt="Couple at the water’s edge at sunset" loading="lazy" className="absolute -bottom-10 -right-6 hidden w-1/2 border-8 border-background object-cover md:block md:-right-16 aspect-square" />
        </div>
        <div>
          <Eyebrow>The Destination</Eyebrow>
          <h2 className="display-lg mt-6">A quiet shoreline for the loudest joy of your life.</h2>
          <p className="mt-6 max-w-lg text-muted-foreground">
            At Kanjira’s Luxeves Pavilion, the water sets the pace. Mornings arrive softly, evenings glow amber, and every ritual unfolds with room to breathe — for you, your families and everyone who travels to be with you.
          </p>
          <Link to="/destination" className="mt-9 inline-flex items-center gap-3 border-b border-foreground pb-1 text-base hover:text-accent hover:border-accent">
            Discover the destination <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="group relative block h-[70vh] min-h-[440px] overflow-hidden text-ivory">
            <img src={l.img} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
            <div className="fade-overlay absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <h3 className="text-5xl">{l.label}</h3>
              <p className="mt-3 max-w-xs text-ivory/85">{l.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 eyebrow text-gold">Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-card py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Considered comforts</Eyebrow>
              <h2 className="display-lg mt-6 max-w-2xl">Everything in its place, so you can be present.</h2>
            </div>
            <Link to="/amenities" className={btn.outline}>View all amenities</Link>
          </div>
          <div className="mt-16 grid border-t sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => (
              <div key={h.title} className={`border-b py-10 pr-8 sm:px-8 ${i % 4 !== 0 ? "lg:border-l" : "lg:pl-0"} ${i % 2 ? "sm:border-l lg:border-l" : ""}`}>
                <h.icon className="size-8 text-accent" strokeWidth={1.2} />
                <h3 className="mt-6 text-3xl">{h.title}</h3>
                <p className="mt-3 text-muted-foreground">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-[85vh] min-h-[520px] overflow-hidden text-ivory">
        <FilmVideo src={FILM_URL} poster={hero} />
        <div className="pointer-events-none absolute inset-0 bg-ink/40" />
        <div className="container-x pointer-events-none relative flex h-full flex-col justify-center">
          <Eyebrow className="text-gold">The Film</Eyebrow>
          <h2 className="display-lg mt-6 max-w-2xl">Dusk on the water, and the evening ahead.</h2>
          <p className="mt-5 max-w-md text-ivory/85">A glimpse of the lakeside mood we hope to share with you.</p>
        </div>
      </section>

      <EnquiryCTA image={reception} />
    </>
  );
}
