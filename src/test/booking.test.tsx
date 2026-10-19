import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OPTIONS, quote, validEventDate, validUpi } from '@/lib/booking';
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return { ...actual, Link: ({ children, to, search: _search, ...rest }: any) => <a href={to} {...rest}>{children}</a> };
});
vi.mock('@/lib/receipt-pdf', () => ({ buildReceiptPdf: vi.fn(async () => new Uint8Array([37,80,68,70,45,49,46,55])) }));
import { BookingExperience } from '@/routes/booking';
afterEach(() => { cleanup();vi.useRealTimers();vi.restoreAllMocks(); });
function goToPayment() {
  render(<BookingExperience/>);
  fireEvent.click(screen.getByRole('button',{name:/Continue to event details/}));
  fireEvent.click(screen.getByRole('button',{name:'Fill sample details'}));
  fireEvent.click(screen.getByRole('button',{name:/Review & payment/}));
  fireEvent.click(screen.getByRole('checkbox'));
}
function openPayment() { fireEvent.click(screen.getByRole('button',{name:/Pay ₹|Retry demo payment/})); }
describe('Venue price and payment calculations',()=>{
  it('retains all six published prices',()=>{expect(OPTIONS.map(o=>o.price)).toEqual([60000,50000,35000,100000,75000,125000]);});
  it('calculates rooms, GST, advance and balance without taxing the free room',()=>{expect(quote('v123',2,18,'advance')).toEqual({venue:125000,roomCost:10000,subtotal:135000,tax:24300,total:159300,due:47790,balance:111510});});
  it('supports full payment and a zero demo tax rate',()=>{expect(quote('v3',0,0,'full')).toMatchObject({total:35000,due:35000,balance:0});});
  it('validates future dates and sample UPI IDs',()=>{expect(validEventDate('2000-01-01')).toBe(false);expect(validEventDate('2099-02-30')).toBe(false);expect(validEventDate('2099-12-31')).toBe(true);expect(validUpi('demo@upi')).toBe(true);expect(validUpi('invalid')).toBe(false);});
});
describe('Complete demo checkout',()=>{
  it('blocks empty contact details and allows correcting them',()=>{render(<BookingExperience/>);fireEvent.click(screen.getByRole('button',{name:/Continue to event details/}));fireEvent.click(screen.getByRole('button',{name:/Review & payment/}));expect(screen.getByText('Enter your full name.')).toBeInTheDocument();expect(screen.getByText('Choose today or a future event date.')).toBeInTheDocument();});
  it('requires acknowledgement and validates UPI format',()=>{goToPayment();fireEvent.click(screen.getByRole('checkbox'));openPayment();expect(screen.getByText('Please acknowledge this is a demo.')).toBeInTheDocument();fireEvent.click(screen.getByRole('checkbox'));fireEvent.click(screen.getByText('Pay with a sample UPI ID'));fireEvent.change(screen.getByLabelText('Sample UPI ID'),{target:{value:'invalid'}});openPayment();expect(screen.getByText('Use a sample UPI ID such as demo@upi.')).toBeInTheDocument();});
  it('completes Google Pay approval once and offers a demo receipt',async()=>{goToPayment();openPayment();vi.useFakeTimers();const approve=screen.getByRole('button',{name:'Simulate successful payment'});fireEvent.click(approve);fireEvent.click(approve);expect(screen.getByRole('status')).toHaveTextContent('Processing simulation');await act(async()=>{vi.advanceTimersByTime(1500);});expect(screen.getByText('Demo payment successful')).toBeInTheDocument();expect(screen.getByRole('button',{name:'Download PDF receipt'})).toBeInTheDocument();expect(screen.getAllByText(/DEMO-KLP-/)).toHaveLength(1);
    const createUrl=vi.fn((_blob: Blob)=> 'blob:demo-receipt');Object.defineProperty(URL,'createObjectURL',{configurable:true,writable:true,value:createUrl});
    Object.defineProperty(URL,'revokeObjectURL',{configurable:true,writable:true,value:vi.fn()});
    const anchorClick=vi.spyOn(HTMLAnchorElement.prototype,'click').mockImplementation(function(this:HTMLAnchorElement){expect(this.download).toMatch(/-receipt\.pdf$/);});
    await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Download PDF receipt'}));});
    expect(createUrl).toHaveBeenCalledOnce();expect(createUrl.mock.calls[0]?.[0]).toMatchObject({type:'application/pdf'});expect(anchorClick).toHaveBeenCalledOnce();});
  it('handles failure, retry, cancellation and then successful UPI payment',async()=>{goToPayment();fireEvent.click(screen.getByText('Pay with a sample UPI ID'));openPayment();vi.useFakeTimers();fireEvent.click(screen.getByRole('button',{name:'Simulate payment failure'}));await act(async()=>{vi.advanceTimersByTime(1500);});expect(screen.getByText('Demo payment failed')).toBeInTheDocument();openPayment();fireEvent.click(screen.getByRole('button',{name:'Cancel payment'}));expect(screen.getByText('Demo payment cancelled')).toBeInTheDocument();openPayment();fireEvent.click(screen.getByRole('button',{name:'Simulate successful payment'}));await act(async()=>{vi.advanceTimersByTime(1500);});expect(screen.getByText('Demo payment successful')).toBeInTheDocument();expect(screen.getByText(/via UPI/)).toBeInTheDocument();});
});
