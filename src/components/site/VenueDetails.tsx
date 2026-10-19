import { Link } from '@tanstack/react-router';
import { BedDouble, CalendarDays, Check, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { btn } from './ui';
import { VENUES, money } from '@/lib/booking';
import ceremony from '@/assets/ceremony.jpg';
import reception from '@/assets/reception.jpg';
import mehndi from '@/assets/mehndi.jpg';
export const venueImages: Record<string, string> = { v1: ceremony, v2: reception, v3: mehndi };
export function VenueDetails({ id }: { id: string }) {
  const venue = VENUES.find(v => v.id === id) ?? VENUES[0];
  return <Dialog><DialogTrigger className="venue-detail-link">View {venue.name} details <span aria-hidden>↗</span></DialogTrigger>
    <DialogContent className="max-h-[90dvh] overflow-auto p-0 sm:max-w-2xl">
      <img src={venueImages[venue.id]} alt={`Illustrative celebration setting for ${venue.name}`} className="h-52 w-full object-cover"/>
      <div className="p-6 md:p-8"><DialogHeader><p className="eyebrow text-accent">Venue rental · 2026</p><DialogTitle className="font-display text-4xl">{venue.name}</DialogTitle><DialogDescription className="text-base">{venue.description}</DialogDescription></DialogHeader>
      <div className="mt-6 grid gap-4 border-y py-6 sm:grid-cols-2"><div><p className="text-sm text-muted-foreground">Venue rental</p><p className="font-display text-3xl">{money(venue.price)} <span className="font-sans text-sm">+ GST</span></p></div><div><p className="text-sm text-muted-foreground">Suggested celebrations</p><p>{venue.suitable}</p></div></div>
      <ul className="my-6 space-y-3 text-base"><li className="flex gap-3"><BedDouble className="size-5 shrink-0 text-accent"/>One complimentary AC room during the event.</li><li className="flex gap-3"><Check className="size-5 shrink-0 text-accent"/>Additional rooms: ₹5,000 per room, subject to availability.</li><li className="flex gap-3"><Users className="size-5 shrink-0 text-accent"/>Capacity and dimensions: to be confirmed by the venue.</li><li className="flex gap-3"><CalendarDays className="size-5 shrink-0 text-accent"/>Event duration and access hours: to be confirmed.</li></ul>
      <p className="mb-3 text-sm text-muted-foreground">{venue.layout} Catering, decor, sound and other services are not included in this demo quote.</p><p className="mb-6 text-xs text-muted-foreground">Photos and suggested uses illustrate the demo; the tariff does not specify individual venue facilities.</p>
      <Link to="/booking" search={{ option: venue.id }} className={btn.solid}>Select {venue.name}</Link></div>
    </DialogContent></Dialog>;
}
