// src/data.ts
import { Patient, Appointment, Payment, SessionNote } from './types';

// Dates are set to June 2025 to match the screenshots
export const mockPatients: Omit<Patient, 'id'>[] = [
    { name: 'משה לוינסון', phone: '054-7509962', email: 'amirher@gmail.com', birthDate: '1989-06-15', status: 'Active' },
    { name: 'לילה', phone: '052-1234567', email: 'leila@example.com', birthDate: '1997-03-10', status: 'Active' },
    { name: 'אנה כהן', phone: '050-9876543', email: 'anna@example.com', birthDate: '1985-11-22', status: 'Inactive' },
    { name: 'דוד לוי', phone: '053-1122334', email: 'david@example.com', birthDate: '2001-01-01', status: 'Active' },
    { name: 'שרה ישראלי', phone: '058-5554433', email: 'sara@example.com', birthDate: '1976-07-07', status: 'Active' },
    { name: 'יוסי כהן', phone: '054-1234567', email: 'yossi@example.com', birthDate: '1990-01-01', status: 'Active' },
    { name: 'מירי לוי', phone: '052-9876543', email: 'miri@example.com', birthDate: '1988-05-15', status: 'Inactive' },
    { name: 'אלינור דוידסון', phone: '050-1112223', email: 'elinor@example.com', birthDate: '1995-09-20', status: 'Active' },
    { name: 'רועי שוורץ', phone: '053-4445566', email: 'roy@example.com', birthDate: '1982-02-28', status: 'Active' },
    { name: 'נועה פרידמן', phone: '058-7778899', email: 'noa@example.com', birthDate: '1993-12-05', status: 'Active' },
];

export const mockAppointments: Omit<Appointment, 'id' | 'patientName'>[] = [
    // **הוספה של confirmationStatus לכל הפגישות**
    { patientId: '1', type: 'בדיקה תקופתית', date: '2025-06-01', time: '10:00', duration: 60, notes: 'בדיקה שגרתית', paymentStatus: 'Paid', confirmationStatus: 'Confirmed' },
    { patientId: '1', type: 'ייעוץ', date: '2025-06-08', time: '11:00', duration: 30, paymentStatus: 'Pending', confirmationStatus: 'Confirmed' },
    { patientId: '2', type: 'מעקב', date: '2025-06-03', time: '14:00', duration: 45, paymentStatus: 'Paid', confirmationStatus: 'Confirmed' },
    { patientId: '3', type: 'בדיקה תקופתית', date: '2025-06-05', time: '09:00', duration: 60, paymentStatus: 'Pending', confirmationStatus: 'Confirmed' },
    { patientId: '4', type: 'ייעוץ', date: '2025-06-10', time: '15:00', duration: 30, paymentStatus: 'Paid', confirmationStatus: 'Confirmed' },
    { patientId: '5', type: 'מעקב', date: '2025-06-12', time: '16:00', duration: 45, paymentStatus: 'Pending', confirmationStatus: 'Confirmed' },
    { patientId: '1', type: 'ייעוץ', date: '2025-06-15', time: '10:30', duration: 30, paymentStatus: 'Paid', confirmationStatus: 'Confirmed' },
    { patientId: '2', type: 'בדיקה תקופתית', date: '2025-06-17', time: '13:00', duration: 60, paymentStatus: 'Pending', confirmationStatus: 'Confirmed' },
    { patientId: '3', type: 'מעקב', date: '2025-06-19', time: '11:00', duration: 45, paymentStatus: 'Paid', confirmationStatus: 'Confirmed' },
    { patientId: '4', type: 'ייעוץ', date: '2025-06-22', time: '14:30', duration: 30, paymentStatus: 'Pending', confirmationStatus: 'Confirmed' },
    { patientId: '5', type: 'בדיקה תקופתית', date: '2025-06-24', time: '09:30', duration: 60, paymentStatus: 'Paid', confirmationStatus: 'Confirmed' },
    { patientId: '1', type: 'מעקב', date: '2025-06-26', time: '10:00', duration: 45, paymentStatus: 'Pending', confirmationStatus: 'Confirmed' },
    { patientId: '2', type: 'ייעוץ', date: '2025-06-28', time: '11:30', duration: 30, paymentStatus: 'Paid', confirmationStatus: 'Confirmed' },
    { patientId: '3', type: 'בדיקה תקופתית', date: '2025-06-30', time: '15:00', duration: 60, paymentStatus: 'Pending', confirmationStatus: 'Confirmed' },
];

export const mockPayments: Omit<Payment, 'id'>[] = [
    { patientId: '1', amount: 250, date: '2025-06-01', method: 'Cash', notes: 'תשלום עבור בדיקה תקופתית' },
    { patientId: '2', amount: 150, date: '2025-06-03', method: 'Credit Card', notes: 'תשלום עבור מעקב' },
    { patientId: '4', amount: 150, date: '2025-06-10', method: 'Bank Transfer', notes: 'תשלום עבור ייעוץ' },
    { patientId: '5', amount: 250, date: '2025-06-24', method: 'Cash', notes: 'תשלום עבור בדיקה תקופתית' },
    { patientId: '2', amount: 150, date: '2025-06-28', method: 'Credit Card', notes: 'תשלום עבור ייעוץ' },
];

export const mockSessionNotes: Omit<SessionNote, 'id'>[] = [
    { patientId: '1', date: '2025-06-01', title: 'בדיקה תקופתית ראשונה', content: 'המטופל הגיע עם תלונות קלות. בוצעה בדיקה יסודית. הומלץ על המשך מעקב.' },
    { patientId: '2', date: '2025-06-03', title: 'פגישת מעקב', content: 'המטופל מראה שיפור משמעותי. הותאם טיפול תרופתי.' },
    { patientId: '1', date: '2025-06-15', title: 'ייעוץ טלפוני', content: 'שיחת ייעוץ קצרה. המטופל מרגיש טוב יותר.' },
    { patientId: '3', date: '2025-06-19', title: 'פגישת מעקב', content: 'המטופל הגיע לביקורת. המשך טיפול.' },
    { patientId: '2', date: '2025-06-28', title: 'פגישת ייעוץ', content: 'המטופל מרוצה מהטיפול. נקבעה פגישה נוספת.' },
];
