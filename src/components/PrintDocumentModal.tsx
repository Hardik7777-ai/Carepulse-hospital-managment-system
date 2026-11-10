import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Printer,
  X,
  Activity,
  HeartPulse,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const PrintDocumentModal: React.FC = () => {
  const { printDocument, setPrintDocument } = useHospital();

  if (!printDocument) return null;

  const handlePrint = () => {
    window.print();
  };

  const { type, data } = printDocument;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Control Bar (Hidden when printing via CSS) */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
          <div className="text-xs font-semibold text-slate-700">
            Document Preview: {type.toUpperCase().replace('-', ' ')}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintDocument(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet Container */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 printable-document">
          {/* Hospital Official Letterhead */}
          <div className="border-b-2 border-teal-800 pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                    CP
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                    St. Jude Metropolitan Hospital
                  </h1>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Tertiary Healthcare & Clinical Research Center · Level 1 Trauma Facility
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  1000 Hospital Parkway, Chicago, IL 60611 · Tel: +1 (800) 555-CARE · Web: www.carepulse-med.org
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  {type === 'prescription' && `Rx: ${data.recordNumber}`}
                  {type === 'lab-report' && `LAB: ${data.testOrderNumber}`}
                  {type === 'invoice' && `INVOICE: ${data.invoiceNumber}`}
                  {type === 'patient-summary' && `DOSSIER: ${data.patient.mrn}`}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Generated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* PRESCRIPTION DOCUMENT */}
          {type === 'prescription' && (
            <div className="space-y-6 text-xs">
              {/* Patient & Doctor Meta */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 font-sans">
                <div>
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Patient Information</div>
                  <div className="font-bold text-sm text-slate-900">{data.patientName}</div>
                  <div className="text-slate-600 font-mono text-[11px]">Encounter Ref: {data.recordNumber}</div>
                  <div className="text-slate-600">Encounter Date: {data.visitDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Attending Physician</div>
                  <div className="font-bold text-sm text-slate-900">{data.doctorName}</div>
                  <div className="text-slate-600">{data.department}</div>
                  <div className="text-slate-500 text-[11px]">Medical License: IL-MD-449182</div>
                </div>
              </div>

              {/* Vitals */}
              {data.vitals && (
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="font-semibold text-slate-700 mb-1">Encounter Vital Signs:</div>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 font-mono text-[11px]">
                    <div>BP: <strong>{data.vitals.bloodPressure}</strong></div>
                    <div>HR: <strong>{data.vitals.heartRate} bpm</strong></div>
                    <div>Temp: <strong>{data.vitals.temperature}°F</strong></div>
                    <div>SpO2: <strong>{data.vitals.oxygenSaturation}%</strong></div>
                    <div>RR: <strong>{data.vitals.respiratoryRate}/m</strong></div>
                    <div>Wt: <strong>{data.vitals.weightKg} kg</strong></div>
                    <div>BMI: <strong>{data.vitals.bmi}</strong></div>
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              <div className="p-3 bg-teal-50/40 border border-teal-200 rounded-lg">
                <span className="text-[11px] uppercase font-bold text-teal-800 tracking-wider">
                  Primary Clinical Diagnosis
                </span>
                <div className="font-bold text-sm text-slate-900 mt-0.5">{data.diagnosis}</div>
                {data.icdCode && (
                  <div className="text-[11px] font-mono text-slate-600">ICD-10 Code: {data.icdCode}</div>
                )}
                {data.chiefComplaint && (
                  <div className="text-slate-600 mt-1 italic">Complaint: "{data.chiefComplaint}"</div>
                )}
              </div>

              {/* Prescriptions List with Rx symbol */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-200 pb-1">
                  <span className="font-serif italic text-2xl text-teal-800 leading-none">℞</span>
                  <span>Medication Prescriptions</span>
                </div>

                <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200">#</th>
                      <th className="p-2.5 border-b border-slate-200">Medicine & Strength</th>
                      <th className="p-2.5 border-b border-slate-200">Frequency & Timing</th>
                      <th className="p-2.5 border-b border-slate-200">Duration</th>
                      <th className="p-2.5 border-b border-slate-200">Directions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.prescriptions?.map((rx: any, idx: number) => (
                      <tr key={rx.id || idx}>
                        <td className="p-2.5 font-mono">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">
                          {rx.medicineName} <span className="font-mono text-slate-600">({rx.dosage})</span>
                        </td>
                        <td className="p-2.5 text-slate-800">{rx.frequency}</td>
                        <td className="p-2.5 font-mono text-slate-700">{rx.duration}</td>
                        <td className="p-2.5 text-slate-600 italic">{rx.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice / Notes */}
              {data.clinicalNotes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Physician Instructions & Diet:
                  </span>
                  <p className="text-slate-600">{data.clinicalNotes}</p>
                </div>
              )}

              {/* Footer Stamp & Sign */}
              <div className="pt-8 border-t border-slate-200 flex items-end justify-between">
                <div className="text-[11px] text-slate-500 font-mono">
                  {data.followUpDate && <div>Next Follow-up: <strong>{data.followUpDate}</strong></div>}
                  <div>Dispense as written · Valid for 90 days</div>
                </div>

                <div className="text-center font-sans">
                  <div className="w-48 border-b border-slate-400 mb-1"></div>
                  <div className="font-bold text-slate-900">{data.doctorName}</div>
                  <div className="text-[11px] text-slate-500">{data.department}</div>
                  <div className="text-[10px] text-teal-800 font-mono font-semibold">Authorized Physician Seal</div>
                </div>
              </div>
            </div>
          )}

          {/* LAB REPORT DOCUMENT */}
          {type === 'lab-report' && (
            <div className="space-y-6 text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Diagnostic Pathology & Imaging Report
                </h2>
                <div className="text-xs text-teal-800 font-semibold mt-0.5">
                  Department of Clinical Laboratories · CAP / CLIA Accredited
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-1">
                  <div>Patient Name: <strong className="text-slate-900">{data.patientName}</strong></div>
                  <div>Order Reference: <strong className="font-mono text-slate-800">{data.testOrderNumber}</strong></div>
                  <div>Referring Doctor: <strong>{data.doctorName}</strong></div>
                </div>
                <div className="space-y-1 text-right">
                  <div>Specimen Type: <strong className="text-slate-900">{data.sampleType}</strong></div>
                  <div>Collection Date: <strong>{data.orderedDate}</strong></div>
                  <div>Reporting Date: <strong>{data.completedDate || data.orderedDate}</strong></div>
                </div>
              </div>

              {/* Investigation Header */}
              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-purple-900 font-bold block">
                    Laboratory Investigation
                  </span>
                  <div className="text-sm font-bold text-slate-900">{data.testName}</div>
                </div>
                <div className="font-mono text-xs font-semibold text-purple-800">
                  Category: {data.category}
                </div>
              </div>

              {/* Parameters Table */}
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Analyte / Test Parameter</th>
                    <th className="p-2.5 border-b border-slate-200">Result</th>
                    <th className="p-2.5 border-b border-slate-200">Unit</th>
                    <th className="p-2.5 border-b border-slate-200">Biological Reference Interval</th>
                    <th className="p-2.5 border-b border-slate-200">Interpretation Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {data.parameters?.map((p: any) => (
                    <tr
                      key={p.id}
                      className={
                        p.flag === 'High' || p.flag === 'Critical'
                          ? 'bg-rose-50 font-bold'
                          : p.flag === 'Low'
                          ? 'bg-amber-50 font-bold'
                          : ''
                      }
                    >
                      <td className="p-2.5 font-sans font-medium text-slate-900">{p.name}</td>
                      <td className="p-2.5 text-slate-900 font-bold">{p.value}</td>
                      <td className="p-2.5 text-slate-600">{p.unit}</td>
                      <td className="p-2.5 text-slate-600">{p.referenceRange}</td>
                      <td className="p-2.5 font-sans">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
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

              {/* Pathologist Summary */}
              {data.pathologistSummary && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900 mb-1">
                    Pathologist Opinion & Diagnostic Commentary:
                  </div>
                  <p className="text-slate-700 leading-relaxed">{data.pathologistSummary}</p>
                </div>
              )}

              {/* Signoff */}
              <div className="pt-8 border-t border-slate-200 flex items-end justify-between">
                <div className="text-[11px] text-slate-500 font-mono">
                  <div>Automated Chemistry & Immunoassay Analyzer</div>
                  <div>Report digitally signed and transmitted to EHR</div>
                </div>

                <div className="text-center font-sans">
                  <div className="w-48 border-b border-slate-400 mb-1"></div>
                  <div className="font-bold text-slate-900">
                    {data.authorizedBy || 'Dr. Nathan Wallace, MD'}
                  </div>
                  <div className="text-[11px] text-slate-500">Chief Consultant Pathologist</div>
                  <div className="text-[10px] text-teal-800 font-mono font-semibold">Verified Electronic Signature</div>
                </div>
              </div>
            </div>
          )}

          {/* INVOICE & TAX RECEIPT */}
          {type === 'invoice' && (
            <div className="space-y-6 text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Official Hospital Billing Statement & Tax Receipt
                </h2>
                <div className="text-xs text-teal-800 font-semibold mt-0.5">
                  Tax Registration: EIN 36-9921401 · CMS Provider ID: 140010
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-1">
                  <div>Billed To: <strong className="text-slate-900 text-sm">{data.patientName}</strong></div>
                  <div>Invoice Number: <strong className="font-mono text-slate-800">{data.invoiceNumber}</strong></div>
                  <div>Billing Date: <strong>{data.date}</strong></div>
                </div>
                <div className="space-y-1 text-right">
                  <div>Payment Due: <strong>{data.dueDate}</strong></div>
                  <div>Status: <strong className="text-teal-800 uppercase">{data.status}</strong></div>
                  {data.paymentMethod && <div>Paid Via: <strong>{data.paymentMethod}</strong></div>}
                </div>
              </div>

              {/* Itemized Services */}
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Item Description</th>
                    <th className="p-2.5 border-b border-slate-200">Category</th>
                    <th className="p-2.5 border-b border-slate-200 text-center">Qty</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Unit Price</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {data.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-sans font-medium text-slate-900">{item.description}</td>
                      <td className="p-2.5 font-sans text-slate-600">{item.category}</td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end font-mono">
                <div className="w-72 space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>${data.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-teal-700">
                    <span>Insurance Adjudication / Coverage:</span>
                    <span>-${data.insuranceDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable Tax:</span>
                    <span>${data.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t border-slate-200 text-sm">
                    <span>Patient Responsibility:</span>
                    <span>${data.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                    <span>Total Amount Paid:</span>
                    <span>${data.amountPaid.toFixed(2)}</span>
                  </div>
                  {data.grandTotal - data.amountPaid > 0 && (
                    <div className="flex justify-between text-amber-800 font-bold">
                      <span>Outstanding Balance:</span>
                      <span>${(data.grandTotal - data.amountPaid).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stamp & Cashier Sign */}
              <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="inline-block border-2 border-emerald-600 text-emerald-700 font-bold px-4 py-1.5 rounded-lg text-sm uppercase tracking-widest transform -rotate-2">
                    {data.status === 'Paid' ? 'PAID IN FULL' : 'HOSPITAL RECEIPT'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-2">
                    Keep this receipt for tax deduction and insurance filing.
                  </div>
                </div>

                <div className="text-center font-sans">
                  <div className="w-44 border-b border-slate-400 mb-1"></div>
                  <div className="font-bold text-slate-900">Hospital Billing Officer</div>
                  <div className="text-[11px] text-slate-500">Patient Accounts Desk</div>
                </div>
              </div>
            </div>
          )}

          {/* PATIENT SUMMARY DOSSIER */}
          {type === 'patient-summary' && (
            <div className="space-y-6 text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Comprehensive Patient Medical Dossier & Health Summary
                </h2>
                <div className="text-xs text-teal-800 font-semibold mt-0.5">
                  Official Medical Records Department · Release of Information
                </div>
              </div>

              {/* Demographics Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">{data.patient.fullName}</div>
                  <div className="text-slate-600 font-mono">MRN: {data.patient.mrn}</div>
                  <div className="text-slate-600">Age: {data.patient.age} yrs · Gender: {data.patient.gender}</div>
                  <div className="text-slate-600 font-mono">DOB: {data.patient.dob}</div>
                </div>
                <div className="text-right">
                  <div className="text-rose-700 font-bold font-mono">Blood Group: {data.patient.bloodGroup}</div>
                  <div className="text-slate-600">Status: {data.patient.admissionStatus}</div>
                  <div className="text-slate-600">{data.patient.insurance.provider}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{data.patient.phone}</div>
                </div>
              </div>

              {/* Allergies & Conditions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                  <div className="font-bold text-rose-800 mb-1">Known Allergies:</div>
                  <div>{data.patient.allergies.join(', ') || 'No known drug allergies'}</div>
                </div>
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
                  <div className="font-bold text-amber-800 mb-1">Chronic Conditions:</div>
                  <div>{data.patient.chronicConditions.join(', ') || 'None recorded'}</div>
                </div>
              </div>

              {/* Clinical Encounters List */}
              <div className="space-y-2">
                <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                  Encounter History ({data.records?.length || 0})
                </div>
                {data.records?.map((rec: any) => (
                  <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{rec.diagnosis}</span>
                      <span className="font-mono text-slate-500">{rec.visitDate}</span>
                    </div>
                    <div className="text-slate-600 mt-1">{rec.clinicalNotes}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
