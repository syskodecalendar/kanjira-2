import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, BedDouble, Check, CheckCircle2, ChevronRight, Download, LoaderCircle, LockKeyhole, Printer, ShieldCheck, Smartphone, XCircle } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { btn, Eyebrow } from '@/components/site/ui';
import { venueImages, VenueDetails } from '@/components/site/VenueDetails';
import { OPTIONS, optionById, quote, money, todayLocal, validEventDate, validUpi, type OptionId } from '@/lib/booking';
export const Route = createFileRoute('/booking')({
  validateSearch: (s: Record<string, unknown>) => ({ option: optionById(s['option']).id }),
  head: () => ({ meta: [{ title: 'Book Your Celebration — Luxeves Pavilion' }] }),
  component: BookingPage,
});
function BookingPage() { const { option } = Route.useSearch(); return <BookingExperience key={option} initialOption={option}/>; }
type Details = { name: string; email: string; phone: string; date: string; event: string; guests: string; slot: string; note: string };
type Status = 'idle' | 'approval' | 'processing' | 'failed' | 'cancelled' | 'success';
const initialDetails: Details = { name: '', email: '', phone: '', date: '', event: 'Wedding & Reception', guests: '', slot: 'Evening celebration', note: '' };
const steps = ['Your venue', 'Your celebration', 'Review & pay', 'Confirmation'];
function Field({ label, error, children }: { label: string; error?: string | undefined; children: ReactNode }) { return <label className="booking-field"><span>{label}</span>{children}{error && <span role="alert" className="booking-error">{error}</span>}</label>; }
function GpayMark() { return <span className="gpay-mark"><span className="gpay-g">G</span> Pay</span>; }
export function BookingExperience({ initialOption = 'v1' }: { initialOption?: OptionId }) {
  const [step, setStep] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [selected, setSelected] = useState<OptionId>(initialOption);
  const [rooms, setRooms] = useState(0);
  const [gst, setGst] = useState(18);
  const [payType, setPayType] = useState<'advance'|'full'>('advance');
  const [details, setDetails] = useState<Details>(initialDetails);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [method, setMethod] = useState<'gpay'|'upi'>('gpay');
  const [upi, setUpi] = useState('demo@upi');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [receipt, setReceipt] = useState<{ id: string; transaction: string; date: string }|null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processing = useRef(false);
  const option = optionById(selected);
  const q = quote(selected, rooms, gst, payType);
  const busy = status === 'approval' || status === 'processing';
  useEffect(() => { heading.current?.focus(); }, [step]);
  useEffect(() => () => { if(timer.current) clearTimeout(timer.current); }, []);
  const next = () => { setErrors({}); setStep(s => s+1); };
  const update = (key: keyof Details, value: string) => setDetails(d => ({ ...d, [key]: value }));
  function submitDetails(e: FormEvent) {
    e.preventDefault(); const err: Record<string,string> = {};
    if (details.name.trim().length < 2) err['name'] = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) err['email'] = 'Enter a valid email address.';
    if (!/^\+?[0-9\s()-]{7,20}$/.test(details.phone.trim()) || details.phone.replace(/\D/g,'').length < 7) err['phone'] = 'Enter a valid contact number.';
    if (!validEventDate(details.date)) err['date'] = 'Choose today or a future event date.';
    if (!/^\d+$/.test(details.guests) || Number(details.guests) < 1 || Number(details.guests) > 10000) err['guests'] = 'Enter 1–10,000 guests. Capacity still needs venue confirmation.';
    setErrors(err); if(!Object.keys(err).length) next();
  }
  function requestPayment(e: FormEvent) {
    e.preventDefault(); if(busy || status === 'success') return;
    const err: Record<string,string> = {};
    if(!consent) err['consent'] = 'Please acknowledge this is a demo.';
    if(method === 'upi' && !validUpi(upi)) err['upi'] = 'Use a sample UPI ID such as demo@upi.';
    setErrors(err); if(!Object.keys(err).length) setStatus('approval');
  }
  function outcome(result: 'success'|'failed'|'cancelled') {
    if(processing.current || status !== 'approval') return;
    if(result === 'cancelled') { setStatus('cancelled'); return; }
    processing.current = true; setStatus('processing');
    timer.current = setTimeout(() => {
      processing.current = false;
      if(result === 'success') {
        const id = crypto.randomUUID().replace(/-/g,'').slice(0,10).toUpperCase();
        setReceipt({ id: `DEMO-KLP-${id}`, transaction: `SIM-${crypto.randomUUID().slice(0,8).toUpperCase()}`, date: new Date().toLocaleString('en-IN') });
        setStatus('success'); setStep(4);
      } else setStatus('failed');
    }, 1400);
  }
  async function downloadReceipt() {
    if (!receipt || downloading) return;
    setDownloading(true); setDownloadError('');
    try {
      const { buildReceiptPdf } = await import('@/lib/receipt-pdf');
      const bytes = await buildReceiptPdf({
        reference: receipt.id, transaction: receipt.transaction, created: receipt.date,
        name: details.name, email: details.email, phone: details.phone,
        venue: option.name, event: details.event, date: details.date, session: details.slot,
        guests: details.guests, rooms, method, advance: payType === 'advance', gst,
        venueCost: q.venue, roomCost: q.roomCost, subtotal: q.subtotal, tax: q.tax,
        total: q.total, paid: q.due, balance: q.balance,
      });
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = `${receipt.id}-receipt.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setDownloadError('The PDF could not be downloaded. Please try again, or use Print / Save PDF.');
    } finally { setDownloading(false); }
  }
  function reset() { setReceipt(null); setStatus('idle'); setConsent(false); setDetails(initialDetails); setErrors({}); setStep(1); }
  const sampleDetails = () => { const d = new Date();d.setDate(d.getDate()+30);setDetails({ ...initialDetails, name:'Alex & Sam', email:'couple@example.com',phone:'+91 90000 00000',date:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,guests:'150' });setErrors({}); };
  return <div className="booking-page">
    <div className="container-x pb-20 pt-10 md:pt-14">
      <div className="booking-topline"><Link to="/venues" className="inline-flex items-center gap-2 text-sm"><ArrowLeft className="size-4"/>All venues</Link><span className="demo-badge"><ShieldCheck className="size-4"/>Interactive demo · No real charges</span></div>
      <div className="mt-9"><Eyebrow>A little closer to your day</Eyebrow><h1 ref={heading} tabIndex={-1} className="booking-title mt-4 outline-none">{step === 4 ? <>Your celebration,<br/><em>beautifully imagined.</em></> : <>Make room for<br/><em>your forever.</em></>}</h1><p className="mt-4 max-w-xl text-base text-muted-foreground">Choose your space, tell us about your day, and experience a complete booking and payment demonstration.</p></div>
      <ol className="booking-steps" aria-label="Booking progress">{steps.map((title,i) => <li key={title} aria-current={step === i+1 ? 'step' : undefined} className={step === i+1 ? 'is-current' : step > i+1 ? 'is-complete' : ''}><span>{step > i+1 ? <Check className="size-4"/> : `0${i+1}`}</span><p>{title}</p>{i<3 && <ChevronRight className="step-arrow size-4"/>}</li>)}</ol>
      <div className={`booking-layout ${step===4 ? 'booking-complete' : ''}`}>
        <div className="min-w-0">
          {step === 1 && <section className="booking-panel"><p className="eyebrow text-accent">01 / Choose your space</p><h2 className="mt-3 text-4xl">Where will your story unfold?</h2><p className="mt-3 text-sm text-muted-foreground">Published venue rental options. All prices are before GST.</p>
            <fieldset className="mt-7"><legend className="sr-only">Venue option</legend><div className="grid gap-3 sm:grid-cols-2">{OPTIONS.map(o => <label key={o.id} className={`booking-option ${selected === o.id ? 'selected' : ''}`}><input type="radio" name="venue" value={o.id} checked={selected === o.id} onChange={()=>setSelected(o.id)}/><div><p className="font-display text-2xl">{o.name}</p><p className="mt-1 text-base">{money(o.price)} <small>+ GST</small></p><p className="mt-1 text-xs text-muted-foreground">{o.venues.length===1 ? 'Individual venue' : `${o.venues.length} venues together`}</p></div></label>)}</div></fieldset>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">{option.venues.map(id=><VenueDetails key={id} id={id}/>)}</div>
            <div className="mt-8 border-t pt-6"><h3 className="flex items-center gap-3 text-2xl"><BedDouble className="size-5 text-accent"/>A room for the occasion</h3><p className="mt-2 text-sm text-muted-foreground">One complimentary AC room during the event, per booking. Extra rooms are ₹5,000 each.</p><div className="mt-4 flex items-center justify-between gap-4"><label htmlFor="extra-rooms" className="text-sm">Additional rooms</label><div className="room-counter"><button type="button" aria-label="Remove a room" disabled={rooms===0} onClick={()=>setRooms(r=>Math.max(0,r-1))}>−</button><output id="extra-rooms" aria-label="Additional room count">{rooms}</output><button type="button" aria-label="Add a room" disabled={rooms===20} onClick={()=>setRooms(r=>Math.min(20,r+1))}>+</button></div></div><p className="mt-3 text-xs text-muted-foreground">Room availability is not checked in this demo.</p></div>
            <div className="booking-actions"><button className={btn.solid} onClick={next}>Continue to event details <ArrowRight className="size-4"/></button></div>
          </section>}
          {step === 2 && <form onSubmit={submitDetails} noValidate className="booking-panel"><p className="eyebrow text-accent">02 / Your celebration</p><h2 className="mt-3 text-4xl">Tell us about your day.</h2><div className="mt-4 flex flex-wrap items-center gap-3"><p className="text-sm text-muted-foreground">Use sample details to explore the demo.</p><button type="button" onClick={sampleDetails} className="venue-detail-link text-sm">Fill sample details</button></div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Your name" error={errors['name']}><input value={details.name} onChange={e=>update('name',e.target.value)} autoComplete="name" placeholder="Full name" required/></Field><Field label="Email address" error={errors['email']}><input type="email" value={details.email} onChange={e=>update('email',e.target.value)} autoComplete="email" placeholder="you@example.com" required/></Field><Field label="Phone / WhatsApp" error={errors['phone']}><input type="tel" value={details.phone} onChange={e=>update('phone',e.target.value)} autoComplete="tel" placeholder="+91" required/></Field><Field label="Event date" error={errors['date']}><input type="date" min={todayLocal()} value={details.date} onChange={e=>update('date',e.target.value)} required/></Field><Field label="Celebration type"><select value={details.event} onChange={e=>update('event',e.target.value)}>{['Wedding & Reception','Engagement','Haldi / Mehndi','Private celebration','Other celebration'].map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Estimated guests" error={errors['guests']}><input type="number" min="1" max="10000" value={details.guests} onChange={e=>update('guests',e.target.value)} placeholder="e.g. 150" required/></Field><Field label="Preferred session (illustrative)"><select value={details.slot} onChange={e=>update('slot',e.target.value)}>{['Morning celebration','Evening celebration','Full-day celebration'].map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Message (optional)"><input value={details.note} onChange={e=>update('note',e.target.value)} placeholder="Anything you would like us to know?" maxLength={500}/></Field></div>
            <div className="booking-note mt-6"><CalendarNote/>Dates and sessions are demonstration selections. This does not check live availability or hold a date. Event timings, duration and guest capacity must be confirmed by the venue.</div>
            <div className="booking-actions"><button type="button" className="booking-back" onClick={()=>setStep(1)}><ArrowLeft className="size-4"/>Back</button><button type="submit" className={btn.solid}>Review & payment <ArrowRight className="size-4"/></button></div>
          </form>}
          {step === 3 && <section className="booking-panel"><p className="eyebrow text-accent">03 / A final look</p><h2 className="mt-3 text-4xl">Everything, at a glance.</h2>
            <div className="review-details mt-6"><div><p className="review-label">Your celebration</p><strong>{details.event}</strong><p>{details.date} · {details.slot}</p><p>{details.guests} guests · {option.name}</p></div><div><p className="review-label">Your contact</p><strong>{details.name}</strong><p className="break-all">{details.email}</p><p>{details.phone}</p></div><button onClick={()=>{setStep(2);setErrors({});}} className="venue-detail-link">Edit details</button></div>
            {details.note && <p className="mt-3 text-sm text-muted-foreground">Your note: {details.note}</p>}
            <fieldset className="mt-8"><legend className="mb-3 font-medium">Choose your demo payment amount</legend><div className="grid gap-3 sm:grid-cols-2"><label className={`booking-option ${payType==='advance'?'selected':''}`}><input type="radio" name="pay-type" checked={payType==='advance'} onChange={()=>setPayType('advance')}/><div><strong className="text-sm">30% booking advance</strong><p className="mt-1 font-display text-2xl">{money(quote(selected,rooms,gst,'advance').due)}</p><p className="text-xs text-muted-foreground">Demo assumption</p></div></label><label className={`booking-option ${payType==='full'?'selected':''}`}><input type="radio" name="pay-type" checked={payType==='full'} onChange={()=>setPayType('full')}/><div><strong className="text-sm">Pay in full</strong><p className="mt-1 font-display text-2xl">{money(q.total)}</p><p className="text-xs text-muted-foreground">Entire estimated rental</p></div></label></div></fieldset>
            <details className="mt-5 border-b pb-5"><summary className="cursor-pointer text-sm text-muted-foreground">Demo price assumptions</summary><div className="mt-3 text-sm"><p className="mb-3">The tariff states “+ GST” without a rate or advance policy. This demo uses 18% GST on venue rental and additional rooms, and a 30% advance. Confirm both with the venue.</p><label className="flex items-center gap-3">Demo GST rate<select aria-label="Demo GST rate" value={gst} onChange={e=>setGst(Number(e.target.value))} className="border bg-background p-2">{[0,5,12,18,28].map(n=><option key={n} value={n}>{n}%</option>)}</select></label></div></details>
            <form onSubmit={requestPayment} noValidate className="mt-7"><fieldset><legend className="mb-4 font-medium">Payment method</legend><div className="grid gap-3 sm:grid-cols-2"><label className={`payment-method ${method==='gpay'?'selected':''}`}><input type="radio" name="method" checked={method==='gpay'} onChange={()=>{setMethod('gpay');setStatus('idle');setErrors({});}}/><GpayMark/><span className="mt-2 text-xs text-muted-foreground">Google Pay simulation</span></label><label className={`payment-method ${method==='upi'?'selected':''}`}><input type="radio" name="method" checked={method==='upi'} onChange={()=>{setMethod('upi');setStatus('idle');setErrors({});}}/><span className="upi-mark">UPI <span>▸</span></span><span className="mt-2 text-xs text-muted-foreground">Pay with a sample UPI ID</span></label></div></fieldset>
            {method==='upi' && <div className="mt-5"><Field label="Sample UPI ID" error={errors['upi']}><input value={upi} onChange={e=>setUpi(e.target.value)} placeholder="demo@upi" autoComplete="off" spellCheck={false}/></Field><p className="mt-2 text-xs text-muted-foreground">Use sample information. No request is sent to a bank or payment app.</p></div>}
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--primary)]"/><span>I understand this is a demo. No money will be transferred and no venue or rooms will be reserved. Prices, availability and booking terms require venue confirmation.</span></label>{errors['consent'] && <p role="alert" className="booking-error mt-2">{errors['consent']}</p>}
            {(status==='failed' || status==='cancelled') && <div role="alert" className="payment-result-error mt-5"><XCircle className="size-5 shrink-0"/><div><strong>{status==='failed'?'Demo payment failed':'Demo payment cancelled'}</strong><p className="mt-1 text-sm">No money was charged and no booking was created. Your selections are still here. Try again or choose another method.</p></div></div>}
            <div className="booking-actions"><button type="button" disabled={busy} className="booking-back" onClick={()=>{setStep(2);setStatus('idle');}}><ArrowLeft className="size-4"/>Back</button><button type="submit" disabled={busy} className={btn.solid}><LockKeyhole className="size-4"/>{status==='failed'||status==='cancelled'?'Retry demo payment':'Pay'} {money(q.due)} · Demo</button></div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Payment simulation only. No bank details or UPI PIN required.</p></form>
          </section>}
          {step === 4 && receipt && <section className="booking-panel demo-receipt" id="demo-receipt"><div className="receipt-watermark">DEMO RECEIPT · NOT A RESERVATION</div><div className="receipt-check"><CheckCircle2 className="size-10"/></div><p className="eyebrow mt-5 text-center text-accent">Demo payment successful</p><h2 className="mt-4 text-center text-4xl md:text-5xl">A beautiful day, one step closer.</h2><p className="mx-auto mt-4 max-w-lg text-center text-sm text-muted-foreground">You’ve completed the demo. No real money was transferred and no booking has been confirmed.</p>
            <div className="receipt-amount"><span>Simulated amount paid</span><strong>{money(q.due)}</strong><small>via {method==='gpay'?'Google Pay':'UPI'} · {payType==='advance'?'30% demo advance':'Full demo payment'}</small></div>
            <dl className="receipt-grid"><div><dt>Demo reference</dt><dd>{receipt.id}</dd></div><div><dt>Simulated transaction</dt><dd>{receipt.transaction}</dd></div><div><dt>Venue selection</dt><dd>{option.name}</dd></div><div><dt>Event date & session</dt><dd>{details.date}<br/>{details.slot}</dd></div><div><dt>Celebration</dt><dd>{details.event} · {details.guests} guests</dd></div><div><dt>Contact name</dt><dd>{details.name}</dd></div><div><dt>Rooms</dt><dd>1 complimentary + {rooms} additional</dd></div><div><dt>Created</dt><dd>{receipt.date}</dd></div></dl>
            <div className="receipt-totals"><p><span>Venue rent</span><span>{money(q.venue)}</span></p><p><span>Additional rooms</span><span>{money(q.roomCost)}</span></p><p><span>Demo GST ({gst}%)</span><span>{money(q.tax)}</span></p><p><strong>Estimated total</strong><strong>{money(q.total)}</strong></p><p><span>Illustrative balance</span><strong>{money(q.balance)}</strong></p></div>
            <div className="booking-note mt-6">This is a demonstration receipt, not a tax invoice. GST and advance percentage are sample assumptions. No confirmation email or SMS has been sent. Contact the venue to confirm availability, booking terms and the final quote.</div>
            {downloadError && <p role="alert" className="booking-error mt-4">{downloadError}</p>}
            <div className="receipt-buttons mt-7 flex flex-wrap gap-3"><button onClick={downloadReceipt} disabled={downloading} className={btn.solid}>{downloading ? <LoaderCircle className="size-4 animate-spin"/> : <Download className="size-4"/>}{downloading ? "Preparing PDF…" : "Download PDF receipt"}</button><button onClick={()=>window.print()} className={btn.outline}><Printer className="size-4"/>Print / Save PDF</button><button onClick={reset} className="venue-detail-link">Start another demo</button></div>
          </section>}
        </div>
        {step < 4 && <aside className="booking-summary" aria-label="Booking cost summary"><div className="relative"><img src={venueImages[option.venues[0] ?? 'v1']} alt="Illustrative celebration setting" className="h-44 w-full object-cover"/><span className="summary-image-label">Your celebration at Luxeves</span></div><div className="p-6"><p className="eyebrow text-accent">Your selection</p><h2 className="mt-3 text-3xl">{option.name}</h2><p className="mt-2 text-xs text-muted-foreground">{option.venues.length} {option.venues.length===1?'venue':'venues'} · 1 complimentary AC room</p>{details.date && <p className="mt-3 border-t pt-3 text-sm">{details.date} · {details.guests || '—'} guests</p>}<dl className="summary-costs"><div><dt>Venue rental</dt><dd>{money(q.venue)}</dd></div><div><dt>Additional rooms ({rooms})</dt><dd>{money(q.roomCost)}</dd></div><div><dt>Subtotal</dt><dd>{money(q.subtotal)}</dd></div><div><dt>GST ({gst}% demo rate)</dt><dd>{money(q.tax)}</dd></div><div className="summary-total"><dt>Estimated total</dt><dd>{money(q.total)}</dd></div></dl><div className="summary-due"><span>{payType==='advance'?'30% demo advance':'Full demo payment'}</span><strong>{money(q.due)}</strong><p>Illustrative balance: {money(q.balance)}</p></div><p className="mt-4 text-xs text-muted-foreground">Venue and room rates from the 2026 tariff. GST and 30% advance are demo assumptions. Catering, decor and other services excluded.</p><div className="mt-5 flex items-start gap-2 border-t pt-4 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0"/>No payment gateway is connected. No real reservation is created.</div></div></aside>}
      </div>
    </div>
    <div className="demo-footer-note">A planning experience, made for you. <span>Demo only · Luxeves Pavilion</span></div>
    <PaymentDialog open={busy} processing={status==='processing'} method={method} upi={upi} amount={q.due} venue={option.name} onOutcome={outcome}/>
  </div>;
}
function CalendarNote() { return <ShieldCheck className="size-5 shrink-0 text-accent"/>; }
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
function PaymentDialog({ open, processing, method, upi, amount, venue, onOutcome }: { open: boolean; processing: boolean; method: string; upi: string; amount: number; venue: string; onOutcome: (s:'success'|'failed'|'cancelled')=>void }) {
  return <Dialog open={open} onOpenChange={value=>{ if(!value && !processing) onOutcome('cancelled'); }}><DialogContent className="payment-sheet sm:max-w-md" onInteractOutside={e=>{if(processing)e.preventDefault();}} onEscapeKeyDown={e=>{if(processing)e.preventDefault();}}>
    <div className="demo-badge mx-auto">Demo payment approval</div><div className="mx-auto mt-3">{method==='gpay'?<GpayMark/>:<span className="upi-mark">UPI ▸</span>}</div><DialogTitle className="text-center font-display text-3xl">{processing?'Confirming your demo payment…':'Simulate payment approval'}</DialogTitle><DialogDescription className="text-center">{processing?'Please wait while the demo completes.':'This screen simulates approval inside your payment app. No app opens and no bank is contacted.'}</DialogDescription><div className="payment-payee"><span className="payee-monogram">L</span><p>Luxeves Pavilion<small>{venue}</small></p></div><div className="payment-approval-amount">{money(amount)}<span>{method==='gpay'?'Google Pay · demo account':`${upi} · sample ID`}</span></div>
    {processing?<div role="status" className="flex justify-center gap-3 py-6 text-sm"><LoaderCircle className="size-5 animate-spin"/>Processing simulation…</div>:<div className="grid gap-3"><button onClick={()=>onOutcome('success')} className={btn.solid}><CheckCircle2 className="size-4"/>Simulate successful payment</button><button onClick={()=>onOutcome('failed')} className="payment-fail-button">Simulate payment failure</button><button onClick={()=>onOutcome('cancelled')} className="py-2 text-sm text-muted-foreground">Cancel payment</button></div>}<p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><Smartphone className="size-4"/>Never enter a real UPI PIN in this demo.</p>
  </DialogContent></Dialog>;
}
