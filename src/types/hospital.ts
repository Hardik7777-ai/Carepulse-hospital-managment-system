export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'Male' | 'Female' | 'Other';

export type AdmissionStatus = 'Outpatient' | 'Inpatient' | 'Discharged';

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number e.g. HSP-2026-0104
  fullName: string;
  age: number;
  dob: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    coveragePercent: number;
  };
  allergies: string[];
  chronicConditions: string[];
  admissionStatus: AdmissionStatus;
  roomNumber?: string;
  registeredDate: string;
  primaryDoctorId?: string;
  avatarColor?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  roomNumber: string;
  phone: string;
  email: string;
  availableDays: string[];
  availableHours: string;
  avatarColor: string;
}

export type AppointmentStatus = 'Scheduled' | 'In Consultation' | 'Completed' | 'Cancelled';
export type AppointmentType = 'Routine Checkup' | 'Follow-up' | 'Specialist Consultation' | 'Emergency' | 'Lab Review';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  type: AppointmentType;
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  createdAt: string;
}

export interface Vitals {
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm
  temperature: number; // °F or °C
  respiratoryRate: number; // breaths/min
  oxygenSaturation: number; // %
  weightKg: number;
  heightCm: number;
  bmi: number;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "Twice daily after meals"
  duration: string; // e.g. "5 days"
  instructions: string;
}

export interface MedicalRecord {
  id: string;
  recordNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  visitDate: string;
  chiefComplaint: string;
  diagnosis: string;
  icdCode?: string;
  vitals: Vitals;
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  orderedLabTestIds?: string[];
  followUpDate?: string;
  appointmentId?: string;
}

export type LabTestStatus = 'Ordered' | 'Sample Collected' | 'In Analysis' | 'Completed' | 'Cancelled';
export type LabTestUrgency = 'Routine' | 'Urgent' | 'STAT';
export type ParameterFlag = 'Normal' | 'Low' | 'High' | 'Critical';

export interface LabParameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: ParameterFlag;
}

export interface LabTest {
  id: string;
  testOrderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology' | 'Microbiology' | 'Cardiology' | 'Endocrinology' | 'General';
  sampleType: string; // Blood, Urine, Sputum, Imaging, etc.
  orderedDate: string;
  completedDate?: string;
  status: LabTestStatus;
  urgency: LabTestUrgency;
  price: number;
  parameters: LabParameter[];
  technicianNotes?: string;
  pathologistSummary?: string;
  authorizedBy?: string;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue';
export type PaymentMethod = 'Credit / Debit Card' | 'Cash' | 'Insurance Direct' | 'Online Banking';

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Laboratory' | 'Pharmacy' | 'Ward / Nursing' | 'Procedure';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  insuranceDiscount: number;
  tax: number;
  grandTotal: number;
  amountPaid: number;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  notes?: string;
}

export type AppViewMode = 'staff' | 'patient';

export type StaffTab = 
  | 'dashboard' 
  | 'patients' 
  | 'appointments' 
  | 'medical-records' 
  | 'laboratory' 
  | 'billing' 
  | 'doctors';
