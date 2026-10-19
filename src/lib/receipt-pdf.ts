import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export type ReceiptData = {
  reference: string; transaction: string; created: string;
  name: string; email: string; phone: string; venue: string;
  event: string; date: string; session: string; guests: string; rooms: number;
  method: 'gpay' | 'upi'; advance: boolean; gst: number;
  venueCost: number; roomCost: number; subtotal: number; tax: number; total: number; paid: number; balance: number;
};
type Fonts = { sans: Uint8Array; serif: Uint8Array };
const amount = (n: number) => `INR ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
const C = { ink: rgb(.15,.23,.26), muted: rgb(.40,.44,.44), gold: rgb(.62,.43,.24), paper: rgb(.98,.97,.94), line: rgb(.84,.82,.77), white: rgb(1,1,1) };
async function fetchFont(url: string) { const r = await fetch(url); if(!r.ok) throw new Error('Receipt font could not be loaded. Please try again.');return new Uint8Array(await r.arrayBuffer()); }
export async function buildReceiptPdf(data: ReceiptData, providedFonts?: Fonts): Promise<Uint8Array> {
  const fonts = providedFonts ?? { sans: await fetchFont(new URL('../assets/fonts/DejaVuSans.ttf', import.meta.url).href), serif: await fetchFont(new URL('../assets/fonts/DejaVuSerif.ttf', import.meta.url).href) };
  const doc = await PDFDocument.create();doc.registerFontkit(fontkit);
  const sans = await doc.embedFont(fonts.sans, { subset: true });
  const serif = await doc.embedFont(fonts.serif, { subset: true });
  doc.setTitle(`Kanjira’s Luxeves - Demo Receipt ${data.reference}`);doc.setAuthor('Kanjira’s Luxeves Pavilion');doc.setSubject('Payment simulation only. Not a reservation or tax invoice.');
  const W = 595.28, H = 841.89, M = 42, inner = W-2*M;
  let page!: PDFPage;let y = 0;let pageNumber = 0;
  const clean = (text: string, font: PDFFont) => { const glyphs = new Set(font.getCharacterSet()); return Array.from(String(text).replace(/[\r\n\t]/g,' ')).map(c => glyphs.has(c.codePointAt(0)!) ? c : '?').join(''); };
  function draw(text: string, x: number, top: number, size = 10, font = sans, color = C.ink) { page.drawText(clean(text,font), { x, y:H-top-size, size,font,color }); }
  function line(top: number) { page.drawLine({start:{x:M,y:H-top},end:{x:W-M,y:H-top},thickness:.6,color:C.line}); }
  function startPage() {
    page = doc.addPage([W,H]);pageNumber++;
    page.drawRectangle({x:0,y:H-108,width:W,height:108,color:C.ink});
    draw("KANJIRA'S",M,16,9,sans,rgb(.83,.76,.62));
    draw('LUXEVES PAVILION',M,33,23,serif,C.white);
    draw('CELEBRATIONS EMBRACED BY NATURE',M,65,8,sans,rgb(.83,.76,.62));
    draw('DEMO RECEIPT',W-M-115,36,11,sans,C.white);
    draw('No real payment',W-M-115,59,8,sans,rgb(.83,.86,.85));
    line(H-46);draw('SIMULATION ONLY - NOT A RESERVATION OR TAX INVOICE',M,H-35,7,sans,C.muted);
    draw(String(pageNumber),W-M-10,H-35,7,sans,C.muted);y=125;
  }
  function ensure(height: number) { if(y+height > H-65) startPage(); }
  function wrap(text: string, width: number, size: number, font = sans) {
    const result: string[]=[];let current='';
    for(const word of clean(text,font).split(/\s+/)) {
      const candidate=current ? `${current} ${word}` : word;
      if(font.widthOfTextAtSize(candidate,size)<=width) { current=candidate;continue; }
      if(current) {result.push(current);current='';}
      for(const character of Array.from(word)) {
        if(current && font.widthOfTextAtSize(current+character,size)>width) {result.push(current);current='';}
        current+=character;
      }
    }
    if(current || !result.length) result.push(current);
    return result;
  }
  function paragraph(text: string, size=9, color=C.muted) { const rows=wrap(text,inner,size);for(const row of rows){ensure(size+8);draw(row,M,y,size,sans,color);y+=size+5;} }
  function section(title: string) {ensure(45); y+=8;draw(title.toUpperCase(),M,y,8,sans,C.gold);y+=18;}
  function gridRow(left: [string,string], right: [string,string]) {
    const width = (inner-28)/2;
    const cols = [left,right].map(([label,value]) => ({ label, rows: wrap(value,width,9) }));
    const height = Math.max(...cols.map(c=>c.rows.length))*13+18;
    ensure(height);
    cols.forEach((col,i)=>{ const x=M+i*(width+28);draw(col.label.toUpperCase(),x,y,7,sans,C.muted);col.rows.forEach((row,j)=>draw(row,x,y+12+j*13,9)); });
    y+=height;
  }
  function cost(label: string, value: number, strong=false) {ensure(26);draw(label,M,y,strong?11:9,sans,strong?C.ink:C.muted);const text=amount(value);const size=strong?12:10;draw(text,W-M-sans.widthOfTextAtSize(text,size),y,size);y+=strong?25:20;}
  startPage();
  draw('Demo payment successful',M,y,23,serif);y+=32;
  paragraph('A record of your simulated payment. No money was transferred or booking confirmed.');y+=8;
  ensure(77);page.drawRectangle({x:M,y:H-y-69,width:inner,height:69,color:C.paper});
  draw('SIMULATED AMOUNT PAID',M+16,y+11,8,sans,C.gold);draw(amount(data.paid),M+16,y+26,24,serif);
  const method=data.method==='gpay'?'Google Pay':'UPI';draw(`${method} - ${data.advance?'30% demo advance':'Full demo payment'}`,M+16,y+55,8,sans,C.muted);y+=79;
  section('Payment reference');
  gridRow(['Demo reference',data.reference],['Simulated transaction',data.transaction]);
  gridRow(['Created',data.created],['Payment method',`${method} (simulation)`]);
  section('Your celebration & contact');
  gridRow(['Venue',data.venue],['Celebration',data.event]);
  gridRow(['Event date / sample session',`${data.date} / ${data.session}`],['Guests / rooms',`${data.guests} guests / 1 free + ${data.rooms} extra rooms`]);
  gridRow(['Contact name',data.name],['Phone',data.phone]);
  gridRow(['Email',data.email],['Room inclusion','One complimentary AC room during the event']);
  section('Price summary');cost('Venue rental',data.venueCost);cost(`Additional rooms (${data.rooms})`,data.roomCost);cost('Subtotal',data.subtotal);cost(`GST (${data.gst}% demo rate)`,data.tax);ensure(12);line(y);y+=10;cost('Estimated total',data.total,true);cost('Simulated amount paid',data.paid);cost('Illustrative balance',data.balance);
  section('Please note');paragraph('Demo only: no money, reservation, email or SMS. Not a tax invoice. GST and 30% advance are sample assumptions. Final price, availability and booking terms require venue confirmation. Catering, decor and other services are excluded.');y+=6;
  paragraph('Venue enquiries: +91 95 77 33 11 22 | +91 99 95 12 77 99 | +91 99 95 42 77 99',8);
  return doc.save();
}
