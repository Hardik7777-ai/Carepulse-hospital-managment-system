import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  LabTest,
  BillingInvoice,
  AppViewMode,
  StaffTab,
  AppointmentStatus,
  LabTestStatus,
  PaymentMethod,
} from '../types/hospital';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_LAB_TESTS,
  INITIAL_INVOICES,
} from '../data/initialData';

interface PrintDocumentPayload {
  type: 'prescription' | 'lab-report' | 'invoice' | 'patient-summary';
  data: any;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface HospitalContextType {
  // Navigation & Role State
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  activeStaffTab: StaffTab;
  setActiveStaffTab: (tab: StaffTab) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data Collections
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  labTests: LabTest[];
  invoices: BillingInvoice[];

  // Patient Actions
  addPatient: (patientData: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;

  // Doctor Actions
  getDoctorById: (id: string) => Doctor | undefined;

  // Appointment Actions
  bookAppointment: (aptData: {
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    type: Appointment['type'];
    symptoms: string;
    notes?: string;
  }) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  // Medical Record Actions
  addMedicalRecord: (recData: Omit<MedicalRecord, 'id' | 'recordNumber'>) => MedicalRecord;
  getRecordsByPatientId: (patientId: string) => MedicalRecord[];

  // Lab Test Actions
  createLabOrder: (orderData: {
    patientId: string;
    doctorId: string;
    testName: string;
    category: LabTest['category'];
    sampleType: string;
    urgency: LabTest['urgency'];
    price: number;
    parameters: Array<{ name: string; unit: string; referenceRange: string; value?: string }>;
  }) => LabTest;
  updateLabTest: (id: string, updates: Partial<LabTest>) => void;
  getLabTestsByPatientId: (patientId: string) => LabTest[];

  // Billing Actions
  createInvoice: (invoiceData: Omit<BillingInvoice, 'id' | 'invoiceNumber'>) => BillingInvoice;
  recordPayment: (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => void;
  getInvoicesByPatientId: (patientId: string) => BillingInvoice[];

  // Print/View Modal
  printDocument: PrintDocumentPayload | null;
  setPrintDocument: (doc: PrintDocumentPayload | null) => void;

  // System Helpers
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
  exportDatabaseJSON: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'carepulse_hms_';

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [viewMode, setViewMode] = useState<AppViewMode>('staff');
  const [activeStaffTab, setActiveStaffTab] = useState<StaffTab>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Notifications
  const [printDocument, setPrintDocument] = useState<PrintDocumentPayload | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent Collections
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}patients`);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}appointments`);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}records`);
      return saved ? JSON.parse(saved) : INITIAL_MEDICAL_RECORDS;
    } catch {
      return INITIAL_MEDICAL_RECORDS;
    }
  });

  const [labTests, setLabTests] = useState<LabTest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}labs`);
      return saved ? JSON.parse(saved) : INITIAL_LAB_TESTS;
    } catch {
      return INITIAL_LAB_TESTS;
    }
  });

  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}invoices`);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // LocalStorage Auto-Sync
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}patients`, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}records`, JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}labs`, JSON.stringify(labTests));
  }, [labTests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}invoices`, JSON.stringify(invoices));
  }, [invoices]);

  // Toast Helpers
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>): Patient => {
    const newId = `pat-${Date.now().toString().slice(-5)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newMrn = `HSP-2026-${randomSuffix}`;
    const today = new Date().toISOString().split('T')[0];

    const colors = ['bg-blue-700', 'bg-teal-700', 'bg-emerald-700', 'bg-indigo-700', 'bg-purple-700', 'bg-amber-700'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newPatient: Patient = {
      ...patientData,
      id: newId,
      mrn: newMrn,
      registeredDate: today,
      avatarColor,
    };

    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Patient ${newPatient.fullName} registered successfully (MRN: ${newMrn})`, 'success');
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Patient record updated', 'info');
  };

  const deletePatient = (id: string) => {
    const p = patients.find((pat) => pat.id === id);
    setPatients((prev) => prev.filter((pat) => pat.id !== id));
    showToast(`Patient ${p?.fullName || ''} record removed`, 'info');
  };

  const getPatientById = (id: string) => {
    return patients.find((p) => p.id === id);
  };

  const getDoctorById = (id: string) => {
    return doctors.find((d) => d.id === id);
  };

  // Appointment Actions
  const bookAppointment = (aptData: {
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    type: Appointment['type'];
    symptoms: string;
    notes?: string;
  }): Appointment => {
    const patient = patients.find((p) => p.id === aptData.patientId);
    const doctor = doctors.find((d) => d.id === aptData.doctorId);

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString().slice(-5)}`,
      appointmentNumber: `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: aptData.patientId,
      patientName: patient ? patient.fullName : 'Unknown Patient',
      doctorId: aptData.doctorId,
      doctorName: doctor ? doctor.name : 'Unknown Doctor',
      department: doctor ? doctor.department : 'General Medicine',
      date: aptData.date,
      timeSlot: aptData.timeSlot,
      type: aptData.type,
      status: 'Scheduled',
      symptoms: aptData.symptoms,
      notes: aptData.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(`Appointment confirmed with ${newAppointment.doctorName} on ${newAppointment.date}`, 'success');
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast(`Appointment status updated to ${status}`, 'info');
  };

  // Medical Record Actions
  const addMedicalRecord = (recData: Omit<MedicalRecord, 'id' | 'recordNumber'>): MedicalRecord => {
    const newRecord: MedicalRecord = {
      ...recData,
      id: `rec-${Date.now().toString().slice(-5)}`,
      recordNumber: `EMR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setMedicalRecords((prev) => [newRecord, ...prev]);

    // If associated with an appointment, update appointment status to Completed
    if (recData.appointmentId) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === recData.appointmentId ? { ...apt, status: 'Completed' } : apt))
      );
    }

    showToast(`Clinical note & EMR saved for ${newRecord.patientName}`, 'success');
    return newRecord;
  };

  const getRecordsByPatientId = (patientId: string) => {
    return medicalRecords.filter((rec) => rec.patientId === patientId);
  };

  // Lab Test Actions
  const createLabOrder = (orderData: {
    patientId: string;
    doctorId: string;
    testName: string;
    category: LabTest['category'];
    sampleType: string;
    urgency: LabTest['urgency'];
    price: number;
    parameters: Array<{ name: string; unit: string; referenceRange: string; value?: string }>;
  }): LabTest => {
    const patient = patients.find((p) => p.id === orderData.patientId);
    const doctor = doctors.find((d) => d.id === orderData.doctorId);

    const newLabTest: LabTest = {
      id: `lab-${Date.now().toString().slice(-5)}`,
      testOrderNumber: `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: orderData.patientId,
      patientName: patient ? patient.fullName : 'Unknown Patient',
      doctorId: orderData.doctorId,
      doctorName: doctor ? doctor.name : 'Attending Physician',
      testName: orderData.testName,
      category: orderData.category,
      sampleType: orderData.sampleType,
      orderedDate: new Date().toISOString().split('T')[0],
      status: 'Ordered',
      urgency: orderData.urgency,
      price: orderData.price,
      parameters: orderData.parameters.map((p, idx) => ({
        id: `param-${idx + 1}`,
        name: p.name,
        value: p.value || 'Pending',
        unit: p.unit,
        referenceRange: p.referenceRange,
        flag: 'Normal',
      })),
      technicianNotes: 'Order received. Sample collection queued.',
    };

    setLabTests((prev) => [newLabTest, ...prev]);
    showToast(`Lab investigation order placed: ${newLabTest.testName}`, 'success');
    return newLabTest;
  };

  const updateLabTest = (id: string, updates: Partial<LabTest>) => {
    setLabTests((prev) =>
      prev.map((lt) => (lt.id === id ? { ...lt, ...updates } : lt))
    );
    showToast('Lab test order & report updated', 'info');
  };

  const getLabTestsByPatientId = (patientId: string) => {
    return labTests.filter((lt) => lt.patientId === patientId);
  };

  // Billing Actions
  const createInvoice = (invoiceData: Omit<BillingInvoice, 'id' | 'invoiceNumber'>): BillingInvoice => {
    const newInvoice: BillingInvoice = {
      ...invoiceData,
      id: `inv-${Date.now().toString().slice(-5)}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`Invoice ${newInvoice.invoiceNumber} generated for ${newInvoice.patientName}`, 'success');
    return newInvoice;
  };

  const recordPayment = (invoiceId: string, amount: number, method: PaymentMethod, notes?: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const totalPaid = inv.amountPaid + amount;
        const newStatus = totalPaid >= inv.grandTotal ? 'Paid' : 'Partially Paid';
        return {
          ...inv,
          amountPaid: totalPaid,
          status: newStatus,
          paymentMethod: method,
          paymentDate: new Date().toISOString().split('T')[0],
          notes: notes ? `${inv.notes ? inv.notes + ' | ' : ''}${notes}` : inv.notes,
        };
      })
    );
    showToast(`Payment of $${amount.toFixed(2)} recorded successfully`, 'success');
  };

  const getInvoicesByPatientId = (patientId: string) => {
    return invoices.filter((inv) => inv.patientId === patientId);
  };

  // System Database Reset & Export
  const resetAllData = () => {
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setLabTests(INITIAL_LAB_TESTS);
    setInvoices(INITIAL_INVOICES);
    localStorage.clear();
    showToast('Hospital database reset to initial demonstration records', 'info');
  };

  const exportDatabaseJSON = () => {
    const data = {
      hospital: 'St. Jude Metropolitan Hospital & Medical Center',
      exportDate: new Date().toISOString(),
      patients,
      doctors,
      appointments,
      medicalRecords,
      labTests,
      invoices,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `carepulse_hms_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Hospital system database exported as JSON', 'success');
  };

  return (
    <HospitalContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeStaffTab,
        setActiveStaffTab,
        selectedPatientId,
        setSelectedPatientId,
        searchQuery,
        setSearchQuery,
        patients,
        doctors,
        appointments,
        medicalRecords,
        labTests,
        invoices,
        addPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        getDoctorById,
        bookAppointment,
        updateAppointmentStatus,
        addMedicalRecord,
        getRecordsByPatientId,
        createLabOrder,
        updateLabTest,
        getLabTestsByPatientId,
        createInvoice,
        recordPayment,
        getInvoicesByPatientId,
        printDocument,
        setPrintDocument,
        toasts,
        showToast,
        removeToast,
        resetAllData,
        exportDatabaseJSON,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
