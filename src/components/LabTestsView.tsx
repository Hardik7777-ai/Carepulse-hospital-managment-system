import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { LabTest, LabTestStatus, ParameterFlag } from '../types/hospital';
import {
  FlaskConical,
  Plus,
  Printer,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileEdit,
  Activity,
  X,
} from 'lucide-react';

interface LabTestsViewProps {
  onOpenNewLabOrder: () => void;
}

export const LabTestsView: React.FC<LabTestsViewProps> = ({
  onOpenNewLabOrder,
}) => {
  const { labTests, updateLabTest, setPrintDocument } = useHospital();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingLabTest, setEditingLabTest] = useState<LabTest | null>(null);

  const filteredLabs = labTests.filter((lab) => {
    if (categoryFilter !== 'all' && lab.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && lab.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Diagnostic Laboratory & Radiology Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinical pathology investigations, specimen processing, and verified diagnostic laboratory results
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewLabOrder}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Order Diagnostic Lab Test</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['all', 'Ordered', 'Sample Collected', 'In Analysis', 'Completed'] as const).map((st) => (
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
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-slate-500 font-medium">Category:</label>
          <select
            aria-label="Filter tests by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="Hematology">Hematology</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Radiology">Radiology</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Endocrinology">Endocrinology</option>
          </select>
        </div>
      </div>

      {/* Lab Tests Cards */}
      <div className="space-y-4">
        {filteredLabs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
            No lab tests match the current filters.
          </div>
        ) : (
          filteredLabs.map((lab) => {
            const hasAbnormal = lab.parameters.some(
              (p) => p.flag === 'High' || p.flag === 'Critical' || p.flag === 'Low'
            );

            return (
              <div
                key={lab.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        {lab.testName}
                      </span>
                      <span className="font-mono text-xs text-purple-800 bg-purple-50 px-2 py-0.5 rounded font-semibold">
                        {lab.testOrderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          lab.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lab.status}
                      </span>
                      {lab.urgency === 'STAT' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                          STAT URGENT
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span>Patient: <strong className="text-slate-800 font-semibold">{lab.patientName}</strong></span>
                      <span>·</span>
                      <span>Ordered by: {lab.doctorName}</span>
                      <span>·</span>
                      <span>Sample: <strong className="text-slate-700">{lab.sampleType}</strong></span>
                      <span>·</span>
                      <span>Date: {lab.orderedDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEditingLabTest(lab)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Values & Flags</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintDocument({ type: 'lab-report', data: lab })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-600" />
                      <span>Official Lab Report</span>
                    </button>
                  </div>
                </div>

                {/* Parameters Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3.5">Investigation Parameter</th>
                        <th className="py-2.5 px-3.5">Measured Result</th>
                        <th className="py-2.5 px-3.5">Units</th>
                        <th className="py-2.5 px-3.5">Standard Reference Interval</th>
                        <th className="py-2.5 px-3.5">Interpretation Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {lab.parameters.map((param) => (
                        <tr
                          key={param.id}
                          className={
                            param.flag === 'High' || param.flag === 'Critical'
                              ? 'bg-rose-50/40'
                              : param.flag === 'Low'
                              ? 'bg-amber-50/40'
                              : 'hover:bg-slate-50/50'
                          }
                        >
                          <td className="py-2 px-3.5 font-sans font-medium text-slate-800">
                            {param.name}
                          </td>
                          <td className="py-2 px-3.5 font-bold text-slate-900">
                            {param.value}
                          </td>
                          <td className="py-2 px-3.5 text-slate-500">{param.unit}</td>
                          <td className="py-2 px-3.5 text-slate-600">
                            {param.referenceRange}
                          </td>
                          <td className="py-2 px-3.5">
                            <span
                              className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded ${
                                param.flag === 'High' || param.flag === 'Critical'
                                  ? 'bg-rose-100 text-rose-800 font-bold'
                                  : param.flag === 'Low'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-50 text-emerald-800'
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

                {/* Pathologist Summary & Technician Remarks */}
                {(lab.pathologistSummary || lab.technicianNotes) && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs space-y-1">
                    {lab.pathologistSummary && (
                      <div>
                        <strong className="text-slate-900">Pathologist Diagnostic Remarks:</strong>{' '}
                        <span className="text-slate-700">{lab.pathologistSummary}</span>
                      </div>
                    )}
                    {lab.technicianNotes && (
                      <div className="text-[11px] text-slate-500">
                        Specimen Log: {lab.technicianNotes}
                      </div>
                    )}
                    {lab.authorizedBy && (
                      <div className="text-[11px] text-teal-800 font-semibold pt-1">
                        Electronically Verified by: {lab.authorizedBy}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Lab Test Modal for Lab Technicians / Pathologists */}
      {editingLabTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Laboratory Results: {editingLabTest.testName}
                </h3>
                <div className="text-xs text-slate-500">
                  Order #{editingLabTest.testOrderNumber} · Patient: {editingLabTest.patientName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingLabTest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Status Selector */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Investigation Status:
                  </label>
                  <select
                    value={editingLabTest.status}
                    onChange={(e) =>
                      setEditingLabTest({
                        ...editingLabTest,
                        status: e.target.value as LabTestStatus,
                        completedDate:
                          e.target.value === 'Completed'
                            ? new Date().toISOString().split('T')[0]
                            : editingLabTest.completedDate,
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Sample Collected">Sample Collected</option>
                    <option value="In Analysis">In Analysis</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pathologist Verifier:
                  </label>
                  <input
                    type="text"
                    value={editingLabTest.authorizedBy || ''}
                    onChange={(e) =>
                      setEditingLabTest({
                        ...editingLabTest,
                        authorizedBy: e.target.value,
                      })
                    }
                    placeholder="e.g. Dr. Nathan Wallace, MD"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Parameters Editing Table */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Parameter Values & Diagnostic Flags:
                </label>
                <div className="space-y-2">
                  {editingLabTest.parameters.map((param, index) => (
                    <div
                      key={param.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{param.name}</div>
                        <div className="text-[11px] text-slate-500">Ref: {param.referenceRange} ({param.unit})</div>
                      </div>

                      <div className="w-28">
                        <input
                          type="text"
                          aria-label={`Result for ${param.name}`}
                          value={param.value}
                          onChange={(e) => {
                            const newParams = [...editingLabTest.parameters];
                            newParams[index] = { ...param, value: e.target.value };
                            setEditingLabTest({ ...editingLabTest, parameters: newParams });
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div className="w-28">
                        <select
                          aria-label={`Flag for ${param.name}`}
                          value={param.flag}
                          onChange={(e) => {
                            const newParams = [...editingLabTest.parameters];
                            newParams[index] = {
                              ...param,
                              flag: e.target.value as ParameterFlag,
                            };
                            setEditingLabTest({ ...editingLabTest, parameters: newParams });
                          }}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Low">Low</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathologist Summary */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pathologist Summary / Findings:
                </label>
                <textarea
                  rows={3}
                  value={editingLabTest.pathologistSummary || ''}
                  onChange={(e) =>
                    setEditingLabTest({
                      ...editingLabTest,
                      pathologistSummary: e.target.value,
                    })
                  }
                  placeholder="Clinical impression and recommendations..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingLabTest(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateLabTest(editingLabTest.id, editingLabTest);
                  setEditingLabTest(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs"
              >
                Save Laboratory Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
