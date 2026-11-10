import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { TEST_CATALOG } from '../../data/initialData';
import { LabTest, LabTestUrgency } from '../../types/hospital';
import { X, FlaskConical, AlertTriangle } from 'lucide-react';

interface NewLabOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedDoctorId?: string;
}

export const NewLabOrderModal: React.FC<NewLabOrderModalProps> = ({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedDoctorId,
}) => {
  const { patients, doctors, createLabOrder } = useHospital();

  const [patientId, setPatientId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [selectedCatalogIndex, setSelectedCatalogIndex] = useState<number>(0);
  const [testName, setTestName] = useState<string>(TEST_CATALOG[0].name);
  const [category, setCategory] = useState<LabTest['category']>('Hematology');
  const [sampleType, setSampleType] = useState<string>(TEST_CATALOG[0].sampleType);
  const [urgency, setUrgency] = useState<LabTestUrgency>('Routine');
  const [price, setPrice] = useState<number>(TEST_CATALOG[0].price);

  useEffect(() => {
    if (isOpen) {
      setPatientId(preselectedPatientId || (patients[0]?.id ?? ''));
      setDoctorId(preselectedDoctorId || (doctors[0]?.id ?? ''));
      setSelectedCatalogIndex(0);
      setTestName(TEST_CATALOG[0].name);
      setCategory(TEST_CATALOG[0].category as any);
      setSampleType(TEST_CATALOG[0].sampleType);
      setPrice(TEST_CATALOG[0].price);
      setUrgency('Routine');
    }
  }, [isOpen, preselectedPatientId, preselectedDoctorId, patients, doctors]);

  if (!isOpen) return null;

  const handleCatalogChange = (index: number) => {
    setSelectedCatalogIndex(index);
    if (index >= 0 && index < TEST_CATALOG.length) {
      const item = TEST_CATALOG[index];
      setTestName(item.name);
      setCategory(item.category as any);
      setSampleType(item.sampleType);
      setPrice(item.price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !testName.trim()) return;

    const catalogItem = TEST_CATALOG[selectedCatalogIndex];
    const parameters = catalogItem?.parameters || [
      { name: 'Standard Investigation Result', unit: 'Index', referenceRange: 'Normal' },
    ];

    createLabOrder({
      patientId,
      doctorId,
      testName,
      category,
      sampleType,
      urgency,
      price: Number(price) || 50,
      parameters,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Order Diagnostic Lab Test
              </h2>
              <p className="text-xs text-slate-500">
                Requisition for pathology, hematology, biochemistry, or radiology
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Patient *
            </label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.mrn})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ordering Physician *
            </label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>

          {/* Test Catalog Preset */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Diagnostic Test from Catalog *
            </label>
            <select
              value={selectedCatalogIndex}
              onChange={(e) => handleCatalogChange(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 text-purple-950"
            >
              {TEST_CATALOG.map((t, idx) => (
                <option key={idx} value={idx}>
                  {t.name} ({t.category} · ${t.price})
                </option>
              ))}
            </select>
          </div>

          {/* Category & Sample */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Hematology">Hematology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Radiology">Radiology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="General">General / Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specimen / Sample Type</label>
              <input
                type="text"
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Urgency & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Order Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as LabTestUrgency)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Routine">Routine (Within 24h)</option>
                <option value="Urgent">Urgent (Within 4h)</option>
                <option value="STAT">STAT (Immediate &lt; 1h)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standard Fee ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Included Parameters Preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">
              Included Investigation Parameters:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TEST_CATALOG[selectedCatalogIndex]?.parameters.map((p, i) => (
                <span
                  key={i}
                  className="bg-white text-slate-800 text-[10px] px-2 py-0.5 rounded border border-slate-200"
                >
                  {p.name}
                </span>
              ))}
            </div>
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Place Diagnostic Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
