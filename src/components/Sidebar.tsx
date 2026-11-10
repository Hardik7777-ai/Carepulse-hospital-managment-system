import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { StaffTab } from '../types/hospital';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileHeart,
  FlaskConical,
  Receipt,
  Stethoscope,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeStaffTab,
    setActiveStaffTab,
    patients,
    appointments,
    labTests,
    invoices,
  } = useHospital();

  const pendingAppointments = appointments.filter(
    (a) => a.status === 'Scheduled' || a.status === 'In Consultation'
  ).length;

  const pendingLabs = labTests.filter(
    (l) => l.status === 'Ordered' || l.status === 'Sample Collected' || l.status === 'In Analysis'
  ).length;

  const unpaidInvoices = invoices.filter(
    (i) => i.status === 'Pending' || i.status === 'Partially Paid' || i.status === 'Overdue'
  ).length;

  const navigationItems: Array<{
    id: StaffTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    countVariant?: 'normal' | 'urgent';
  }> = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: Users,
      count: patients.length,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: CalendarDays,
      count: pendingAppointments,
      countVariant: pendingAppointments > 0 ? 'urgent' : 'normal',
    },
    {
      id: 'medical-records',
      label: 'Medical Records',
      icon: FileHeart,
    },
    {
      id: 'laboratory',
      label: 'Lab & Diagnostics',
      icon: FlaskConical,
      count: pendingLabs,
      countVariant: pendingLabs > 0 ? 'urgent' : 'normal',
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: Receipt,
      count: unpaidInvoices,
    },
    {
      id: 'doctors',
      label: 'Doctors & Staff',
      icon: Stethoscope,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Hospital Workspace
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeStaffTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveStaffTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {typeof item.count === 'number' && item.count > 0 && (
                <span
                  className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full ${
                    item.countVariant === 'urgent'
                      ? 'bg-amber-100 text-amber-800 font-semibold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hospital Unit Indicator */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
        <div className="text-[11px] text-slate-500">
          <div className="font-semibold text-slate-700">Central Medical Hub</div>
          <div className="mt-0.5 text-slate-400 flex items-center gap-1.5">
            <span>Level 2 Emergency Wing</span>
            <span>·</span>
            <span>24/7 Desk</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
