import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Patient, BloodGroup, Gender, AdmissionStatus } from '../types/hospital';
import {
  Search,
  UserPlus,
  FileText,
  CalendarPlus,
  FlaskConical,
  CreditCard,
  Printer,
  X,
  HeartPulse,
  AlertCircle,
  Eye,
  Trash2,
  Stethoscope,
  Clock,
  Phone,
  Mail,
  MapPin,
  Shield,
} from 'lucide-react';

interface PatientsViewProps {
  onOpenNewPatient: () => void;
  onOpenBookAppointmentForPatient: (patientId: string) => void;
  onOpenNewConsultForPatient: (patientId: string) => void;
  onOpenNewLabOrderForPatient: (patientId: string) => void;
  onOpenNewInvoiceForPatient: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onOpenNewPatient,
  onOpenBookAppointmentForPatient,
  onOpenNewConsultForPatient,
  onOpenNewLabOrderForPatient,
  onOpenNewInvoiceForPatient,
}) => {
  const {
    patients,
    deletePatient,
    medicalRecords,
    labTests,
    invoices,
    appointments,
    doctors,
    setPrintDocument,
    searchQuery,
    setSearchQuery,
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Outpatient' | 'Inpatient' | 'Discharged'>('All');
  const [selectedDossierPatient, setSelectedDossierPatient] = useState<Patient | null>(null);
  const [dossierTab, setDossierTab] = useState<'overview' | 'records' | 'labs' | 'billing' | 'appointments'>('overview');

  // Filtered patients
  const filteredPatients = patients.filter((patient) => {
    const matchesStatus = statusFilter === 'All' || patient.admissionStatus === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesQuery =
      patient.fullName.toLowerCase().includes(q) ||
      patient.mrn.toLowerCase().includes(q) ||
      patient.phone.includes(q) ||
      patient.bloodGroup.toLowerCase().includes(q) ||
      patient.insurance.provider.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  // Data for selected dossier patient
  const patientRecords = selectedDossierPatient
    ? medicalRecords.filter((r) => r.patientId === selectedDossierPatient.id)
    : [];
  const patientLabs = selectedDossierPatient
    ? labTests.filter((l) => l.patientId === selectedDossierPatient.id)
    : [];
  const patientInvoices = selectedDossierPatient
    ? invoices.filter((i) => i.patientId === selectedDossierPatient.id)
    : [];
  const patientAppointments = selectedDossierPatient
    ? appointments.filter((a) => a.patientId === selectedDossierPatient.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Patient Directory & Registration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized Electronic Health Records, Admissions, and Demographic Management
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewPatient}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
          {(['All', 'Inpatient', 'Outpatient', 'Discharged'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-teal-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
              {st === 'Inpatient' && (
                <span className="ml-1.5 text-[10px] text-slate-400 font-mono">
                  ({patients.filter((p) => p.admissionStatus === 'Inpatient').length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, MRN, phone, insurance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Patient Table Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Patient / MRN</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Status & Room</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Insurance</th>
                <th className="py-3 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Name & MRN */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${patient.avatarColor || 'bg-teal-700'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {patient.fullName.charAt(0)}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedDossierPatient(patient)}
                              className="font-semibold text-slate-900 hover:text-teal-700 text-left cursor-pointer transition-colors"
                            >
                              {patient.fullName}
                            </button>
                            <div className="text-[11px] font-mono text-slate-400">
                              {patient.mrn}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3 px-4 text-slate-600">
                        <div>{patient.age} yrs · {patient.gender}</div>
                        <div className="text-[11px] text-slate-400 font-mono">DOB: {patient.dob}</div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-100">
                          {patient.bloodGroup}
                        </span>
                      </td>

                      {/* Admission Status */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              patient.admissionStatus === 'Inpatient'
                                ? 'bg-amber-100 text-amber-800'
                                : patient.admissionStatus === 'Outpatient'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {patient.admissionStatus}
                          </span>
                          {patient.roomNumber && (
                            <span className="text-[10px] font-mono text-slate-500">
                              {patient.roomNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-mono text-[11px]">{patient.phone}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {patient.address}
                        </div>
                      </td>

                      {/* Insurance */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-medium text-slate-800">
                          {patient.insurance.provider}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {patient.insurance.coveragePercent}% Coverage
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View Full Patient 360° Dossier"
                            onClick={() => setSelectedDossierPatient(patient)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Book Appointment"
                            onClick={() => onOpenBookAppointmentForPatient(patient.id)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Write Clinical Consult & Rx"
                            onClick={() => onOpenNewConsultForPatient(patient.id)}
                            className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Order Lab Test"
                            onClick={() => onOpenNewLabOrderForPatient(patient.id)}
                            className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <FlaskConical className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Generate Bill"
                            onClick={() => onOpenNewInvoiceForPatient(patient.id)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete Patient Record"
                            onClick={() => {
                              if (confirm(`Remove record for ${patient.fullName}?`)) {
                                deletePatient(patient.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Patient Dossier / 360° Modal */}
      {selectedDossierPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${selectedDossierPatient.avatarColor || 'bg-teal-700'} text-white font-bold text-base flex items-center justify-center shadow-xs`}
                >
                  {selectedDossierPatient.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedDossierPatient.fullName}
                  </h2>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-teal-800 font-semibold">{selectedDossierPatient.mrn}</span>
                    <span>·</span>
                    <span>{selectedDossierPatient.age} yrs</span>
                    <span>·</span>
                    <span>{selectedDossierPatient.gender}</span>
                    <span>·</span>
                    <span className="font-mono text-rose-700 font-semibold">{selectedDossierPatient.bloodGroup}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPrintDocument({
                      type: 'patient-summary',
                      data: {
                        patient: selectedDossierPatient,
                        records: patientRecords,
                        labs: patientLabs,
                        invoices: patientInvoices,
                      },
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDossierPatient(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dossier Tabs Segmented Control */}
            <div className="px-6 border-b border-slate-200 bg-white">
              <div className="flex gap-4">
                {[
                  { id: 'overview', label: 'Patient Demographics' },
                  { id: 'records', label: `Medical Records (${patientRecords.length})` },
                  { id: 'labs', label: `Lab Reports (${patientLabs.length})` },
                  { id: 'billing', label: `Billing & Invoices (${patientInvoices.length})` },
                  { id: 'appointments', label: `Appointments (${patientAppointments.length})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDossierTab(t.id as any)}
                    className={`py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      dossierTab === t.id
                        ? 'border-teal-600 text-teal-800'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dossier Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Tab 1: Overview & Demographics */}
              {dossierTab === 'overview' && (
                <div className="space-y-6">
                  {/* Critical Medical Alerts Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-xl">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Documented Allergies</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedDossierPatient.allergies.length > 0 ? (
                          selectedDossierPatient.allergies.map((allergy, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white text-rose-800 font-medium px-2 py-0.5 rounded border border-rose-200"
                            >
                              {allergy}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">No known drug allergies reported.</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                        <HeartPulse className="w-4 h-4 text-amber-600" />
                        <span>Chronic Conditions</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedDossierPatient.chronicConditions.length > 0 ? (
                          selectedDossierPatient.chronicConditions.map((cond, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white text-amber-800 font-medium px-2 py-0.5 rounded border border-amber-200"
                            >
                              {cond}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">No chronic medical conditions logged.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Demographics & Insurance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                        Contact & Personal
                      </h4>
                      <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Phone: <strong className="font-mono text-slate-900">{selectedDossierPatient.phone}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>Email: <strong className="text-slate-900">{selectedDossierPatient.email}</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                          <span>Address: <strong className="text-slate-900">{selectedDossierPatient.address}</strong></span>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-slate-500">Emergency Contact:</span>
                          <div className="font-semibold text-slate-900 mt-0.5">
                            {selectedDossierPatient.emergencyContact.name} ({selectedDossierPatient.emergencyContact.relationship})
                          </div>
                          <div className="text-[11px] font-mono text-slate-600">
                            {selectedDossierPatient.emergencyContact.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                        Insurance & Admission
                      </h4>
                      <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>Provider: <strong className="text-slate-900">{selectedDossierPatient.insurance.provider}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Policy #: <strong className="font-mono text-slate-900">{selectedDossierPatient.insurance.policyNumber}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Coverage Level: <strong className="font-mono text-teal-800">{selectedDossierPatient.insurance.coveragePercent}%</strong></span>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-slate-500">Hospital Admission:</span>
                          <div className="font-semibold text-slate-900 mt-0.5">
                            {selectedDossierPatient.admissionStatus}
                            {selectedDossierPatient.roomNumber && ` · ${selectedDossierPatient.roomNumber}`}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Registered on: {selectedDossierPatient.registeredDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Medical Records & Prescriptions */}
              {dossierTab === 'records' && (
                <div className="space-y-4">
                  {patientRecords.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      No clinical encounter records logged yet.
                    </div>
                  ) : (
                    patientRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {rec.diagnosis}
                            </div>
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              {rec.doctorName} · {rec.department} · Visited: {rec.visitDate}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPrintDocument({ type: 'prescription', data: rec })}
                            className="px-2.5 py-1 bg-white border border-slate-300 rounded text-teal-700 font-semibold hover:bg-slate-100"
                          >
                            Print Rx
                          </button>
                        </div>

                        <div className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60">
                          <div className="font-semibold text-slate-900 mb-1">Clinical Notes & Observations:</div>
                          <p>{rec.clinicalNotes}</p>
                        </div>

                        {/* Prescriptions */}
                        {rec.prescriptions && rec.prescriptions.length > 0 && (
                          <div className="bg-white p-3 rounded-lg border border-slate-200/60 space-y-2">
                            <div className="font-semibold text-slate-900">Prescribed Medications:</div>
                            <div className="divide-y divide-slate-100">
                              {rec.prescriptions.map((p) => (
                                <div key={p.id} className="py-1.5 flex items-center justify-between">
                                  <div>
                                    <strong className="text-slate-900">{p.medicineName}</strong>
                                    <span className="text-slate-500 ml-2">({p.dosage} - {p.frequency})</span>
                                  </div>
                                  <div className="text-slate-500 font-mono text-[11px]">{p.duration}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Lab Reports */}
              {dossierTab === 'labs' && (
                <div className="space-y-4">
                  {patientLabs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      No lab investigations recorded for this patient.
                    </div>
                  ) : (
                    patientLabs.map((lab) => (
                      <div
                        key={lab.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{lab.testName}</div>
                            <div className="text-[11px] text-slate-500">
                              {lab.category} · Ordered: {lab.orderedDate}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPrintDocument({ type: 'lab-report', data: lab })}
                            className="px-2.5 py-1 bg-white border border-slate-300 rounded text-teal-700 font-semibold hover:bg-slate-100"
                          >
                            View Diagnostic Report
                          </button>
                        </div>

                        {/* Parameter Highlights */}
                        <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                              <tr>
                                <th className="p-2">Parameter</th>
                                <th className="p-2">Result</th>
                                <th className="p-2">Standard Range</th>
                                <th className="p-2">Flag</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {lab.parameters.map((param) => (
                                <tr key={param.id} className="hover:bg-slate-50/50">
                                  <td className="p-2 font-sans">{param.name}</td>
                                  <td className="p-2 font-bold">{param.value} {param.unit}</td>
                                  <td className="p-2 text-slate-500">{param.referenceRange}</td>
                                  <td className="p-2">
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                                        param.flag === 'High' || param.flag === 'Critical'
                                          ? 'bg-rose-100 text-rose-800 font-bold'
                                          : param.flag === 'Low'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'text-slate-600'
                                      }`}
                                    >
                                      {param.flag}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 4: Billing & Invoices */}
              {dossierTab === 'billing' && (
                <div className="space-y-4">
                  {patientInvoices.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      No invoices found for this patient.
                    </div>
                  ) : (
                    patientInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</div>
                            <div className="text-[11px] text-slate-500">
                              Date: {inv.date} · Due: {inv.dueDate}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {inv.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => setPrintDocument({ type: 'invoice', data: inv })}
                              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-teal-700 font-semibold hover:bg-slate-100"
                            >
                              Print Bill
                            </button>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-slate-200/60">
                          <div className="flex items-center justify-between font-semibold">
                            <span>Grand Total:</span>
                            <span className="font-mono tabular-nums text-slate-900">${inv.grandTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500 text-[11px] mt-1">
                            <span>Amount Paid:</span>
                            <span className="font-mono tabular-nums text-emerald-700">${inv.amountPaid.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 5: Appointments */}
              {dossierTab === 'appointments' && (
                <div className="space-y-3">
                  {patientAppointments.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                      No appointment history on file.
                    </div>
                  ) : (
                    patientAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{apt.type} with {apt.doctorName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{apt.department}</span>
                            <span>·</span>
                            <span>{apt.date} at {apt.timeSlot}</span>
                          </div>
                          {apt.symptoms && <p className="text-[11px] text-slate-600 mt-1 italic">"{apt.symptoms}"</p>}
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            apt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
