import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Calendar,
  FileHeart,
  FlaskConical,
  CreditCard,
  Printer,
  CalendarPlus,
  Shield,
  HeartPulse,
  AlertCircle,
  Clock,
  User,
  Stethoscope,
  Pill,
  CheckCircle2,
  Phone,
  Check,
} from 'lucide-react';

interface PatientPortalViewProps {
  onRequestAppointment: () => void;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  onRequestAppointment,
}) => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    medicalRecords,
    labTests,
    invoices,
    appointments,
    doctors,
    setPrintDocument,
    recordPayment,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'records' | 'labs' | 'billing'>('overview');
  const [onlinePayInvoiceId, setOnlinePayInvoiceId] = useState<string | null>(null);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientRecords = patient ? medicalRecords.filter((r) => r.patientId === patient.id) : [];
  const patientLabs = patient ? labTests.filter((l) => l.patientId === patient.id) : [];
  const patientInvoices = patient ? invoices.filter((i) => i.patientId === patient.id) : [];
  const patientAppointments = patient ? appointments.filter((a) => a.patientId === patient.id) : [];

  const upcomingAppointments = patientAppointments.filter(
    (a) => a.status === 'Scheduled' || a.status === 'In Consultation'
  );

  const unpaidInvoices = patientInvoices.filter(
    (i) => i.status === 'Pending' || i.status === 'Partially Paid' || i.status === 'Overdue'
  );

  if (!patient) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No patient record found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Patient Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${patient.avatarColor || 'bg-teal-700'} text-white font-bold text-xl flex items-center justify-center shadow-xs`}
            >
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {patient.fullName}
                </h1>
                <span className="font-mono text-xs text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded font-semibold border border-teal-100">
                  MRN: {patient.mrn}
                </span>
                <span className="font-mono text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-100">
                  {patient.bloodGroup}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>{patient.age} years old ({patient.gender})</span>
                <span>·</span>
                <span>DOB: {patient.dob}</span>
                <span>·</span>
                <span>{patient.insurance.provider} ({patient.insurance.coveragePercent}% cover)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={onRequestAppointment}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Medical Alerts Bar */}
        {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-rose-800 bg-rose-50/70 px-3 py-2 rounded-lg border border-rose-200/60">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <strong>Allergies:</strong> {patient.allergies.join(', ') || 'None recorded'}
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-800 bg-amber-50/70 px-3 py-2 rounded-lg border border-amber-200/60">
              <HeartPulse className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong>Chronic Conditions:</strong> {patient.chronicConditions.join(', ') || 'None'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patient Portal Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Health Overview', icon: HeartPulse },
          { id: 'appointments', label: `My Appointments (${upcomingAppointments.length})`, icon: Calendar },
          { id: 'records', label: `Consults & Prescriptions (${patientRecords.length})`, icon: FileHeart },
          { id: 'labs', label: `Lab Test Reports (${patientLabs.length})`, icon: FlaskConical },
          { id: 'billing', label: `Bills & Invoices (${patientInvoices.length})`, icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-teal-50 text-teal-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Health Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Upcoming Visits Banner */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Next Scheduled Visit
                </h3>
                {upcomingAppointments.length > 0 && (
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    Confirmed
                  </span>
                )}
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                  You have no upcoming doctor appointments scheduled.
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={onRequestAppointment}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      Click here to book a visit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {upcomingAppointments[0].doctorName}
                      </div>
                      <div className="text-slate-500">
                        {upcomingAppointments[0].department} · {upcomingAppointments[0].type}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900">{upcomingAppointments[0].date}</div>
                      <div className="text-slate-500 text-[11px]">{upcomingAppointments[0].timeSlot}</div>
                    </div>
                  </div>
                  {upcomingAppointments[0].symptoms && (
                    <p className="text-slate-600 italic pt-1 border-t border-slate-200">
                      Reason for visit: "{upcomingAppointments[0].symptoms}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Active Prescriptions Quick View */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Current Medications & Prescriptions
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('records')}
                  className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
                >
                  View full history
                </button>
              </div>

              {patientRecords.length === 0 || !patientRecords[0]?.prescriptions ? (
                <div className="text-xs text-slate-500">No active medication records.</div>
              ) : (
                <div className="space-y-2.5">
                  {patientRecords[0].prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-teal-600" />
                          <span>{rx.medicineName}</span>
                          <span className="font-mono text-slate-500 font-normal">({rx.dosage})</span>
                        </div>
                        <div className="text-slate-600">{rx.frequency}</div>
                        <div className="text-[11px] text-slate-400 italic">{rx.instructions}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono text-slate-500 font-semibold bg-white px-2 py-1 rounded border border-slate-200">
                          {rx.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact & Quick Links */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Hospital Contact & Help</h3>
              <div className="text-slate-600 space-y-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Hospital Location:</span>
                  <strong className="text-slate-800">St. Jude Metropolitan Medical Center</strong>
                  <div className="text-[11px]">1000 Hospital Parkway, Health Sciences District</div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">24/7 Patient Helpline:</span>
                  <strong className="font-mono text-teal-800">+1 (800) 555-CARE</strong>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Emergency Hotline:</span>
                  <strong className="font-mono text-rose-700">911 / Speed Dial 9</strong>
                </div>
              </div>
            </div>

            {/* Outstanding Balance Banner */}
            {unpaidInvoices.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Pending Invoice Balance</span>
                </div>
                <p className="text-amber-800">
                  You have {unpaidInvoices.length} bill(s) requiring copay payment or insurance settlement.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('billing')}
                  className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-center transition-colors"
                >
                  Review & Settle Online
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              My Hospital Appointments
            </h3>
            <button
              type="button"
              onClick={onRequestAppointment}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {patientAppointments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No appointment history on file.
              </div>
            ) : (
              patientAppointments.map((apt) => (
                <div key={apt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{apt.type} with {apt.doctorName}</span>
                      <span className="text-[11px] font-mono text-slate-400">{apt.appointmentNumber}</span>
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
                    <div className="text-slate-500 mt-1 flex items-center gap-2">
                      <span>{apt.department}</span>
                      <span>·</span>
                      <span className="font-mono">{apt.date} at {apt.timeSlot}</span>
                    </div>
                    {apt.symptoms && <p className="text-slate-600 italic mt-1">"{apt.symptoms}"</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Consults & Prescriptions */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {patientRecords.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
              No medical consult records logged yet.
            </div>
          ) : (
            patientRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{rec.diagnosis}</div>
                    <div className="text-slate-500 mt-0.5">
                      Attending: {rec.doctorName} ({rec.department}) · Visited on: {rec.visitDate}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrintDocument({ type: 'prescription', data: rec })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-teal-800 rounded-lg font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-600" />
                    <span>Print Rx Copy</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                  <div className="font-semibold text-slate-900 mb-1">Doctor's Clinical Notes:</div>
                  <p>{rec.clinicalNotes}</p>
                </div>

                {rec.prescriptions && rec.prescriptions.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      <span>Prescribed Medication Instructions:</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rec.prescriptions.map((rx) => (
                        <div key={rx.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                          <div className="font-bold text-slate-900">{rx.medicineName} ({rx.dosage})</div>
                          <div className="text-slate-600 mt-0.5">{rx.frequency} · {rx.duration}</div>
                          <div className="text-slate-500 italic mt-1 text-[11px]">{rx.instructions}</div>
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

      {/* Tab 4: Lab Reports */}
      {activeTab === 'labs' && (
        <div className="space-y-4">
          {patientLabs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
              No lab reports on record.
            </div>
          ) : (
            patientLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{lab.testName}</h4>
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
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Order #{lab.testOrderNumber} · Specimen: {lab.sampleType} · Ordered: {lab.orderedDate}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrintDocument({ type: 'lab-report', data: lab })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-600" />
                    <span>Download Official Report</span>
                  </button>
                </div>

                {/* Parameters Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-2 px-3">Test Parameter</th>
                        <th className="py-2 px-3">Your Result</th>
                        <th className="py-2 px-3">Standard Reference Interval</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {lab.parameters.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2 px-3 font-sans font-medium text-slate-800">{p.name}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{p.value} {p.unit}</td>
                          <td className="py-2 px-3 text-slate-500">{p.referenceRange}</td>
                          <td className="py-2 px-3 font-sans">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                p.flag === 'High' || p.flag === 'Critical'
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.flag === 'Low'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'text-slate-600'
                              }`}
                            >
                              {p.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {lab.pathologistSummary && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-slate-700">
                    <strong className="text-slate-900">Doctor's Diagnostic Interpretation:</strong>{' '}
                    <span>{lab.pathologistSummary}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: Bills & Invoices */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          {patientInvoices.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
              No hospital invoices on file.
            </div>
          ) : (
            patientInvoices.map((inv) => {
              const balanceDue = inv.grandTotal - inv.amountPaid;
              return (
                <div
                  key={inv.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{inv.invoiceNumber}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Issue Date: {inv.date} · Due Date: {inv.dueDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {inv.status !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => {
                            recordPayment(inv.id, balanceDue, 'Online Banking', 'Patient Portal instant payment');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                        >
                          Pay Balance (${balanceDue.toFixed(2)})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPrintDocument({ type: 'invoice', data: inv })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Print Receipt</span>
                      </button>
                    </div>
                  </div>

                  {/* Itemized Services Breakdown */}
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="p-2.5">Service Description</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {inv.items.map((item) => (
                          <tr key={item.id}>
                            <td className="p-2.5 font-sans text-slate-800">{item.description}</td>
                            <td className="p-2.5 font-sans text-slate-500">{item.category}</td>
                            <td className="p-2.5 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Totals */}
                  <div className="p-3 bg-slate-50 rounded-lg flex flex-col items-end gap-1 font-mono text-xs">
                    <div>Subtotal: <span className="font-semibold text-slate-800">${inv.subtotal.toFixed(2)}</span></div>
                    <div className="text-teal-700">Insurance Benefit Paid: <span className="font-semibold">-${inv.insuranceDiscount.toFixed(2)}</span></div>
                    <div className="text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                      Patient Responsibility: ${inv.grandTotal.toFixed(2)}
                    </div>
                    {inv.amountPaid > 0 && (
                      <div className="text-emerald-700 font-semibold">
                        Amount Paid: ${inv.amountPaid.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
