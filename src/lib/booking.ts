export const VENUES = [
  { id: 'v1', name: 'Venue 1', price: 60000, mood: 'A beautiful beginning', description: 'Explore a ceremony-led setting for your most meaningful moments, with a dedicated space to gather your favourite people.', suitable: 'Wedding ceremony • Reception', layout: 'Ceremony seating and celebration layout to be confirmed with the venue.' },
  { id: 'v2', name: 'Venue 2', price: 50000, mood: 'Room for every ritual', description: 'Imagine a welcoming setting for family traditions, shared meals and the moments between the big moments.', suitable: 'Engagement • Family celebration', layout: 'Dining, stage and guest seating arrangements to be confirmed with the venue.' },
  { id: 'v3', name: 'Venue 3', price: 35000, mood: 'Close to the people you love', description: 'Picture a personal celebration with your closest circle, styled around the traditions and details that matter to you.', suitable: 'Haldi • Mehndi • Private gathering', layout: 'Intimate event layouts and decoration arrangements to be confirmed with the venue.' },
] as const;
export const OPTIONS = [
  { id: 'v1', name: 'Venue 1', venues: ['v1'], price: 60000 },
  { id: 'v2', name: 'Venue 2', venues: ['v2'], price: 50000 },
  { id: 'v3', name: 'Venue 3', venues: ['v3'], price: 35000 },
  { id: 'v12', name: 'Venue 1 & 2', venues: ['v1','v2'], price: 100000 },
  { id: 'v23', name: 'Venue 2 & 3', venues: ['v2','v3'], price: 75000 },
  { id: 'v123', name: 'Venue 1, 2 & 3', venues: ['v1','v2','v3'], price: 125000 },
] as const;
export type OptionId = typeof OPTIONS[number]['id'];
export function optionById(id: unknown) { return OPTIONS.find(o => o.id === id) ?? OPTIONS[0]; }
export const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
export function quote(option: OptionId, rooms: number, gst: number, payment: 'advance' | 'full') {
  const venue = optionById(option).price;
  const roomCost = Math.max(0, Math.min(20, Math.floor(rooms || 0))) * 5000;
  const subtotal = venue + roomCost;
  const tax = Math.round(subtotal * Math.max(0, Math.min(28, gst || 0))) / 100;
  const total = subtotal + tax;
  const due = payment === 'full' ? total : Math.round(total * 30) / 100;
  return { venue, roomCost, subtotal, tax, total, due, balance: Math.round((total - due) * 100) / 100 };
}
export function todayLocal() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export function validEventDate(date: string) { const d = new Date(`${date}T12:00:00`); return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(d.getTime()) && date >= todayLocal() && d.getDate() === Number(date.slice(8)); }
export const validUpi = (value: string) => /^[A-Za-z0-9._-]{2,}@[A-Za-z][A-Za-z0-9.-]{1,}$/.test(value.trim());
export const TARIFF_NOTE = 'Venue rentals and room rates follow the supplied 2026 tariff. Images, venue descriptions and suggested uses are illustrative. Capacity, timings, facilities and availability require venue confirmation.';
