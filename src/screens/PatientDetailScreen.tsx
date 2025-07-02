





import React, { useState, useMemo, useEffect } from 'react';
import { Patient, Appointment, Payment, SessionNote, ModalConfig, ClinicProfile, Funder, Attachment } from '../types';
import { ArrowRightIcon, PlusIcon, PencilIcon, TrashIcon, SparklesIcon, FileText, AlertCircle } from 'lucide-react';
import InitialsAvatar from '../components/InitialsAvatar';
import { differenceInYears, isPast } from 'date-fns';
import FileUpload from '../components/FileUpload';
import PaymentsList from '../components/PaymentsList';

type PatientDetailScreenProps = {
    patient: Patient;
    attachments: Attachment[];
    appointments: Appointment[];
    payments: Payment[];
    notes: SessionNote[];
    funders: Funder[];
    clinicProfile: ClinicProfile | null;
    onBack: () => void;
    onOpenModal: (config: ModalConfig) => void;
    onDeleteAppointment: (appointment: Appointment) => void;
    onDeletePayment: (payment: Payment) => void;
    onDeleteNote: (note: SessionNote) => void;
    onUpdatePatientLog: (log: string) => void;
    onAddAttachment: (url: string, fileName: string) => void;
    onDeleteAttachment: (attachment: Attachment) => void;
};

const WhatsappIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.12c-1.5 0-2.95-.4-4.23-1.14l-.3-.18-3.12.82.83-3.04-.2-.32c-.82-1.32-1.25-2.83-1.25-4.38 0-4.54 3.69-8.23 8.23-8.23 4.54 0 8.23 3.69 8.23 8.23s-3.69 8.23-8.23 8.23zm4.52-6.14c-.25-.13-1.47-.72-1.7-.82s-.39-.13-.56.13c-.17.25-.64.82-.79.98s-.29.18-.54.06c-.25-.12-1.07-.39-2.04-1.26s-1.46-1.95-1.63-2.28c-.17-.33-.02-.51.11-.64.12-.12.25-.29.38-.43s.17-.25.25-.42c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.4-.42-.55-.42-.14 0-.3 0-.46 0s-.42.06-.64.31c-.22.25-.86.84-.86 2.05s.88 2.37 1 2.54c.12.17 1.74 2.65 4.2 3.72.59.26 1.05.41 1.41.52.59.18 1.13.15 1.55.09.48-.06 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.25-.18-.5-.31z" />
    </svg>
);


const PatientDetailScreen: React.FC<PatientDetailScreenProps> = ({
    patient,
    attachments,
    appointments,
    payments,
    notes,
    funders,
    clinicProfile,
    onBack,
    onOpenModal,
    onDeleteAppointment,
    onDeletePayment,
    onDeleteNote,
    onUpdatePatientLog,
    onAddAttachment,
    onDeleteAttachment
}) => {
    const age = patient.birthDate ? differenceInYears(new Date(), new Date(patient.birthDate)) : 'N/A';
    const [personalLog, setPersonalLog] = useState(patient.personalLog || '');
    const [isLogEditing, setIsLogEditing] = useState(false);
    
    useEffect(() => {
        setPersonalLog(patient.personalLog || '');
    }, [patient.personalLog]);

    const futureAppointments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison
        return appointments
            .filter(appt => new Date(appt.date) >= today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [appointments]);

    const isAppointmentUndocumented = (appointmentId?: string) => {
        if (!appointmentId) return false;
        return !notes.some(note => note.appointmentId === appointmentId);
    };

    const handleLogSave = () => {
        onUpdatePatientLog(personalLog);
        setIsLogEditing(false);
    };

    const handleWhatsApp = () => {
        if (!patient.phone) return;
        let cleanedPhone = patient.phone.replace(/\D/g, '');
        if (cleanedPhone.startsWith('0')) {
            cleanedPhone = '972' + cleanedPhone.substring(1);
        } else if (cleanedPhone.length === 9) { // Handle numbers without leading 0
            cleanedPhone = '972' + cleanedPhone;
        }
        window.open(`https://wa.me/${cleanedPhone}`, '_blank');
    };

    const SessionDocumentationList = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">תיעוד פגישות</h3>
                <button 
                    onClick={() => onOpenModal({ type: 'addNote', data: { patientId: patient.id } })}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900"
                >
                    <PlusIcon className="w-4 h-4" /> הוסף תיעוד
                </button>
            </div>
            {notes.length > 0 ? (
                <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(note => {
                        const linkedAppointment = appointments.find(a => a.id === note.appointmentId);
                        return (
                            <li key={note.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{linkedAppointment?.type || note.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(note.date).toLocaleDateString('he-IL')}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onOpenModal({ type: 'editNote', data: { item: note }})} className="text-gray-400 hover:text-blue-500"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => onDeleteNote(note)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                 <p className="text-gray-500 text-sm py-4 text-center">אין תיעודים עבור מטופל זה.</p>
            )}
        </div>
    );

    return (
        <div dir="rtl" className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center w-full sm:w-auto">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="חזרה לרשימת המטופלים">
                        <ArrowRightIcon />
                    </button>
                    <InitialsAvatar name={patient.name} className="w-16 h-16 text-2xl mr-2" />
                    <div className="flex-1 mr-4">
                        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">{patient.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 flex flex-wrap gap-x-2 text-sm">
                            <span>טלפון: {patient.phone}</span>
                            <span className="hidden sm:inline">|</span>
                            <span>גיל: {age}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 items-center sm:ml-auto">
                    <button
                        onClick={handleWhatsApp}
                        className="p-2 text-green-500 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50"
                        aria-label={`שלח הודעת WhatsApp ל-${patient.name}`}
                    >
                        <WhatsappIcon className="w-6 h-6" />
                    </button>
                     <button
                        onClick={() => onOpenModal({ type: 'aiAssistant', data: { item: patient } })}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                        aria-label={`פתח עוזר AI עבור ${patient.name}`}
                    >
                        <SparklesIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onOpenModal({ type: 'editPatient', data: { item: patient } })}
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-600"
                        aria-label={`ערוך פרטי מטופל ${patient.name}`}
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                     <button
                        onClick={() => onOpenModal({type: 'confirmDeletePatient', data: {item: patient}})}
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-500"
                        aria-label={`מחק את ${patient.name}`}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SessionDocumentationList />
                
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                         <PaymentsList
                            payments={payments}
                            patient={patient}
                            funders={funders}
                            clinicProfile={clinicProfile}
                            onOpenModal={onOpenModal}
                        />
                    </div>
                
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">קבצים מצורפים</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {attachments.map(att => (
                                <div key={att.id} className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700/50 group">
                                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                        <FileText className="w-5 h-5"/>
                                        <div>
                                            <p className="font-semibold">{att.fileName}</p>
                                            <p className="text-xs text-gray-500">הועלה ב: {new Date(att.uploadedAt).toLocaleDateString('he-IL')}</p>
                                        </div>
                                    </a>
                                     <button onClick={() => onDeleteAttachment(att)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <FileUpload 
                                onUploadSuccess={onAddAttachment}
                                folder={`patients/${patient.id}/files`}
                                label="העלה קובץ חדש"
                            />
                        </div>
                    </div>

                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">יומן אישי ותוכנית טיפול</h3>
                            <button
                                onClick={() => setIsLogEditing(!isLogEditing)}
                                className="flex items-center gap-2 text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                <PencilIcon className="w-4 h-4" /> {isLogEditing ? 'בטל עריכה' : 'ערוך'}
                            </button>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-sm border-r-4 border-gray-300 dark:border-gray-600 pr-4 py-2">
                             <textarea 
                                value={personalLog}
                                onChange={(e) => setPersonalLog(e.target.value)}
                                readOnly={!isLogEditing}
                                className="w-full h-48 bg-transparent border-none focus:ring-0 p-0 m-0 resize-none"
                                placeholder="כאן ניתן לרכז המלצות להמשך טיפול, מעקב אחר התקדמות, תוכנית טיפול, והמלצות למפגש הבא. ניתן להיעזר בעוזר ה-AI ליצירת תכנים."
                             />
                        </div>
                        {isLogEditing && (
                             <div className="mt-4 flex justify-end">
                                <button onClick={handleLogSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">שמור יומן</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">פגישות עתידיות</h3>
                            <button
                                onClick={() => onOpenModal({ type: 'addAppointment', data: { patientId: patient.id } })}
                                className="flex items-center gap-2 text-sm px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900"
                            >
                                <PlusIcon className="w-4 h-4" /> פגישה חדשה
                            </button>
                        </div>
                        {futureAppointments.length > 0 ? (
                            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {futureAppointments.map(appt => (
                                    <li key={appt.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{appt.type}</p>
                                            <button onClick={() => onDeleteAppointment(appt)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                        <p className="text-sm text-primary-600 dark:text-primary-400">
                                            {new Date(appt.date).toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">בשעה {appt.time}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm py-4 text-center">אין פגישות עתידיות.</p>
                        )}
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">היסטוריית פגישות</h3>
                        <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                           {appointments.filter(a => isPast(new Date(a.date))).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(appt => (
                                <li key={appt.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold">{appt.type}</p>
                                        <div className="flex gap-2 items-center">
                                            {isAppointmentUndocumented(appt.id) && (
                                                <div title="פגישה זו לא תועדה">
                                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                                </div>
                                            )}
                                             <button onClick={() => onDeleteAppointment(appt)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(appt.date).toLocaleDateString('he-IL')}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailScreen;