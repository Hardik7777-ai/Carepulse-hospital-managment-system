import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Activity,
  UserCheck,
  Building2,
  Plus,
  Download,
  RotateCcw,
  Search,
  ChevronDown,
  Calendar,
  FileText,
  FlaskConical,
  CreditCard,
  UserPlus,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewPatient: () => void;
  onOpenBookAppointment: () => void;
  onOpenNewLabOrder: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewConsult: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewPatient,
  onOpenBookAppointment,
  onOpenNewLabOrder,
  onOpenNewInvoice,
  onOpenNewConsult,
}) => {
  const {
    viewMode,
    setViewMode,
    patients,
    selectedPatientId,
    setSelectedPatientId,
    searchQuery,
    setSearchQuery,
    resetAllData,
    exportDatabaseJSON,
  } = useHospital();

  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark Brand Title (Top bar contract) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                CarePulse
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                St. Jude Metropolitan Hospital
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center max-w-xl">
            {/* Staff Console vs Patient Portal Segmented Control */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('staff')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                  viewMode === 'staff'
                    ? 'bg-white text-teal-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Medical Staff Console</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('patient')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                  viewMode === 'patient'
                    ? 'bg-white text-teal-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Patient Portal</span>
              </button>
            </div>

            {/* When in Patient Portal, show patient selector */}
            {viewMode === 'patient' && (
              <div className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
                <span className="hidden md:inline">Viewing as:</span>
                <select
                  aria-label="Select active patient in portal"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* When in Staff mode, live quick search bar */}
            {viewMode === 'staff' && (
              <div className="relative w-full max-w-xs hidden lg:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search patients, MRN, doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            )}
          </div>

          {/* Zone 3: 1 Primary Action & Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Create Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setQuickMenuOpen(!quickMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Action</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {quickMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setQuickMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5 animate-in fade-in duration-150">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Quick Operations
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickMenuOpen(false);
                        onOpenNewPatient();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-teal-600" />
                      <span>Register New Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickMenuOpen(false);
                        onOpenBookAppointment();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Book Doctor Appointment</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickMenuOpen(false);
                        onOpenNewConsult();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors"
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Write Clinical Consult & Rx</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickMenuOpen(false);
                        onOpenNewLabOrder();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors"
                    >
                      <FlaskConical className="w-4 h-4 text-purple-600" />
                      <span>Order Diagnostic Lab Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickMenuOpen(false);
                        onOpenNewInvoice();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Generate Itemized Bill</span>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setQuickMenuOpen(false);
                          exportDatabaseJSON();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 text-left transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Export Hospital DB (JSON)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQuickMenuOpen(false);
                          if (confirm('Reset hospital database to default sample records?')) {
                            resetAllData();
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 text-left transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset Sample Records</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
