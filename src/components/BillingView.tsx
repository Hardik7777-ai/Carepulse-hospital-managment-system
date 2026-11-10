import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { BillingInvoice, PaymentMethod } from '../types/hospital';
import {
  CreditCard,
  Plus,
  Printer,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  Shield,
  Receipt,
  X,
  FileCheck,
} from 'lucide-react';

interface BillingViewProps {
  onOpenNewInvoice: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  onOpenNewInvoice,
}) => {
  const { invoices, recordPayment, setPrintDocument } = useHospital();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [payingInvoice, setPayingInvoice] = useState<BillingInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit / Debit Card');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        inv.patientName.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalBilled = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const totalOutstanding = totalBilled - totalPaid;

  const handleOpenPayment = (inv: BillingInvoice) => {
    setPayingInvoice(inv);
    const balance = inv.grandTotal - inv.amountPaid;
    setPaymentAmount(balance > 0 ? balance.toFixed(2) : '0.00');
    setPaymentNotes('');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) return;

    recordPayment(payingInvoice.id, amt, paymentMethod, paymentNotes);
    setPayingInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Hospital Billing & Financial Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Itemized hospital bills, insurance adjudication, patient copays, and payment receipts
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewInvoice}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Itemized Bill</span>
        </button>
      </div>

      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Patient Billing</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All hospital encounters & services</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Collections & Receipts</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Settled payments on record</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">Outstanding Balance Due</div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
            ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pending claims & patient copays</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['all', 'Paid', 'Pending', 'Partially Paid', 'Overdue'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 font-medium rounded-md transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-teal-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All Invoices' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice # or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Insurance Paid</th>
                <th className="py-3 px-4">Patient Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No hospital invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const balanceDue = inv.grandTotal - inv.amountPaid;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-900">
                        {inv.patientName}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {inv.date}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {inv.dueDate}
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                        ${inv.subtotal.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-teal-700">
                        -${inv.insuranceDiscount.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums font-bold text-slate-900">
                        ${inv.grandTotal.toFixed(2)}
                        {inv.amountPaid > 0 && (
                          <div className="text-[10px] text-emerald-700 font-normal">
                            Paid: ${inv.amountPaid.toFixed(2)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'Partially Paid'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status !== 'Paid' && (
                            <button
                              type="button"
                              onClick={() => handleOpenPayment(inv)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors shadow-xs"
                            >
                              Pay / Settle
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setPrintDocument({ type: 'invoice', data: inv })}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors"
                            title="Print Invoice & Tax Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Hospital Payment
                </h3>
                <div className="text-xs text-slate-500 font-mono">
                  {payingInvoice.invoiceNumber} · {payingInvoice.patientName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Grand Total:</span>
                  <span className="font-mono font-semibold">${payingInvoice.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Already Paid:</span>
                  <span className="font-mono text-emerald-700">-${payingInvoice.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
                  <span>Remaining Due:</span>
                  <span className="font-mono text-amber-700">
                    ${(payingInvoice.grandTotal - payingInvoice.amountPaid).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Amount ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Method:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                >
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cash">Cash (Desk Cashier)</option>
                  <option value="Insurance Direct">Insurance Direct Claim</option>
                  <option value="Online Banking">Online Banking / Wire Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction Notes / Reference #:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Card Authorization #882194 or Cash Receipt"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                >
                  Confirm & Settle Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
