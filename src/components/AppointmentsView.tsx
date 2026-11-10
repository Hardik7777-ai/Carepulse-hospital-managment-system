import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { AppointmentStatus, AppointmentType } from '../types/hospital';
import {
  CalendarPlus,
  Stethoscope,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  User,
  Building,
  FileText,
} from 'lucide-react';

interface AppointmentsViewProps {
  onOpenBookAppointment: () => void;
  onOpenNewConsultWithAppointment: (appointmentId: string, patientId: string, doctorId: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onOpenBookAppointment,
  onOpenNewConsultWithAppointment,
}) => {
  const {
    appointments,
    doctors,
    updateAppointmentStatus,
    setSelectedPatientId,
    setActiveStaffTab,
  } = useHospital();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDoctorId !== 'all' && apt.doctorId !== selectedDoctorId) return false;
    if (selectedStatus !== 'all' && apt.status !== selectedStatus) return false;
    if (dateFilter && apt.date !== dateFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Doctor Appointments & Consultation Scheduling
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage physician schedules, patient queues, and outpatient clinical appointments
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBookAppointment}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        {/* Status segmented filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['all', 'Scheduled', 'In Consultation', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 font-medium rounded-md transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-white text-teal-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>

        {/* Doctor filter dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <label className="text-slate-500 font-medium">Doctor:</label>
          <select
            aria-label="Filter by Doctor"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-500 font-medium">Date:</label>
          <input
            type="date"
            aria-label="Filter by appointment date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              className="text-[11px] text-teal-700 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor & Department</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Chief Complaint / Symptoms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No appointments match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">
                      {apt.appointmentNumber}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {apt.patientName}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-400">{apt.department}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{apt.date}</div>
                      <div className="text-[11px] font-mono text-slate-500">{apt.timeSlot}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {apt.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2 text-xs italic">
                        {apt.symptoms || 'Routine checkup / consultation'}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                          apt.status === 'In Consultation'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'Scheduled' && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold transition-colors whitespace-nowrap"
                          >
                            Call In
                          </button>
                        )}

                        {apt.status === 'In Consultation' && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenNewConsultWithAppointment(apt.id, apt.patientId, apt.doctorId)
                            }
                            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded text-xs font-semibold shadow-xs transition-colors whitespace-nowrap flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Start Consult & Rx</span>
                          </button>
                        )}

                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            title="Mark as completed"
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {apt.status === 'Scheduled' && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                            title="Cancel appointment"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
