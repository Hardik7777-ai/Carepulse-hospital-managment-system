import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { AppointmentsView } from './components/AppointmentsView';
import { MedicalRecordsView } from './components/MedicalRecordsView';
import { LabTestsView } from './components/LabTestsView';
import { BillingView } from './components/BillingView';
import { DoctorsView } from './components/DoctorsView';
import { PatientPortalView } from './components/PatientPortalView';
import { PrintDocumentModal } from './components/PrintDocumentModal';
import { ToastContainer } from './components/ToastContainer';

// Modals
import { NewPatientModal } from './components/modals/NewPatientModal';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal';
import { NewConsultModal } from './components/modals/NewConsultModal';
import { NewLabOrderModal } from './components/modals/NewLabOrderModal';
import { NewInvoiceModal } from './components/modals/NewInvoiceModal';

function HospitalMainContent() {
  const {
    viewMode,
    activeStaffTab,
    setActiveStaffTab,
    setSelectedPatientId,
  } = useHospital();

  // Modal open states
  const [newPatientOpen, setNewPatientOpen] = useState(false);
  const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false);
  const [newConsultOpen, setNewConsultOpen] = useState(false);
  const [newLabOrderOpen, setNewLabOrderOpen] = useState(false);
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);

  // Preselection state for contextual modal launches
  const [modalPatientId, setModalPatientId] = useState<string | undefined>();
  const [modalDoctorId, setModalDoctorId] = useState<string | undefined>();
  const [modalAppointmentId, setModalAppointmentId] = useState<string | undefined>();

  // Helper callbacks
  const handleOpenBookAppointmentForPatient = (patientId: string) => {
    setModalPatientId(patientId);
    setModalDoctorId(undefined);
    setBookAppointmentOpen(true);
  };

  const handleBookWithDoctor = (doctorId: string) => {
    setModalDoctorId(doctorId);
    setModalPatientId(undefined);
    setBookAppointmentOpen(true);
  };

  const handleOpenConsultForPatient = (patientId: string) => {
    setModalPatientId(patientId);
    setModalDoctorId(undefined);
    setModalAppointmentId(undefined);
    setNewConsultOpen(true);
  };

  const handleOpenConsultWithAppointment = (
    appointmentId: string,
    patientId: string,
    doctorId: string
  ) => {
    setModalAppointmentId(appointmentId);
    setModalPatientId(patientId);
    setModalDoctorId(doctorId);
    setNewConsultOpen(true);
  };

  const handleOpenLabOrderForPatient = (patientId: string) => {
    setModalPatientId(patientId);
    setModalDoctorId(undefined);
    setNewLabOrderOpen(true);
  };

  const handleOpenInvoiceForPatient = (patientId: string) => {
    setModalPatientId(patientId);
    setNewInvoiceOpen(true);
  };

  const handleSelectPatientFromDashboard = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveStaffTab('patients');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-900">
      {/* Universal Top Header */}
      <Header
        onOpenNewPatient={() => {
          setModalPatientId(undefined);
          setNewPatientOpen(true);
        }}
        onOpenBookAppointment={() => {
          setModalPatientId(undefined);
          setModalDoctorId(undefined);
          setBookAppointmentOpen(true);
        }}
        onOpenNewLabOrder={() => {
          setModalPatientId(undefined);
          setModalDoctorId(undefined);
          setNewLabOrderOpen(true);
        }}
        onOpenNewInvoice={() => {
          setModalPatientId(undefined);
          setNewInvoiceOpen(true);
        }}
        onOpenNewConsult={() => {
          setModalPatientId(undefined);
          setModalDoctorId(undefined);
          setModalAppointmentId(undefined);
          setNewConsultOpen(true);
        }}
      />

      {/* Main Viewport */}
      {viewMode === 'staff' ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Staff Navigation Sidebar */}
          <Sidebar />

          {/* Staff Tab Body */}
          <main className="flex-1 p-6 overflow-y-auto">
            {activeStaffTab === 'dashboard' && (
              <DashboardView
                onOpenNewPatient={() => setNewPatientOpen(true)}
                onOpenBookAppointment={() => setBookAppointmentOpen(true)}
                onOpenNewLabOrder={() => setNewLabOrderOpen(true)}
                onOpenNewInvoice={() => setNewInvoiceOpen(true)}
                onOpenNewConsult={() => setNewConsultOpen(true)}
                onSelectPatient={handleSelectPatientFromDashboard}
                onSelectAppointment={() => setActiveStaffTab('appointments')}
              />
            )}

            {activeStaffTab === 'patients' && (
              <PatientsView
                onOpenNewPatient={() => setNewPatientOpen(true)}
                onOpenBookAppointmentForPatient={handleOpenBookAppointmentForPatient}
                onOpenNewConsultForPatient={handleOpenConsultForPatient}
                onOpenNewLabOrderForPatient={handleOpenLabOrderForPatient}
                onOpenNewInvoiceForPatient={handleOpenInvoiceForPatient}
              />
            )}

            {activeStaffTab === 'appointments' && (
              <AppointmentsView
                onOpenBookAppointment={() => setBookAppointmentOpen(true)}
                onOpenNewConsultWithAppointment={handleOpenConsultWithAppointment}
              />
            )}

            {activeStaffTab === 'medical-records' && (
              <MedicalRecordsView
                onOpenNewConsult={() => setNewConsultOpen(true)}
              />
            )}

            {activeStaffTab === 'laboratory' && (
              <LabTestsView
                onOpenNewLabOrder={() => setNewLabOrderOpen(true)}
              />
            )}

            {activeStaffTab === 'billing' && (
              <BillingView
                onOpenNewInvoice={() => setNewInvoiceOpen(true)}
              />
            )}

            {activeStaffTab === 'doctors' && (
              <DoctorsView
                onBookAppointmentWithDoctor={handleBookWithDoctor}
              />
            )}
          </main>
        </div>
      ) : (
        /* Patient Portal Mode */
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <PatientPortalView
            onRequestAppointment={() => {
              setModalPatientId(undefined);
              setBookAppointmentOpen(true);
            }}
          />
        </main>
      )}

      {/* Reusable Operational Modals */}
      <NewPatientModal
        isOpen={newPatientOpen}
        onClose={() => setNewPatientOpen(false)}
      />

      <BookAppointmentModal
        isOpen={bookAppointmentOpen}
        onClose={() => setBookAppointmentOpen(false)}
        preselectedPatientId={modalPatientId}
        preselectedDoctorId={modalDoctorId}
      />

      <NewConsultModal
        isOpen={newConsultOpen}
        onClose={() => setNewConsultOpen(false)}
        preselectedPatientId={modalPatientId}
        preselectedDoctorId={modalDoctorId}
        preselectedAppointmentId={modalAppointmentId}
      />

      <NewLabOrderModal
        isOpen={newLabOrderOpen}
        onClose={() => setNewLabOrderOpen(false)}
        preselectedPatientId={modalPatientId}
        preselectedDoctorId={modalDoctorId}
      />

      <NewInvoiceModal
        isOpen={newInvoiceOpen}
        onClose={() => setNewInvoiceOpen(false)}
        preselectedPatientId={modalPatientId}
      />

      {/* Official Print/Export Document Previewer */}
      <PrintDocumentModal />

      {/* Global Notification Feedback */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <HospitalProvider>
      <HospitalMainContent />
    </HospitalProvider>
  );
}
