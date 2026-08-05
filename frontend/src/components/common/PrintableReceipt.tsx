'use client';

import React from 'react';
import { formatCurrency } from '@/utils/cn';

interface PrintableReceiptProps {
  order: any;
  trackingCode?: string;
}

export function PrintableReceipt({ order, trackingCode }: PrintableReceiptProps) {
  if (!order) return null;

  const displayCode = trackingCode || order.trackingCode || order.id || '';
  const customerName = order.guestName || order.customer?.name || 'DOHS Resident';
  const customerPhone = order.guestPhone || order.customerPhone || order.customer?.phone || 'N/A';
  const customerEmail = order.guestEmail || order.customer?.email || '';
  const deliveryAddress =
    order.guestAddress ||
    (order.address
      ? [order.address.line1, order.address.area, order.address.city || 'Dhaka']
          .filter(Boolean)
          .join(', ')
      : 'DOHS Area, Dhaka');

  const items = order.items || [];
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString();

  const invoiceNo = `INV-${(order.id || '').slice(-8).toUpperCase()}`;
  const subtotal = order.subtotal ?? items.reduce((s: number, i: any) => s + (i.price || 0) * (i.quantity || 1), 0);
  const deliveryFee = order.deliveryFee ?? 50;
  const discount = order.discount ?? 0;
  const total = order.totalAmount ?? order.total ?? subtotal + deliveryFee - discount;
  const paymentMethod = order.payment?.method || order.paymentMethod || 'CASH ON DELIVERY';
  const status = order.status || 'PENDING';

  return (
    <div
      id="printable-receipt"
      style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: '#fff', color: '#111' }}
    >
      <style>{`
        @page {
          size: A4 portrait;
          margin: 10mm 10mm;
        }
        /* Hide on screen */
        #printable-receipt {
          display: none;
        }
        @media print {
          /* Make body invisible but keep layout intact */
          body * {
            visibility: hidden !important;
          }
          /* Show the receipt — use absolute (NOT fixed) to avoid page repeat */
          #printable-receipt {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
          }
          #printable-receipt * {
            visibility: visible !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div style={{ maxWidth: '780px', margin: '0 auto', background: '#fff', padding: '0' }}>

        {/* ── TOP ACCENT BAR ── */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg, #0E7A45, #28A745, #F59E0B)', borderRadius: '3px 3px 0 0', marginBottom: '0' }} />

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '20px 24px 16px', borderBottom: '2px solid #e5e7eb', background: '#f8fdf9'
        }}>
          {/* Brand Left */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0E7A45, #28A745)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '900', fontSize: '14px', letterSpacing: '-0.5px'
              }}>dS</div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0E7A45', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  DOHS SHEBA BAZAAR
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600', marginTop: '2px' }}>
                  Express Grocery &amp; Home Services Platform
                </div>
              </div>
            </div>
            <div style={{ fontSize: '9.5px', color: '#9ca3af', marginTop: '6px' }}>
              DOHS Central Market, Savar, Dhaka &nbsp;|&nbsp; Helpline: 09612-238790 &nbsp;|&nbsp; www.dohssheba.com
            </div>
          </div>

          {/* Invoice Right */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-block', padding: '5px 14px', border: '2px solid #0E7A45',
              borderRadius: '6px', fontSize: '11px', fontWeight: '900', color: '#0E7A45',
              letterSpacing: '1px', marginBottom: '8px'
            }}>
              OFFICIAL INVOICE
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>
              <div><strong style={{ color: '#374151' }}>Invoice No:</strong> {invoiceNo}</div>
              <div style={{ marginTop: '2px' }}><strong style={{ color: '#374151' }}>Date:</strong> {createdAt}</div>
            </div>
          </div>
        </div>

        {/* ── ORDER & DELIVERY INFO GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderBottom: '1px solid #e5e7eb' }}>
          {/* Order Reference */}
          <div style={{ padding: '14px 24px', borderRight: '1px solid #e5e7eb' }}>
            <div style={{
              fontSize: '9px', fontWeight: '800', color: '#0E7A45', letterSpacing: '1.5px',
              textTransform: 'uppercase', marginBottom: '8px', paddingBottom: '6px',
              borderBottom: '1px dashed #d1fae5'
            }}>Order Reference</div>
            {[
              { label: 'Order ID', value: `#${(order.id || '').slice(-8).toUpperCase()}` },
              { label: 'Tracking Code', value: displayCode, highlight: true },
              { label: 'Payment Method', value: paymentMethod },
              { label: 'Order Status', value: status },
              { label: 'Order Date', value: createdAt },
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                <span style={{ color: '#6b7280', fontWeight: '600' }}>{label}:</span>
                <span style={{
                  fontWeight: '700',
                  color: highlight ? '#d97706' : '#111827',
                  fontFamily: highlight ? 'monospace' : 'inherit'
                }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Delivery Details */}
          <div style={{ padding: '14px 24px' }}>
            <div style={{
              fontSize: '9px', fontWeight: '800', color: '#0E7A45', letterSpacing: '1.5px',
              textTransform: 'uppercase', marginBottom: '8px', paddingBottom: '6px',
              borderBottom: '1px dashed #d1fae5'
            }}>Delivery Details</div>
            {[
              { label: 'Recipient Name', value: customerName },
              { label: 'Phone', value: customerPhone },
              ...(customerEmail ? [{ label: 'Email', value: customerEmail }] : []),
              { label: 'Delivery Address', value: deliveryAddress },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: '5px', fontSize: '10px' }}>
                <span style={{ color: '#6b7280', fontWeight: '600' }}>{label}: </span>
                <span style={{ fontWeight: '700', color: '#111827' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ITEMS TABLE ── */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            fontSize: '9px', fontWeight: '800', color: '#0E7A45', letterSpacing: '1.5px',
            textTransform: 'uppercase', marginBottom: '10px'
          }}>Ordered Items</div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
            <thead>
              <tr style={{ background: '#0E7A45', color: '#fff' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '800', width: '32px', borderRadius: '4px 0 0 0' }}>#</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '800' }}>Item Description</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: '800', width: '50px' }}>Qty</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '800', width: '100px' }}>Unit Price</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '800', width: '100px', borderRadius: '0 4px 0 0' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '12px 10px', textAlign: 'center', color: '#9ca3af' }}>
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item: any, idx: number) => {
                  const prodName =
                    item.product?.name ||
                    item.product?.title ||
                    item.name ||
                    item.title ||
                    'Product Item';
                  const price = item.price || item.unitPrice || item.product?.price || 0;
                  const qty = item.quantity || 1;
                  const lineTotal = price * qty;
                  const isEven = idx % 2 === 0;

                  return (
                    <tr key={idx} style={{ background: isEven ? '#f9fafb' : '#fff', borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '9px 10px', color: '#6b7280', fontWeight: '700' }}>{idx + 1}</td>
                      <td style={{ padding: '9px 10px', fontWeight: '600', color: '#111827' }}>{prodName}</td>
                      <td style={{ padding: '9px 10px', textAlign: 'center', fontWeight: '700' }}>{qty}</td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', color: '#374151' }}>৳{formatCurrency(price)}</td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: '800', color: '#111827' }}>৳{formatCurrency(lineTotal)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── FINANCIAL SUMMARY ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 24px 20px' }}>
          <div style={{
            width: '260px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden'
          }}>
            <div style={{ background: '#f3f4f6', padding: '8px 14px', fontSize: '9px', fontWeight: '800', color: '#374151', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Price Summary
            </div>
            <div style={{ padding: '10px 14px', fontSize: '10.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '700', color: '#111827' }}>৳{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#6b7280' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: '700', color: '#111827' }}>
                  {deliveryFee === 0 ? (
                    <span style={{ color: '#0E7A45' }}>FREE</span>
                  ) : `৳${formatCurrency(deliveryFee)}`}
                </span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#0E7A45' }}>
                  <span>Discount (Coupon)</span>
                  <span style={{ fontWeight: '700' }}>- ৳{formatCurrency(discount)}</span>
                </div>
              )}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                borderTop: '2px solid #111827', marginTop: '8px', paddingTop: '8px',
                fontWeight: '900', fontSize: '13px', color: '#0E7A45'
              }}>
                <span style={{ color: '#111827' }}>Total Payable</span>
                <span>৳{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── PAYMENT STATUS BADGE ── */}
        <div style={{ padding: '0 24px 16px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '20px',
            background: '#dcfce7', border: '1px solid #86efac',
            fontSize: '10px', fontWeight: '800', color: '#166534'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            Payment Method: {paymentMethod} &nbsp;|&nbsp; Status: {status}
          </div>
        </div>

        {/* ── BARCODE-STYLE TRACKING STRIP ── */}
        <div style={{
          margin: '0 24px 16px', padding: '10px 16px', borderRadius: '8px',
          background: '#f8fdf9', border: '1px dashed #86efac',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '8.5px', color: '#6b7280', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Live Tracking Code</div>
            <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: '900', color: '#d97706', letterSpacing: '2px', marginTop: '2px' }}>
              {displayCode}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '8.5px', color: '#6b7280', fontWeight: '700' }}>Scan or visit</div>
            <div style={{ fontSize: '9.5px', fontWeight: '800', color: '#0E7A45' }}>dohssheba.com/track-order</div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          borderTop: '2px solid #e5e7eb', padding: '12px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0E7A45', marginBottom: '2px' }}>
              Thank you for shopping with DOHS Sheba Bazaar!
            </div>
            <div style={{ fontSize: '9px', color: '#9ca3af' }}>
              This is a computer-generated invoice and does not require a physical signature.
            </div>
            <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>
              Disputes &amp; returns: helpline@dohssheba.com &nbsp;|&nbsp; 09612-238790
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '90px', borderTop: '1px solid #9ca3af', paddingTop: '4px', fontSize: '8.5px', color: '#6b7280' }}>
              Authorized Signature
            </div>
          </div>
        </div>

        {/* ── BOTTOM ACCENT BAR ── */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #0E7A45, #28A745, #F59E0B)', marginTop: '0' }} />

      </div>
    </div>
  );
}
