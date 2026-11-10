import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { AppointmentType } from '../../types/hospital';
import { X, CalendarPlus, Clock, Stethoscope, User } from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedDoctorId?: string;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedDoctorId,
}) => {
  const { patients, doctors, bookAppointment } = useHospital();

  const [patientId, setPatientId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('09:30 AM');
  const [type, setType] = useState<AppointmentType>('Routine Checkup');
  const [symptoms, setSymptoms] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPatientId(preselectedPatientId || (patients[0]?.id ?? ''));
      setDoctorId(preselectedDoctorId || (doctors[0]?.id ?? ''));
      // Default date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTimeSlot('10:00 AM');
      setType('Specialist Consultation');
      setSymptoms('');
      setNotes('');
    }
  }, [isOpen, preselectedPatientId, preselectedDoctorId, patients, doctors]);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  const timeSlots = [
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !date) return;

    bookAppointment({
      patientId,
      doctorId,
      date,
      timeSlot,
      type,
      symptoms: symptoms.trim() || 'General health consultation',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Book Doctor Appointment
              </h2>
              <p className="text-xs text-slate-500">
                Schedule outpatient consultation or specialist clinic visit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Select Patient */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Patient *
            </label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.mrn}) · {p.age}y {p.gender}
                </option>
              ))}
            </select>
          </div>

          {/* Select Doctor */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Physician / Specialist *
            </label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty} ({d.department}) · ${d.consultationFee}
                </option>
              ))}
            </select>
            {selectedDoctor && (
              <div className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-2">
                <span>Location: {selectedDoctor.roomNumber}</span>
                <span>·</span>
                <span>Hours: {selectedDoctor.availableHours}</span>
              </div>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Time Slot *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Encounter Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AppointmentType)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Follow-up">Follow-up Visit</option>
              <option value="Specialist Consultation">Specialist Consultation</option>
              <option value="Emergency">Emergency Evaluation</option>
              <option value="Lab Review">Laboratory / Diagnostic Review</option>
            </select>
          </div>

          {/* Reason for Visit / Symptoms */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chief Complaints / Symptoms
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Chronic headache, elevated blood pressure, follow-up on medication tolerance..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Clinical / Reception Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Patient requested morning slot; bring prior lab sheets"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Confirm & Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
