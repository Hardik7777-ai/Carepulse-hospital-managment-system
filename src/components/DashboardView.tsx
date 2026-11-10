import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Users,
  CalendarCheck,
  Stethoscope,
  FlaskConical,
  CreditCard,
  UserPlus,
  CalendarPlus,
  FileText,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewPatient: () => void;
  onOpenBookAppointment: () => void;
  onOpenNewLabOrder: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewConsult: () => void;
  onSelectPatient: (patientId: string) => void;
  onSelectAppointment: (appointmentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewPatient,
  onOpenBookAppointment,
  onOpenNewLabOrder,
  onOpenNewInvoice,
  onOpenNewConsult,
  onSelectPatient,
}) => {
  const {
    patients,
    appointments,
    labTests,
    invoices,
    medicalRecords,
    setActiveStaffTab,
    updateAppointmentStatus,
    setPrintDocument,
  } = useHospital();

  const totalPatients = patients.length;
  const inpatients = patients.filter((p) => p.admissionStatus === 'Inpatient').length;
  const scheduledToday = appointments.filter((a) => a.status === 'Scheduled' || a.status === 'In Consultation');
  const inConsultCount = appointments.filter((a) => a.status === 'In Consultation').length;
  const pendingLabs = labTests.filter((l) => l.status !== 'Completed');
  
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const pendingPayments = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Partially Paid')
    .reduce((sum, inv) => sum + (inv.grandTotal - inv.amountPaid), 0);

  // Critical or abnormal lab results
  const abnormalLabs = labTests.filter((lt) =>
    lt.parameters.some((p) => p.flag === 'High' || p.flag === 'Critical' || p.flag === 'Low')
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Fast Action Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Operations Overview
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active Shift · St. Jude Metropolitan Medical Center · Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Quick Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenNewPatient}
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
            <button
              type="button"
              onClick={onOpenBookAppointment}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewConsult}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Clinical Consult</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewLabOrder}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
              <span>Order Lab Test</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewInvoice}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Generate Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Registered Patients</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalPatients}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
            <span className="text-teal-700 font-semibold">{inpatients} Inpatients</span>
            <span>·</span>
            <span>{totalPatients - inpatients} Outpatients</span>
          </div>
        </div>

        {/* Appointments Queue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Today's Consultations</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {scheduledToday.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
            <span className="text-blue-700 font-semibold">{inConsultCount} In Chamber</span>
            <span>·</span>
            <span>{scheduledToday.length - inConsultCount} Queued</span>
          </div>
        </div>

        {/* Diagnostic Lab Queue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Lab Investigations</span>
            <FlaskConical className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingLabs.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
            <span className="text-purple-700 font-semibold">
              {labTests.filter((l) => l.status === 'Completed').length} Completed
            </span>
            <span>·</span>
            <span>{pendingLabs.length} Processing</span>
          </div>
        </div>

        {/* Revenue & Billing */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Hospital Collections</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
            <span className="text-amber-700 font-semibold">${pendingPayments.toFixed(0)} Pending</span>
            <span>·</span>
            <span>${totalBilled.toFixed(0)} Total Billed</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Appointments Queue + Lab & Billing Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Doctor Appointment Schedule & Consultations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Today's Appointment & Consultation Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time patient check-ins and physician consultation room status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStaffTab('appointments')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
              >
                <span>All Appointments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {scheduledToday.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No appointments currently queued for today.
                </div>
              ) : (
                scheduledToday.map((apt) => (
                  <div
                    key={apt.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-2 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">
                          {apt.patientName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {apt.appointmentNumber}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            apt.status === 'In Consultation'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <Stethoscope className="w-3 h-3 text-teal-600" />
                          {apt.doctorName}
                        </span>
                        <span>·</span>
                        <span>{apt.department}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono text-slate-600">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {apt.timeSlot}
                        </span>
                      </div>
                      {apt.symptoms && (
                        <p className="text-xs text-slate-600 italic line-clamp-1">
                          "{apt.symptoms}"
                        </p>
                      )}
                    </div>

                    {/* Operational Action Controls */}
                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      {apt.status === 'Scheduled' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors"
                        >
                          Call Patient
                        </button>
                      )}
                      {apt.status === 'In Consultation' && (
                        <button
                          type="button"
                          onClick={onOpenNewConsult}
                          className="px-2.5 py-1.5 bg-teal-600 text-white hover:bg-teal-700 rounded-md text-xs font-semibold transition-colors shadow-xs"
                        >
                          Record EMR & Rx
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectPatient(apt.patientId)}
                        className="px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md text-xs font-medium transition-colors"
                      >
                        Patient Dossier
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Medical Encounters & Clinical Notes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Medical Encounters & Consultations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest clinical consult notes, vitals logged, and physician prescriptions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStaffTab('medical-records')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
              >
                <span>All EMRs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {medicalRecords.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">
                          {rec.patientName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {rec.recordNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {rec.visitDate}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-teal-800 mt-1">
                        Diagnosis: {rec.diagnosis}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {rec.clinicalNotes}
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[11px] text-slate-500">
                        {rec.doctorName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPrintDocument({ type: 'prescription', data: rec })}
                        className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline mt-1"
                      >
                        Print Rx
                      </button>
                    </div>
                  </div>

                  {/* Vitals Summary Pill-Free Strip */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-3 text-[11px] text-slate-600 flex-wrap font-mono tabular-nums">
                    <span>BP: <strong className="text-slate-900 font-semibold">{rec.vitals.bloodPressure}</strong></span>
                    <span>·</span>
                    <span>HR: <strong className="text-slate-900 font-semibold">{rec.vitals.heartRate} bpm</strong></span>
                    <span>·</span>
                    <span>Temp: <strong className="text-slate-900 font-semibold">{rec.vitals.temperature}°F</strong></span>
                    <span>·</span>
                    <span>SpO2: <strong className="text-slate-900 font-semibold">{rec.vitals.oxygenSaturation}%</strong></span>
                    <span>·</span>
                    <span>BMI: <strong className="text-slate-900 font-semibold">{rec.vitals.bmi}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Lab Reports & Billing Highlights */}
        <div className="space-y-6">
          {/* Lab Test Diagnostic Alerts */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Diagnostic Lab Feed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveStaffTab('laboratory')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {labTests.slice(0, 4).map((lab) => {
                const hasAbnormal = lab.parameters.some(
                  (p) => p.flag === 'High' || p.flag === 'Critical' || p.flag === 'Low'
                );
                return (
                  <div
                    key={lab.id}
                    className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 leading-tight">
                          {lab.testName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {lab.patientName} · {lab.orderedDate}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          lab.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lab.status}
                      </span>
                    </div>

                    {hasAbnormal && (
                      <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/80 p-1.5 rounded border border-amber-200/50 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span>Abnormal parameters noted · Review required</span>
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50">
                      <span className="text-slate-500 font-mono">{lab.testOrderNumber}</span>
                      <button
                        type="button"
                        onClick={() => setPrintDocument({ type: 'lab-report', data: lab })}
                        className="text-teal-700 hover:text-teal-900 font-semibold"
                      >
                        View Official Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Hospital Invoices */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Hospital Billing Queue
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveStaffTab('billing')}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium"
              >
                Invoices
              </button>
            </div>

            <div className="space-y-2.5">
              {invoices.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{inv.patientName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {inv.invoiceNumber} · Due: {inv.dueDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 font-mono tabular-nums">
                      ${inv.grandTotal.toFixed(2)}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Partially Paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
