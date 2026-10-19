# Luxeves Pavilion — venue booking and payment demo

Updated multi-page wedding website with the original visual design and a complete simulated checkout.

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

For a production build:

```bash
npm run build
npm start
```

Open http://localhost:3000 after `npm start`. Do not open dist/index.html directly using file://.

## Render deployment

Create a Node Web Service:

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Node version: 22 or newer

Alternatively deploy `dist` as a Static Site after `npm ci --include=dev && npm run build`. Configure a rewrite from `/*` to `/index.html` for client-side routes.

## Demo walkthrough

1. Open **Venues & Booking** (`/venues`). View each venue's details and choose a venue or combination.
2. Adjust extra rooms. One AC room is complimentary per booking; extra rooms are ₹5,000 each.
3. Continue to event details. Use **Fill sample details**, or enter your own sample values.
4. Review the quote, choose the demo advance or full payment and choose Google Pay or UPI. For UPI use `demo@upi`.
5. Acknowledge the demo notice, click Pay, then select success, failure or cancellation in the simulated approval screen.
6. Retry a failed or cancelled attempt, or complete payment and download the demo receipt directly as a PDF. Print / Save PDF uses your browser's print dialog.

## Prices from the supplied 2026 tariff

| Option | Venue rental before GST |
| --- | ---: |
| Venue 1 | ₹60,000 |
| Venue 2 | ₹50,000 |
| Venue 3 | ₹35,000 |
| Venue 1 & 2 | ₹1,00,000 |
| Venue 2 & 3 | ₹75,000 |
| Venue 1, 2 & 3 | ₹1,25,000 |

The source PDF is included at `public/KLP-TARIFF-2026.pdf`.

## Demo assumptions and limits

- No payment gateway, bank, Google Pay or UPI app is connected. No real money is transferred. No UPI PIN is collected.
- No reservation, room allocation, email or SMS is created. No live availability is checked.
- The PDF does not specify GST rate or booking advance. **18% GST** on the subtotal and a **30% advance** are clearly labelled demo assumptions. GST can be adjusted in Review & Pay under Demo price assumptions.
- Photos, descriptions, suggested celebration uses and session names are illustrative. The PDF does not specify capacity, dimensions, access timings or per-venue facilities; these require venue confirmation.
- Catering, decoration, sound and other services are excluded from the demo quote. Complimentary room policy is applied once per booking, including combinations; confirm the final policy with the venue.
- State is held in browser memory. Refreshing starts a new demo. Receipts are simulation records, not tax invoices or confirmed bookings.
- The original home page uses an external illustrative video and web fonts. These require an internet connection; bundled poster images and system font fallbacks remain available.
- This delivery uses a Vite React client app, preserving TanStack Router and existing pages. It includes a synchronized package-lock.json and a dependency-free Node production server for straightforward local and Render use.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

Tests exercise tariff totals, date and UPI validation, required fields, acknowledgement, successful Google Pay payment, UPI failure/retry/cancellation/success, and duplicate approval prevention.

For real payments, integrate a payment provider with server-side order creation and verified webhook handling, and connect a booking backend that checks availability before confirming reservations.

## Contact details and PDF receipts

The contact page and footer contain the three phone numbers from the supplied tariff, a WhatsApp link, the venue location and an embedded Google Maps search. Address reference: https://eventsmanagementkerala.com/venue/kanjiras-luxeves-pavilion-triprayar/ . No email address was supplied or verified for this venue, so the email placeholder has been replaced with WhatsApp enquiries.

PDF receipts are generated locally in the browser using pdf-lib, with embedded DejaVu fonts (license included). Payment data is not sent to a PDF service. The Download PDF receipt button downloads an application/pdf file; Print / Save PDF remains available as a fallback.
