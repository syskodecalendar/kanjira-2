import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import lake from "@/assets/lake.jpg";
import hero from "@/assets/hero.jpg";
import ceremony from "@/assets/ceremony.jpg";
import reception from "@/assets/reception.jpg";
import mehndi from "@/assets/mehndi.jpg";
import bridal from "@/assets/bridal.jpg";
import dining from "@/assets/dining.jpg";
import { btn, EnquiryCTA, Eyebrow, PageHero } from "@/components/site/ui";

export const Route = createFileRoute("/destination")({
  head: () => ({
    meta: [
      { title: "The Destination — Kanjira’s Luxeves Pavilion" },
      { name: "description", content: "Discover the lakeside setting, celebration spaces and warm hospitality of Kanjira’s Luxeves Pavilion." },
      { property: "og:title", content: "The Destination — Kanjira’s Luxeves Pavilion" },
      { property: "og:description", content: "A lakeside setting of quiet waters, warm light and thoughtful hospitality." },
    ],
  }),
  component: Destination,
});

const settings = [
  { img: ceremony, title: "By the water", text: "Vows exchanged with the lake as your backdrop and the sun lowering behind you." },
  { img: mehndi, title: "In the open air", text: "Bright, joyful mornings for haldi and mehndi, full of colour and laughter." },
  { img: reception, title: "Beneath the lights", text: "Long tables, candlelight and string lights for evenings that linger." },
];

function Destination() {
  return (
    <>
      <PageHero image={lake} eyebrow="The Destination" title={<>A place where<br /><em>time slows down.</em></>} text="Still water, open skies and a sense of calm that settles over everyone who arrives." />

      <section className="container-x grid gap-14 py-24 md:grid-cols-12 md:py-36">
        <div className="md:col-span-5">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="display-lg mt-6">Hospitality, shaped by the lake.</h2>
        </div>
        <div className="space-y-6 text-muted-foreground md:col-span-6 md:col-start-7">
          <p className="text-xl text-foreground md:text-2xl font-display leading-snug">Kanjira’s Luxeves Pavilion was imagined as somewhere families could gather without hurry — where the setting does half the work and the people do the rest.</p>
          <p>Here, a celebration follows the light: gentle mornings by the water, golden afternoons, and evenings that glow long after the sun has gone. Every detail is planned with you, so the day feels unmistakably yours.</p>
        </div>
      </section>

      <section className="bg-card py-24 md:py-32">
        <div className="container-x">
          <Eyebrow>Celebration settings</Eyebrow>
          <h2 className="display-lg mt-6 max-w-2xl">Three moods, one shoreline.</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {settings.map((s, i) => (
              <article key={s.title} className={i === 1 ? "md:mt-20" : ""}>
                <img src={s.img} alt={s.title} loading="lazy" className={`${i === 1 ? "arch" : ""} aspect-[4/5] w-full object-cover`} />
                <h3 className="mt-6 text-3xl">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid items-center gap-14 py-24 md:grid-cols-2 md:py-36">
        <div className="order-2 md:order-1">
          <Eyebrow>Guest experience</Eyebrow>
          <h2 className="display-lg mt-6">Every guest, looked after.</h2>
          <p className="mt-6 max-w-lg text-muted-foreground">From a calm welcome on arrival to a quiet room for the bride to get ready, hospitality here is about anticipating what your families need — and making it feel effortless.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/amenities" className={btn.solid}>Explore Amenities</Link>
            <Link to="/celebrations" className={btn.outline}>View Celebrations</Link>
          </div>
        </div>
        <div className="relative order-1 grid grid-cols-2 gap-4 md:order-2">
          <img src={bridal} alt="Bridal preparation room" loading="lazy" className="aspect-[3/4] w-full object-cover" />
          <img src={dining} alt="Dining table setting" loading="lazy" className="mt-16 aspect-[3/4] w-full object-cover" />
        </div>
      </section>

      <section className="relative overflow-hidden text-ivory">
        <img src={hero} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="container-x relative flex flex-col items-start gap-8 py-28 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="text-gold">Come and see</Eyebrow>
            <h2 className="display-lg mt-6 max-w-xl">Walk the shoreline before your day.</h2>
          </div>
          <Link to="/contact" search={{ visit: true }} className={btn.light}>Request a Venue Visit <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <EnquiryCTA image={reception} />
    </>
  );
}
