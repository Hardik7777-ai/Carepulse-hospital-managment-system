import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Stethoscope,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CalendarPlus,
  Award,
} from 'lucide-react';

interface DoctorsViewProps {
  onBookAppointmentWithDoctor: (doctorId: string) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  onBookAppointmentWithDoctor,
}) => {
  const { doctors, appointments } = useHospital();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Physicians & Medical Specialists Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Departmental clinical faculty, consulting rooms, schedules, and active consultation queues
          </p>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => {
          const docAppointments = appointments.filter(
            (a) => a.doctorId === doc.id && (a.status === 'Scheduled' || a.status === 'In Consultation')
          );

          return (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors space-y-4"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${doc.avatarColor} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {doc.name}
                    </h3>
                    <div className="text-xs font-semibold text-teal-800 mt-0.5">
                      {doc.specialty}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {doc.department} · {doc.experienceYears} yrs exp
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.qualification}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Location: <strong className="text-slate-800">{doc.roomNumber}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.availableHours}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Days: {doc.availableDays.join(', ')}</span>
                  </div>
                </div>

                {/* Consultation Fee & Queue */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Consult Fee</span>
                    <span className="text-slate-900 font-bold text-sm">${doc.consultationFee}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Queue Today</span>
                    <span className="text-teal-800 font-bold text-sm">{docAppointments.length} queued</span>
                  </div>
                </div>
              </div>

              {/* Book Appointment CTA */}
              <button
                type="button"
                onClick={() => onBookAppointmentWithDoctor(doc.id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Book with {doc.name.split(' ')[1]}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
