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
  const deliveryAddress = order.guestAddress || (order.address ? `${order.address.line1}, ${order.address.area}, ${order.address.city || 'Dhaka'}` : 'DOHS Area, Dhaka');
  const items = order.items || [];
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' }) : new Date().toLocaleString();

  return (
    <div id="printable-receipt" className="hidden print:block p-8 bg-white text-black font-sans max-w-3xl mx-auto border border-slate-300">
      
      {/* ── Receipt Header ── */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-black uppercase text-emerald-800 tracking-tight">DOHS SHEBA BAZAAR</h1>
          <p className="text-xs text-slate-600 font-semibold">Express Grocery & Home Services Platform</p>
          <p className="text-xs text-slate-500 mt-1">DOHS Central Market | Helpline: (09612) 238-7908 | www.dohssheba.com</p>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs uppercase rounded border border-emerald-300">
            OFFICIAL INVOICE
          </span>
          <p className="text-xs text-slate-600 font-mono mt-2">Date: {createdAt}</p>
        </div>
      </div>

      {/* ── Order & Recipient Metadata Grid ── */}
      <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs">
        <div>
          <h3 className="font-extrabold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
            Order Reference
          </h3>
          <p className="py-0.5"><strong className="text-slate-700">Order ID:</strong> #{order.id?.slice(-8).toUpperCase()}</p>
          <p className="py-0.5"><strong className="text-slate-700">Tracking Code:</strong> <span className="font-mono font-bold text-amber-700">{displayCode}</span></p>
          <p className="py-0.5"><strong className="text-slate-700">Payment Method:</strong> {order.payment?.method || 'CASH ON DELIVERY'}</p>
          <p className="py-0.5"><strong className="text-slate-700">Order Status:</strong> {order.status}</p>
        </div>

        <div>
          <h3 className="font-extrabold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
            Delivery Details
          </h3>
          <p className="py-0.5"><strong className="text-slate-700">Recipient Name:</strong> {customerName}</p>
          <p className="py-0.5"><strong className="text-slate-700">Phone Number:</strong> {customerPhone}</p>
          <p className="py-0.5"><strong className="text-slate-700">Address:</strong> {deliveryAddress}</p>
        </div>
      </div>

      {/* ── Purchased Items Table ── */}
      <table className="w-full text-xs text-left mb-6 border-collapse">
        <thead>
          <tr className="bg-slate-900 text-white font-bold uppercase">
            <th className="p-2.5 border border-slate-900">#</th>
            <th className="p-2.5 border border-slate-900">Item Description</th>
            <th className="p-2.5 text-center border border-slate-900">Qty</th>
            <th className="p-2.5 text-right border border-slate-900">Unit Price (৳)</th>
            <th className="p-2.5 text-right border border-slate-900">Total (৳)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, idx: number) => {
            const prodName = item.product?.name || item.name || 'Product Item';
            const price = item.price || item.unitPrice || 0;
            const lineTotal = price * (item.quantity || 1);
            return (
              <tr key={idx} className="border-b border-slate-200">
                <td className="p-2 border border-slate-200 font-bold text-slate-600">{idx + 1}</td>
                <td className="p-2 border border-slate-200 font-semibold">{prodName}</td>
                <td className="p-2 border border-slate-200 text-center font-bold">{item.quantity || 1}</td>
                <td className="p-2 border border-slate-200 text-right">৳{formatCurrency(price)}</td>
                <td className="p-2 border border-slate-200 text-right font-bold">৳{formatCurrency(lineTotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Financial Summary ── */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1.5 text-xs bg-slate-50 p-3.5 rounded border border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold">৳{formatCurrency(order.subtotal || order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee:</span>
            <span className="font-bold">{order.deliveryFee === 0 ? 'FREE' : `৳${formatCurrency(order.deliveryFee)}`}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount:</span>
              <span className="font-bold">-৳{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-black text-sm text-slate-900">
            <span>Total Payable:</span>
            <span className="text-emerald-800">৳{formatCurrency(order.totalAmount || order.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Footer Terms & Signatures ── */}
      <div className="border-t border-slate-300 pt-4 text-[11px] text-slate-500 flex justify-between items-center">
        <div>
          <p className="font-bold text-slate-700">Thank you for shopping with DOHS Sheba Bazaar!</p>
          <p>For instant support or status updates, visit <strong>www.dohssheba.com/track-order</strong></p>
        </div>

        <div className="text-center border-t border-slate-400 pt-1 w-36">
          <p className="font-semibold text-slate-700 text-[10px]">Authorized Seal</p>
        </div>
      </div>

    </div>
  );
}
