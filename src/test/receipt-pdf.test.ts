// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildReceiptPdf, type ReceiptData } from '@/lib/receipt-pdf';
const fonts={sans:new Uint8Array(readFileSync('src/assets/fonts/DejaVuSans.ttf')),serif:new Uint8Array(readFileSync('src/assets/fonts/DejaVuSerif.ttf'))};
const data: ReceiptData={reference:'DEMO-KLP-1234567890',transaction:'SIM-12345678',created:'19/10/2026, 6:15:00 pm',name:'Alex & Sam',email:'couple@example.com',phone:'+91 90000 00000',venue:'Venue 1, 2 & 3',event:'Wedding & Reception',date:'2026-11-18',session:'Evening celebration',guests:'150',rooms:2,method:'gpay',advance:true,gst:18,venueCost:125000,roomCost:10000,subtotal:135000,tax:24300,total:159300,paid:47790,balance:111510};
describe('Receipt PDF export',()=>{
  it('creates a genuine, readable one-page A4 PDF',async()=>{const bytes=await buildReceiptPdf(data,fonts);expect(new TextDecoder().decode(bytes.slice(0,5))).toBe('%PDF-');const doc=await PDFDocument.load(bytes);expect(doc.getPageCount()).toBe(1);expect(doc.getTitle()).toContain(data.reference);expect(doc.getPage(0).getWidth()).toBeCloseTo(595.28);});
  it('wraps unusually long values without crashing or losing the PDF structure',async()=>{const bytes=await buildReceiptPdf({...data,name:'Alex '.repeat(50),email:'a'.repeat(200)+'@example.com',method:'upi',advance:false},fonts);const doc=await PDFDocument.load(bytes);expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);expect(doc.getSubject()).toContain('Not a reservation');});
});
