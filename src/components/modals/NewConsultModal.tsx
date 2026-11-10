import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PrescriptionItem, Vitals } from '../../types/hospital';
import {
  X,
  FileHeart,
  Plus,
  Trash2,
  HeartPulse,
  Pill,
  Stethoscope,
} from 'lucide-react';

interface NewConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedDoctorId?: string;
  preselectedAppointmentId?: string;
}

export const NewConsultModal: React.FC<NewConsultModalProps> = ({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedDoctorId,
  preselectedAppointmentId,
}) => {
  const {
    patients,
    doctors,
    addMedicalRecord,
    appointments,
    setPrintDocument,
  } = useHospital();

  const [patientId, setPatientId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [chiefComplaint, setChiefComplaint] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [icdCode, setIcdCode] = useState<string>('');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');

  // Vitals
  const [bp, setBp] = useState<string>('120/80');
  const [hr, setHr] = useState<number>(72);
  const [temp, setTemp] = useState<number>(98.6);
  const [spo2, setSpo2] = useState<number>(99);
  const [rr, setRr] = useState<number>(16);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(172);

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'p-1',
      medicineName: '',
      dosage: '500 mg',
      frequency: 'Twice daily after meals',
      duration: '7 days',
      instructions: 'Take with a full glass of water.',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setPatientId(preselectedPatientId || (patients[0]?.id ?? ''));
      setDoctorId(preselectedDoctorId || (doctors[0]?.id ?? ''));

      // If associated with an appointment, pull symptoms
      if (preselectedAppointmentId) {
        const apt = appointments.find((a) => a.id === preselectedAppointmentId);
        if (apt) {
          setChiefComplaint(apt.symptoms || '');
          if (apt.patientId) setPatientId(apt.patientId);
          if (apt.doctorId) setDoctorId(apt.doctorId);
        }
      } else {
        setChiefComplaint('');
      }

      setDiagnosis('');
      setIcdCode('');
      setClinicalNotes('');
      setBp('120/80');
      setHr(72);
      setTemp(98.6);
      setSpo2(98);
      setRr(16);
      setWeightKg(70);
      setHeightCm(172);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 14);
      setFollowUpDate(nextWeek.toISOString().split('T')[0]);

      setPrescriptions([
        {
          id: 'p-1',
          medicineName: '',
          dosage: '500 mg',
          frequency: 'Twice daily after meals',
          duration: '7 days',
          instructions: 'Take with a full glass of water.',
        },
      ]);
    }
  }, [isOpen, preselectedPatientId, preselectedDoctorId, preselectedAppointmentId, patients, doctors, appointments]);

  if (!isOpen) return null;

  // Calculate BMI
  const calculateBMI = () => {
    if (!weightKg || !heightCm) return 22;
    const heightM = heightCm / 100;
    const bmiVal = weightKg / (heightM * heightM);
    return parseFloat(bmiVal.toFixed(1));
  };

  const handleAddPrescription = () => {
    setPrescriptions((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        medicineName: '',
        dosage: '10 mg',
        frequency: 'Once daily in the morning',
        duration: '30 days',
        instructions: 'Take with food.',
      },
    ]);
  };

  const handleRemovePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePrescriptionChange = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !diagnosis.trim()) return;

    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);

    const validPrescriptions = prescriptions.filter((p) => p.medicineName.trim().length > 0);

    const vitalsData: Vitals = {
      bloodPressure: bp.trim() || '120/80',
      heartRate: Number(hr) || 72,
      temperature: Number(temp) || 98.6,
      oxygenSaturation: Number(spo2) || 98,
      respiratoryRate: Number(rr) || 16,
      weightKg: Number(weightKg) || 70,
      heightCm: Number(heightCm) || 170,
      bmi: calculateBMI(),
    };

    const newRecord = addMedicalRecord({
      patientId,
      patientName: patient ? patient.fullName : 'Unknown Patient',
      doctorId,
      doctorName: doctor ? doctor.name : 'Unknown Doctor',
      department: doctor ? doctor.department : 'General Medicine',
      visitDate: new Date().toISOString().split('T')[0],
      chiefComplaint: chiefComplaint.trim() || 'Routine medical examination',
      diagnosis: diagnosis.trim(),
      icdCode: icdCode.trim() || undefined,
      vitals: vitalsData,
      clinicalNotes: clinicalNotes.trim() || 'Patient examined. Vital signs stable. Prescribed medication regimen initiated.',
      prescriptions: validPrescriptions,
      followUpDate: followUpDate || undefined,
      appointmentId: preselectedAppointmentId,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <FileHeart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Write Clinical Encounter & Prescriptions (EMR)
              </h2>
              <p className="text-xs text-slate-500">
                Physician consultation documentation, vital signs, diagnostic findings, and Rx
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Patient and Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Patient *
              </label>
              <select
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.mrn}) · {p.bloodGroup}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Attending Physician *
              </label>
              <select
                required
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty} · {d.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vitals Recording Strip */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <div className="flex items-center gap-1.5 text-teal-800">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                <span>Recorded Vital Signs</span>
              </div>
              <span className="font-mono text-slate-600">Calculated BMI: {calculateBMI()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">BP (mmHg)</label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Resp (/min)</label>
                <input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Chief Complaint & Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Essential Hypertension, Acute Bronchitis, Migraine with Aura"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ICD-10 Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. I10, J20.9, G43.1"
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">
                Chief Complaint & Presenting Symptoms
              </label>
              <input
                type="text"
                placeholder="Patient stated reason for visit and duration of symptoms..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Clinical Progress Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Physician Consultation & Progress Notes
            </label>
            <textarea
              rows={3}
              placeholder="Clinical exam findings, heart/lung auscultation, treatment rationale, and patient lifestyle recommendations..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          {/* Prescriptions Manager */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Prescription Regimen (e-Rx)</span>
              </div>
              <button
                type="button"
                onClick={handleAddPrescription}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-teal-800 rounded text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-2">
              {prescriptions.map((rx, idx) => (
                <div
                  key={rx.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Medicine name (e.g. Amoxicillin, Lisinopril)"
                      value={rx.medicineName}
                      onChange={(e) => handlePrescriptionChange(rx.id, 'medicineName', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Dose (e.g. 500mg)"
                      value={rx.dosage}
                      onChange={(e) => handlePrescriptionChange(rx.id, 'dosage', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Frequency (e.g. Twice daily)"
                      value={rx.frequency}
                      onChange={(e) => handlePrescriptionChange(rx.id, 'frequency', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Duration (e.g. 7 days)"
                      value={rx.duration}
                      onChange={(e) => handlePrescriptionChange(rx.id, 'duration', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemovePrescription(rx.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="sm:col-span-12">
                    <input
                      type="text"
                      placeholder="Patient directions (e.g. Take 30 minutes before meal with plenty of water)"
                      value={rx.instructions}
                      onChange={(e) => handlePrescriptionChange(rx.id, 'instructions', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded text-[11px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 italic"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Date */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block font-semibold text-slate-700 mb-1">
              Recommended Follow-up Visit Date
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full sm:w-64 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
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
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Save Clinical Encounter & Rx
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
