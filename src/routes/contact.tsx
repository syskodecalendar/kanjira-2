import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, Instagram, X } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import lake from "@/assets/lake.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { btn, Eyebrow, PageHero } from "@/components/site/ui";
import { AMENITIES, BRAND, CELEBRATION_TYPES, COLLECTIONS, INSTAGRAM, CONTACT } from "@/lib/site";
import { cn } from "@/lib/utils";

type Search = { collection?: string | undefined; amenities?: string | undefined; visit?: boolean | undefined };

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    collection: typeof s["collection"] === "string" ? s["collection"] : undefined,
    amenities: typeof s["amenities"] === "string" ? s["amenities"] : undefined,
    visit: s["visit"] === true || s["visit"] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Plan Your Day — Kanjira’s Luxeves Pavilion" },
      { name: "description", content: "Share your celebration plans and request a personalised proposal or a venue visit." },
      { property: "og:title", content: "Plan Your Day — Kanjira’s Luxeves Pavilion" },
      { property: "og:description", content: "Begin your enquiry for a lakeside wedding or celebration." },
    ],
  }),
  component: Contact,
});

const faqs = [
  ["Can we visit the venue before deciding?", "Yes — venue visits can be requested through this form. Dates and times are arranged with the venue team once your enquiry is received."],
  ["How many guests can the venue accommodate?", "Guest capacity depends on the settings and layout you choose. Please share your estimated guest count and the team will confirm what’s possible."],
  ["Is catering provided?", "Dining and catering are part of the planning conversation. Menus, styles and any vendor arrangements are confirmed with the venue."],
  ["What happens if the weather changes?", "Weather planning, including covered alternatives, is discussed during planning. Specific arrangements require venue confirmation."],
  ["Is accommodation available for guests?", "Accommodation options for guests can be discussed with the venue team. Availability is confirmed per date."],
  ["How does the booking enquiry work?", "Submitting an enquiry starts a conversation, not a booking. The team will respond with a personalised proposal; nothing is confirmed until agreed directly with the venue."],
] as const;

const field = "w-full border border-input bg-background px-4 py-3.5 text-base outline-none transition focus:border-accent focus:ring-1 focus:ring-accent";

function Field({ label, error, children, optional }: { label: string; error?: string | undefined; children: ReactNode; optional?: boolean | undefined }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-medium">{label}{optional && <span className="font-normal text-muted-foreground"> (optional)</span>}</span>
      {children}
      {error && <span className="mt-1.5 block text-[14px] text-destructive">{error}</span>}
    </label>
  );
}

function Contact() {
  const search = Route.useSearch();
  const [amenities, setAmenities] = useState<string[]>(() => (search.amenities ?? "").split(",").filter((a) => AMENITIES.some((x) => x.id === a)));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => String(fd.get(k) ?? "");
    const d = { name: g("name"), phone: g("phone"), email: g("email"), date: g("date"), type: g("type"), guests: g("guests"), budget: g("budget"), collection: g("collection"), visit: g("visit"), message: g("message") };
    const err: { [k: string]: string } = {};
    if (!d.name.trim()) err["name"] = "Please share your name.";
    if (!d.phone.trim() || !/^[+\d][\d\s()-]{6,}$/.test(d.phone.trim())) err["phone"] = "Please enter a valid phone or WhatsApp number.";
    if (!d.email.trim() || !/^\S+@\S+\.\S+$/.test(d.email)) err["email"] = "Please enter a valid email address.";
    if (!d.type) err["type"] = "Please choose a celebration type.";
    if (d.guests && Number(d.guests) < 1) err["guests"] = "Please enter a positive number.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const am = amenities.map((a) => AMENITIES.find((x) => x.id === a)?.title).join(", ") || "—";
    setSummary(
      [`Enquiry brief — ${BRAND}`, "",
        `Name: ${d.name}`, `Phone / WhatsApp: ${d.phone}`, `Email: ${d.email}`,
        `Preferred date: ${d.date || "—"}`, `Celebration type: ${d.type}`, `Estimated guests: ${d.guests || "—"}`,
        `Planning budget: ${d.budget || "—"}`, `Selected collection: ${d.collection || "—"}`,
        `Venue visit requested: ${d.visit ? "Yes" : "No"}`, `Amenities of interest: ${am}`, "", `Message:`, d.message || "—",
      ].join("\n"),
    );
    setCopied(false);
  };

  const download = () => {
    if (!summary) return;
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain" }));
    const a = document.createElement("a"); a.href = url; a.download = "luxeves-enquiry-brief.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHero image={lake} eyebrow="Plan Your Day" title={<>Tell us about<br /><em>your celebration.</em></>} text="A few details help us prepare a personalised proposal around the day you imagine." />

      <section className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" error={errors["name"]}><input name="name" className={field} autoComplete="name" /></Field>
          <Field label="Phone / WhatsApp" error={errors["phone"]}><input name="phone" type="tel" className={field} autoComplete="tel" /></Field>
          <Field label="Email" error={errors["email"]}><input name="email" type="email" className={field} autoComplete="email" /></Field>
          <Field label="Preferred event date" optional><input name="date" type="date" className={field} /></Field>
          <Field label="Celebration type" error={errors["type"]}>
            <select name="type" defaultValue="" className={field}>
              <option value="" disabled>Choose one</option>
              {CELEBRATION_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Estimated guests" error={errors["guests"]} optional><input name="guests" type="number" min={1} className={field} /></Field>
          <Field label="Planning budget" optional><input name="budget" className={field} placeholder="A range is fine" /></Field>
          <Field label="Selected collection" optional>
            <select name="collection" defaultValue={COLLECTIONS.includes(search.collection as never) ? (search.collection ?? "") : ""} className={field}>
              <option value="">Not sure yet</option>
              {COLLECTIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <fieldset className="sm:col-span-2">
            <legend className="mb-3 text-[15px] font-medium">Amenities of interest <span className="font-normal text-muted-foreground">(optional)</span></legend>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const on = amenities.includes(a.id);
                return (
                  <button type="button" key={a.id} aria-pressed={on} onClick={() => setAmenities((s) => on ? s.filter((x) => x !== a.id) : [...s, a.id])}
                    className={cn("border px-4 py-2 text-[15px] transition", on ? "border-accent bg-accent text-accent-foreground" : "border-input hover:border-accent")}>{a.title}</button>
                );
              })}
            </div>
          </fieldset>
          <label className="flex items-center gap-3 sm:col-span-2">
            <input type="checkbox" name="visit" defaultChecked={!!search.visit} className="size-5 accent-[var(--accent)]" />
            <span>I’d like to request a venue visit</span>
          </label>
          <div className="sm:col-span-2"><Field label="Message" optional><textarea name="message" rows={5} className={field} placeholder="Tell us about your vision, traditions or questions." /></Field></div>
          <div className="sm:col-span-2">
            <button type="submit" className={btn.solid}>Prepare My Enquiry</button>
            <p className="mt-3 text-[13px] text-muted-foreground">This is a website mockup. Submitting creates a summary only — nothing is sent.</p>
          </div>
        </form>

        <aside className="space-y-10 lg:border-l lg:pl-12">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <dl className="mt-6 space-y-4">
              <div><dt className="text-[13px] uppercase tracking-widest text-muted-foreground">Call the venue</dt><dd className="mt-2 space-y-2 font-display text-2xl">{CONTACT.phones.map(p => <a key={p.tel} href={`tel:${p.tel}`} className="block hover:text-accent">{p.display}</a>)}</dd></div>
              <div><dt className="text-[13px] uppercase tracking-widest text-muted-foreground">WhatsApp enquiries</dt><dd className="mt-2"><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="venue-detail-link">Chat with the venue ↗</a></dd></div>
              <div><dt className="text-[13px] uppercase tracking-widest text-muted-foreground">Visit us</dt><dd className="mt-2 font-display text-2xl">{CONTACT.address}</dd></div>
            </dl>
          </div>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border-b pb-1 hover:text-accent"><Instagram className="size-5" /> @kanjiras_luxeves_pavilion</a>
          <div><iframe title="Kanjira’s Luxeves Pavilion location map" src={CONTACT.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-[4/3] w-full border" allowFullScreen /><a href={CONTACT.map} target="_blank" rel="noreferrer" className="venue-detail-link mt-4">Open in Google Maps ↗</a></div>
        </aside>
      </section>

      <section className="bg-card py-24">
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <div><Eyebrow>Questions</Eyebrow><h2 className="display-lg mt-6">Before you enquire.</h2></div>
          <Accordion type="single" collapsible>
            {faqs.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="py-6 text-left font-display text-2xl font-normal hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="pb-6 text-base text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {summary && (
        <div role="dialog" aria-modal="true" aria-labelledby="sum-title" className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4" onClick={() => setSummary(null)}>
          <div className="max-h-[90vh] w-full max-w-xl overflow-auto bg-background p-8 md:p-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 id="sum-title" className="text-4xl">Your enquiry brief</h2>
              <button onClick={() => setSummary(null)} aria-label="Close"><X className="size-6" /></button>
            </div>
            <p className="mt-4 border-l-2 border-accent bg-card p-4 text-[15px]">
              <strong>No message has been sent and no booking has been confirmed.</strong> Copy or download this brief to share with the venue directly.
            </p>
            <pre className="mt-6 whitespace-pre-wrap font-sans text-[15px] leading-relaxed">{summary}</pre>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => { navigator.clipboard.writeText(summary); setCopied(true); }} className={btn.solid}><Copy className="size-4" />{copied ? "Copied" : "Copy brief"}</button>
              <button onClick={download} className={btn.outline}><Download className="size-4" />Download</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
