import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  FileText,
  Plus,
  Printer,
  Search,
  Stethoscope,
  Pill,
  HeartPulse,
  Calendar,
  AlertTriangle,
  User,
} from 'lucide-react';

interface MedicalRecordsViewProps {
  onOpenNewConsult: () => void;
}

export const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({
  onOpenNewConsult,
}) => {
  const { medicalRecords, patients, doctors, setPrintDocument } = useHospital();
  const [patientFilter, setPatientFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRecords = medicalRecords.filter((rec) => {
    if (patientFilter !== 'all' && rec.patientId !== patientFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        rec.patientName.toLowerCase().includes(q) ||
        rec.recordNumber.toLowerCase().includes(q) ||
        rec.diagnosis.toLowerCase().includes(q) ||
        rec.doctorName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Electronic Medical Records & Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical consultations, physician notes, diagnostic assessments, and electronic prescriptions (e-Rx)
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewConsult}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Write Clinical Encounter & Rx</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-slate-500 font-medium">Filter Patient:</label>
          <select
            aria-label="Filter records by patient"
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Patients ({medicalRecords.length} records)</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.mrn})
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search diagnosis, doctor, or EMR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Medical Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
            No clinical records found.
          </div>
        ) : (
          filteredRecords.map((rec) => {
            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        {rec.patientName}
                      </span>
                      <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-semibold">
                        {rec.recordNumber}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">
                        Visit Date: <strong className="text-slate-700">{rec.visitDate}</strong>
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-800">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        {rec.doctorName}
                      </span>
                      <span>·</span>
                      <span>{rec.department}</span>
                      {rec.icdCode && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-[11px] text-slate-500">ICD: {rec.icdCode}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrintDocument({ type: 'prescription', data: rec })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-teal-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors self-start sm:self-auto"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-600" />
                    <span>Print Formal Rx</span>
                  </button>
                </div>

                {/* Vitals Summary Strip */}
                <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                    <span>Recorded Vital Signs</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs font-mono tabular-nums">
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">Blood Pressure</div>
                      <div className="font-bold text-slate-900">{rec.vitals.bloodPressure}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">Heart Rate</div>
                      <div className="font-bold text-slate-900">{rec.vitals.heartRate} bpm</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">Temperature</div>
                      <div className="font-bold text-slate-900">{rec.vitals.temperature}°F</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">O2 Saturation</div>
                      <div className="font-bold text-slate-900">{rec.vitals.oxygenSaturation}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">Resp. Rate</div>
                      <div className="font-bold text-slate-900">{rec.vitals.respiratoryRate}/min</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">Weight / Height</div>
                      <div className="font-bold text-slate-900">{rec.vitals.weightKg}kg / {rec.vitals.heightCm}cm</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-sans">BMI</div>
                      <div className="font-bold text-teal-800">{rec.vitals.bmi}</div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis & Clinical Notes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-1 space-y-1">
                    <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                      Diagnosis & Chief Complaint
                    </span>
                    <div className="font-bold text-slate-900 text-sm">
                      {rec.diagnosis}
                    </div>
                    <p className="text-slate-600 italic mt-1">
                      "{rec.chiefComplaint}"
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                      Physician Clinical Notes
                    </span>
                    <div className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                      {rec.clinicalNotes}
                    </div>
                  </div>
                </div>

                {/* Prescriptions Table */}
                {rec.prescriptions && rec.prescriptions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      <span>Prescribed Medication Regimen</span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                          <tr>
                            <th className="py-2 px-3">Medicine & Dosage</th>
                            <th className="py-2 px-3">Frequency</th>
                            <th className="py-2 px-3">Duration</th>
                            <th className="py-2 px-3">Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rec.prescriptions.map((rx) => (
                            <tr key={rx.id} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-semibold text-slate-900">
                                {rx.medicineName} · <span className="font-mono text-slate-600">{rx.dosage}</span>
                              </td>
                              <td className="py-2 px-3 text-slate-700">{rx.frequency}</td>
                              <td className="py-2 px-3 font-mono text-slate-600">{rx.duration}</td>
                              <td className="py-2 px-3 text-slate-500 italic">{rx.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Follow-up Note */}
                {rec.followUpDate && (
                  <div className="text-[11px] text-teal-800 bg-teal-50/70 px-3 py-1.5 rounded-md flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Scheduled Clinical Follow-up: <strong>{rec.followUpDate}</strong></span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
