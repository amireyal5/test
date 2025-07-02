export type Attachment = {
  id: string;
  patientId: string;
  userId: string;
  fileName: string;
  url: string;
  uploadedAt: string;
};

export type Patient = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  birthDate?: string;
  status: "Active" | "Inactive";
  lastVisit?: string;
  personalLog?: string; 
};

export type Appointment = {
  id?: string;
  patientId: string;
  patientName: string;
  time: string;
  date: string;
  type: string;
  duration: number;
  price?: number;
  paymentStatus: "Paid" | "Unpaid" | "Pending";
  confirmationStatus: "Confirmed" | "Unconfirmed";
  isRecurring?: boolean;
  seriesId?: string; 
  notes?: string;
};

export type Payment = {
  id?: string;
  patientId: string;
  date: string;
  amount: number;
  method: "Cash" | "Credit Card" | "Bank Transfer" | "Check";
  appointmentId?: string;
  receiptNumber?: string;
  notes?: string;
  funderId?: string;
  funderAmount?: number;
};

export type Funder = {
  id?: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  billingDetails?: string;
};

export type SessionNote = {
  id?: string;
  patientId: string;
  date: string;
  title: string;
  content: string;
  appointmentId?: string;
};

export type ClinicProfile = {
  clinicName: string;
  therapistName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string; 
  userImageUrl?: string;
  receiptCounter?: number;
};

export type AppointmentType = {
  id?: string;
  name: string;
};

export type ModalType =
  | "addPatient"
  | "editPatient"
  | "confirmDeletePatient"
  | "addAppointment"
  | "editAppointment"
  | "editRecurringAppointmentPrompt"
  | "confirmDeleteAppointment"
  | "addNote"
  | "editNote"
  | "confirmDeleteNote"
  | "addPayment"
  | "editPayment"
  | "confirmDeletePayment"
  | "addFunder"
  | "editFunder"
  | "confirmDeleteFunder"
  | "viewReceipt"
  | "aiAssistant"
  | "confirmDeleteAttachment"
  | null;

export type ModalConfig = {
  type: ModalType;
  data?: {
    patientId?: string;
    item?:
      | Patient
      | Appointment
      | Payment
      | SessionNote
      | Funder
      | Attachment
      | (Payment & { patient: Patient; clinicProfile: ClinicProfile })
      | { id: string, name: string, seriesId?: string, delete?: boolean };
  };
};