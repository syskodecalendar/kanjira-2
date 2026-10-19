import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const btn = {
  solid: "inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 text-base tracking-wide text-primary-foreground transition-all hover:bg-ink",
  light: "inline-flex items-center justify-center gap-2 bg-ivory px-8 py-4 text-base tracking-wide text-ink transition-all hover:bg-gold",
  ghostLight: "inline-flex items-center justify-center gap-2 border border-ivory/70 px-8 py-4 text-base tracking-wide text-ivory transition-all hover:bg-ivory hover:text-ink",
  outline: "inline-flex items-center justify-center gap-2 border border-primary px-8 py-4 text-base tracking-wide text-primary transition-all hover:bg-primary hover:text-primary-foreground",
};

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-accent", className)}>
      <span className="h-px w-8 bg-current" /> {children}
    </p>
  );
}

export function PageHero({ image, eyebrow, title, text }: { image: string; eyebrow: string; title: ReactNode; text: string }) {
  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden text-ivory">
      <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="hero-overlay absolute inset-0" />
      <div className="container-x relative pb-16 pt-36 md:pb-24">
        <Eyebrow className="text-gold">{eyebrow}</Eyebrow>
        <h1 className="display-xl mt-6 max-w-4xl animate-rise">{title}</h1>
        <p className="mt-6 max-w-xl text-ivory/90">{text}</p>
      </div>
    </section>
  );
}

export function FilmVideo({ src, poster, className, hero }: { src: string; poster: string; className?: string; hero?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { ref.current?.pause(); setPlaying(false); }
  }, []);
  const toggle = () => {
    const v = ref.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  return (
    <>
      <video ref={ref} className={cn("absolute inset-0 size-full object-cover", className)} src={src} poster={poster} autoPlay muted loop playsInline preload={hero ? "auto" : "metadata"} aria-label="Lakeside resort at dusk, illustrative film" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause film" : "Play film"}
        className="absolute bottom-6 right-6 z-10 flex size-12 items-center justify-center rounded-full border border-ivory/60 bg-ink/30 text-ivory backdrop-blur transition hover:bg-ivory hover:text-ink"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </>
  );
}

export function EnquiryCTA({ title = "Let’s begin shaping your day.", text = "Share a few details and we’ll prepare a personalised proposal around your celebration.", image }: { title?: string; text?: string; image: string }) {
  return (
    <section className="relative overflow-hidden text-ivory">
      <img src={image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-ink/65" />
      <div className="container-x relative py-28 text-center md:py-36">
        <Eyebrow className="justify-center text-gold">Plan Your Day</Eyebrow>
        <h2 className="display-lg mx-auto mt-6 max-w-3xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-ivory/85">{text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/contact" className={btn.light}>Start Your Enquiry</Link>
          <Link to="/celebrations" className={btn.ghostLight}>Explore Celebrations</Link>
        </div>
      </div>
    </section>
  );
}
