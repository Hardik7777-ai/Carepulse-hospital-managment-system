import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { InvoiceItem, InvoiceStatus } from '../../types/hospital';
import { X, CreditCard, Plus, Trash2, DollarSign } from 'lucide-react';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  preselectedPatientId,
}) => {
  const { patients, createInvoice } = useHospital();

  const [patientId, setPatientId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [insuranceCoveragePercent, setInsuranceCoveragePercent] = useState<number>(80);
  const [notes, setNotes] = useState<string>('');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'it-1',
      description: 'Specialist Medical Consultation',
      category: 'Consultation',
      quantity: 1,
      unitPrice: 150,
      total: 150,
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      const initialPatId = preselectedPatientId || (patients[0]?.id ?? '');
      setPatientId(initialPatId);

      const pat = patients.find((p) => p.id === initialPatId);
      if (pat?.insurance?.coveragePercent) {
        setInsuranceCoveragePercent(pat.insurance.coveragePercent);
      }

      const due = new Date();
      due.setDate(due.getDate() + 30);
      setDueDate(due.toISOString().split('T')[0]);

      setItems([
        {
          id: 'it-1',
          description: 'Specialist Medical Consultation',
          category: 'Consultation',
          quantity: 1,
          unitPrice: 150,
          total: 150,
        },
      ]);
      setNotes('Hospital clinical services rendered.');
    }
  }, [isOpen, preselectedPatientId, patients]);

  if (!isOpen) return null;

  const handlePatientChange = (id: string) => {
    setPatientId(id);
    const pat = patients.find((p) => p.id === id);
    if (pat?.insurance?.coveragePercent) {
      setInsuranceCoveragePercent(pat.insurance.coveragePercent);
    }
  };

  const handleAddItem = (preset?: { desc: string; cat: InvoiceItem['category']; price: number }) => {
    const newItem: InvoiceItem = {
      id: `it-${Date.now()}`,
      description: preset?.desc || '',
      category: preset?.cat || 'Procedure',
      quantity: 1,
      unitPrice: preset?.price || 50,
      total: preset?.price || 50,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const subtotal = items.reduce((sum, it) => sum + (Number(it.total) || 0), 0);
  const insuranceDiscount = (subtotal * insuranceCoveragePercent) / 100;
  const grandTotal = Math.max(0, subtotal - insuranceDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || items.length === 0) return;

    const patient = patients.find((p) => p.id === patientId);

    createInvoice({
      patientId,
      patientName: patient ? patient.fullName : 'Hospital Outpatient',
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Pending',
      items,
      subtotal,
      insuranceDiscount,
      tax: 0,
      grandTotal,
      amountPaid: 0,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Generate Itemized Hospital Bill & Invoice
              </h2>
              <p className="text-xs text-slate-500">
                Patient fee statement, pharmacy drugs, diagnostics, and insurance claims
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Patient Selection & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Select Patient *
              </label>
              <select
                required
                value={patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.mrn}) · {p.insurance.provider}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Quick Presets Strip */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Quick add service:</span>
            <button
              type="button"
              onClick={() => handleAddItem({ desc: 'Follow-up Clinical Consult', cat: 'Consultation', price: 120 })}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
            >
              + Follow-up ($120)
            </button>
            <button
              type="button"
              onClick={() => handleAddItem({ desc: 'Complete Blood Count (CBC) Lab Panel', cat: 'Laboratory', price: 65 })}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
            >
              + Lab CBC ($65)
            </button>
            <button
              type="button"
              onClick={() => handleAddItem({ desc: 'Discharge Pharmacy Prescriptions', cat: 'Pharmacy', price: 45 })}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
            >
              + Pharmacy ($45)
            </button>
            <button
              type="button"
              onClick={() => handleAddItem({ desc: 'Inpatient Semi-Private Bed Charge (1 Day)', cat: 'Ward / Nursing', price: 450 })}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
            >
              + Bed 1 Day ($450)
            </button>
          </div>

          {/* Itemized Services Line Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
              <span>Itemized Services & Medications</span>
              <button
                type="button"
                onClick={() => handleAddItem()}
                className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Line</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Service name (e.g. ECG, Medication)"
                      value={it.description}
                      onChange={(e) => handleItemChange(it.id, 'description', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={it.category}
                      onChange={(e) => handleItemChange(it.id, 'category', e.target.value as any)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Ward / Nursing">Ward / Nursing</option>
                      <option value="Procedure">Procedure</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) => handleItemChange(it.id, 'quantity', Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs text-center font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={it.unitPrice}
                      onChange={(e) => handleItemChange(it.id, 'unitPrice', Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs text-right font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(it.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Discount Adjuster */}
          <div className="p-3 bg-teal-50/60 border border-teal-200/80 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-teal-900 block">
                Insurance Adjudication Coverage
              </span>
              <span className="text-[11px] text-slate-500">
                Calculated based on primary policy agreement
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-teal-800">
              <input
                type="number"
                min="0"
                max="100"
                value={insuranceCoveragePercent}
                onChange={(e) => setInsuranceCoveragePercent(Number(e.target.value))}
                className="w-16 p-1 bg-white border border-teal-300 rounded text-right text-xs"
              />
              <span>%</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-teal-700 font-semibold">
              <span>Insurance Coverage Benefit ({insuranceCoveragePercent}%):</span>
              <span>-${insuranceDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
              <span>Total Patient Responsibility:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Billing Remarks / Authorization Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Issue Itemized Hospital Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
