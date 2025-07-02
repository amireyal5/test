
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

// Firebase
import { useAuth } from "@/context/AuthContext";
import * as patientService from "@/services/patientService";
import * as appointmentService from "@/services/appointmentService";
import * as paymentService from "@/services/paymentService";
import * as noteService from "@/services/noteService";
import * as settingsService from "@/services/settingsService";
import * as funderService from "@/services/funderService";

// Types
import { Patient, Appointment, Payment, SessionNote, ModalConfig, ClinicProfile, AppointmentType, Funder, Attachment } from "../types";
import { isPast, differenceInDays, parseISO } from "date-fns";

// Hooks
import { usePersistentState } from "../hooks/usePersistentState";

// Components
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import FloatingActionButton from "../components/FloatingActionButton";
import { PrintableReceipt } from "../components/PrintableReceipt";
import AIAssistant from "../components/AIAssistant";
import BottomNavBar from "../components/BottomNavBar";

// Forms
import PatientForm from "../forms/AddPatientForm";
import AppointmentForm from "../forms/AddAppointmentForm";
import NoteForm from "../forms/AddNoteForm";
import PaymentForm from "../forms/AddPaymentForm";
import FunderForm from "../forms/FunderForm";

// Screens
import DashboardScreen from "../screens/DashboardScreen";
import PatientsScreen from "../screens/PatientsScreen";
import CalendarScreen from "../screens/CalendarScreen";
import PatientDetailScreen from "../screens/PatientDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FinancesScreen from "../screens/FinancesScreen";
import { doc, collection, getFirestore } from "firebase/firestore";


const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [theme, setTheme] = usePersistentState<"light" | "dark">("theme", "light");
  const [currentScreen, _setScreen] = useState("dashboard");
  const [activePatientId, setActivePatientId] = useState<string | null>(null);

  const [loadingStates, setLoadingStates] = useState({
    patients: true,
    appointments: true,
    payments: true,
    sessionNotes: true,
    clinicProfile: true,
    appointmentTypes: true,
    funders: true,
  });
  const isInitialLoading = useMemo(() => Object.values(loadingStates).some(state => state === true), [loadingStates]);

  // Data States
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile | null>(null);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [funders, setFunders] = useState<Funder[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [patientStatusFilter, setPatientStatusFilter] = useState("Active");
  const [modalConfig, setModalConfig] = useState<ModalConfig>({ type: null });

  // Effects
  useEffect(() => {
    document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const updateLoadingState = (key: keyof typeof loadingStates, value: boolean) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    };

    const handleData = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof typeof loadingStates) => (data: T) => {
        setter(data);
        updateLoadingState(key, false);
    };
    
    const handleError = (key: keyof typeof loadingStates) => (error: Error) => {
        console.error(`Error loading ${key}:`, error);
        updateLoadingState(key, false); // Stop loading even on error
    };

    const unsubscribes = [
      patientService.listen(user.uid, handleData(setPatients, 'patients'), handleError('patients')),
      appointmentService.listen(user.uid, handleData(setAppointments, 'appointments'), handleError('appointments')),
      paymentService.listen(user.uid, handleData(setPayments, 'payments'), handleError('payments')),
      noteService.listen(user.uid, handleData(setSessionNotes, 'sessionNotes'), handleError('sessionNotes')),
      settingsService.listenToProfile(user.uid, handleData(setClinicProfile, 'clinicProfile'), handleError('clinicProfile')),
      settingsService.listenToAppointmentTypes(user.uid, handleData(setAppointmentTypes, 'appointmentTypes'), handleError('appointmentTypes')),
      funderService.listen(user.uid, handleData(setFunders, 'funders'), handleError('funders')),
    ];
    
    patientService.seed(user.uid);
    return () => unsubscribes.forEach((unsub) => unsub());
  }, [user, authLoading, router]);
  
  useEffect(() => {
    if(activePatientId) {
      const unsub = patientService.listenToAttachments(activePatientId, setAttachments);
      return () => unsub();
    }
  }, [activePatientId]);


  // Navigation Handlers
  const setScreen = useCallback((screen: string) => {
    setActivePatientId(null);
    setSearchQuery("");
    _setScreen(screen);
  }, []);

  const handleViewDetails = useCallback((patientId: string | undefined) => {
    setActivePatientId(patientId || null);
    _setScreen("patients");
  }, []);

  const handleBackToList = useCallback(() => {
    setActivePatientId(null);
    _setScreen("patients");
  }, []);
  
  // Modal Opening Handlers
  const openDeleteConfirmationModal = (type: ModalConfig['type'], item: any, nameKey: string = 'name') => {
      setModalConfig({ type, data: { item: { id: item.id, name: item[nameKey] || 'פריט זה', seriesId: item.seriesId } } });
  };

  // CRUD Handlers
  const handleAddOrEditPatient = async (patientData: Patient) => {
    if (!user) return;
    await patientService.addOrEdit(user.uid, patientData);
    setModalConfig({ type: null });
  };
  
  const handleUpdatePatientLog = async (log: string) => {
    if(activePatientId) {
      await patientService.updateLog(activePatientId, log);
    }
  }

  const executeDeletePatient = async (patientId: string) => {
    if (!user) return;
    await patientService.remove(user.uid, patientId);
    if (activePatientId === patientId) handleBackToList();
    setModalConfig({ type: null });
  };
  
  const handleAddOrEditAppointment = async ({ appointmentData, recurrenceData }: { appointmentData: Appointment; recurrenceData?: any; }) => {
    if (!user) return;
    const patientName = patients.find((p) => p.id === appointmentData.patientId)?.name;
    if (!patientName) return;
    
    if(appointmentData.id && appointmentData.seriesId && !recurrenceData?.updateFuture){
      setModalConfig({ type: 'editRecurringAppointmentPrompt', data: {item: appointmentData} });
      return;
    }
    
    if(!appointmentData.id && recurrenceData.isRecurring) {
        const db = getFirestore();
        appointmentData.seriesId = String(doc(collection(db, 'dummy')).id);
    }

    await appointmentService.addOrEdit(user.uid, { appointmentData, recurrenceData }, patientName);
    setModalConfig({ type: null });
  };

  const executeDeleteAppointment = async (appointmentId: string, seriesId?: string, deleteAllFuture?: boolean) => {
    await appointmentService.remove(appointmentId, seriesId, deleteAllFuture);
    setModalConfig({type: null});
  };

  const handleAddOrEditPayment = async (paymentData: Payment) => {
    if (!user || !clinicProfile) return;
    await paymentService.addOrEdit(user.uid, paymentData, clinicProfile.receiptCounter || 0);
    // Update receipt counter in profile
    await settingsService.saveProfile(user.uid, { ...clinicProfile, receiptCounter: (clinicProfile.receiptCounter || 0) + 1 });
    setModalConfig({ type: null });
  };

  const executeDeletePayment = async (paymentId: string) => {
      await paymentService.remove(paymentId);
      setModalConfig({ type: null });
  };
  
  const executeDeleteNote = async (noteId: string) => {
      await noteService.remove(noteId);
      setModalConfig({ type: null });
  };

  const handleAddOrEditFunder = async (funderData: Funder) => {
    if (!user) return;
    await funderService.addOrEdit(user.uid, funderData);
    setModalConfig({ type: null });
  };

  const executeDeleteFunder = async (funderId: string) => {
    await funderService.remove(funderId);
    setModalConfig({ type: null });
  };
  
  const handleAddAttachment = async (url: string, fileName: string) => {
      if(!user || !activePatientId) return;
      await patientService.addAttachment(user.uid, activePatientId, url, fileName);
  }
  
  const handleDeleteAttachment = async (attachment: Attachment) => {
      if(!user || !activePatientId) return;
      openDeleteConfirmationModal('confirmDeleteAttachment', attachment, 'fileName');
  }

  const executeDeleteAttachment = async(attachment: Attachment) => {
      await patientService.removeAttachment(attachment);
      setModalConfig({type: null});
  }

  const handleSaveClinicProfile = async (profile: ClinicProfile) => {
    if (!user) return;
    await settingsService.saveProfile(user.uid, profile);
  };
  
  const onSaveAILog = async(logContent: string) => {
      if(!activePatient) return;
      const newLog = `${activePatient.personalLog || ''}\n${logContent}`;
      await patientService.updateLog(activePatient.id!, newLog);
      setModalConfig({type: null});
  }

  // Memoized data
  const activePatient = useMemo(() => patients.find((p) => p.id === activePatientId), [activePatientId, patients]);

  const totalAlerts = useMemo(() => {
    if (isInitialLoading) return 0;
    const today = new Date();
    const unpaidAppointments = appointments.filter(a => a.paymentStatus === 'Unpaid' && a.date && isPast(parseISO(a.date))).length;
    const unconfirmedAppointments = appointments.filter(a => a.confirmationStatus === 'Unconfirmed' && a.date && differenceInDays(parseISO(a.date), today) >= 0 && differenceInDays(parseISO(a.date), today) <= 7).length;
    const upcomingBirthdays = patients.filter(p => {
        if (!p.birthDate) return false;
        const birthDate = new Date(p.birthDate);
        const currentYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        let daysUntil = differenceInDays(currentYearBirthday, today);
        if (daysUntil < 0) daysUntil = differenceInDays(new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate()), today);
        return daysUntil >= 0 && daysUntil <= 30;
    }).length;

    return unpaidAppointments + unconfirmedAppointments + upcomingBirthdays;
  }, [appointments, patients, isInitialLoading]);
  
  const renderScreen = () => {
    if (activePatient) {
      return (
        <PatientDetailScreen
          patient={activePatient}
          appointments={appointments.filter(a => a.patientId === activePatientId)}
          payments={payments.filter(p => p.patientId === activePatientId)}
          notes={sessionNotes.filter(n => n.patientId === activePatientId)}
          funders={funders}
          attachments={attachments}
          clinicProfile={clinicProfile}
          onBack={handleBackToList}
          onOpenModal={setModalConfig}
          onDeleteAppointment={(appointment) => {
            if (appointment.seriesId) {
                setModalConfig({ type: 'editRecurringAppointmentPrompt', data: { item: { ...appointment, delete: true } }});
            } else {
                openDeleteConfirmationModal('confirmDeleteAppointment', appointment, 'type');
            }
          }}
          onDeletePayment={(payment) => openDeleteConfirmationModal('confirmDeletePayment', payment, 'notes')}
          onDeleteNote={(note) => openDeleteConfirmationModal('confirmDeleteNote', note, 'title')}
          onUpdatePatientLog={handleUpdatePatientLog}
          onAddAttachment={handleAddAttachment}
          onDeleteAttachment={handleDeleteAttachment}
        />
      );
    }

    switch (currentScreen) {
      case "dashboard":
        return <DashboardScreen appointments={appointments} patients={patients} payments={payments} sessionNotes={sessionNotes} onOpenModal={setModalConfig} onViewDetails={handleViewDetails} navigateTo={setScreen} isLoading={isInitialLoading} />;
      case "patients":
        return <PatientsScreen patients={patients.filter(p => patientStatusFilter === 'all' || p.status === patientStatusFilter).filter(p=> p.name.toLowerCase().includes(searchQuery.toLowerCase()))} allPatients={patients} onViewDetails={handleViewDetails} onOpenModal={setModalConfig} onDeletePatient={(patient) => openDeleteConfirmationModal('confirmDeletePatient', patient, 'name')} searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={patientStatusFilter} setStatusFilter={setPatientStatusFilter} isLoading={isInitialLoading} />;
      case "calendar":
        return <CalendarScreen appointments={appointments} appointmentTypes={appointmentTypes} sessionNotes={sessionNotes} onOpenModal={setModalConfig} />;
      case "finances":
        return <FinancesScreen payments={payments} patients={patients} appointments={appointments} funders={funders} clinicProfile={clinicProfile} onOpenModal={setModalConfig} />;
      case "settings":
        return <SettingsScreen theme={theme} setTheme={setTheme} clinicProfile={clinicProfile} appointmentTypes={appointmentTypes} onSaveProfile={handleSaveClinicProfile} onAddAppointmentType={(name) => user && settingsService.addAppointmentType(user.uid, name)} onUpdateAppointmentType={(id, name) => user && settingsService.updateAppointmentType(user.uid, id, name)} onDeleteAppointmentType={(id) => user && settingsService.deleteAppointmentType(user.uid, id)} funders={funders} onOpenModal={setModalConfig} />;
      default:
        return <DashboardScreen appointments={appointments} patients={patients} payments={payments} sessionNotes={sessionNotes} onOpenModal={setModalConfig} onViewDetails={handleViewDetails} navigateTo={setScreen} isLoading={isInitialLoading} />;
    }
  };
  
    const ConfirmationModalContent: React.FC<{itemName: string, onConfirm: () => void, onCancel: () => void, children?: React.ReactNode}> = ({ itemName, onConfirm, onCancel, children }) => (
        <div className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-4">אישור מחיקה</h3>
            <p>האם למחוק את {itemName}? {children}</p>
            <div className="mt-6 flex justify-center gap-4">
                <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">מחק</button>
                <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">ביטול</button>
            </div>
        </div>
    );

  const renderModalContent = () => {
    const { type, data } = modalConfig;
    if (!type) return null;

    switch (type) {
        case "addPatient": return <PatientForm onSubmit={handleAddOrEditPatient} onCancel={() => setModalConfig({ type: null })} />;
        case "editPatient": return <PatientForm onSubmit={handleAddOrEditPatient} onCancel={() => setModalConfig({ type: null })} initialData={data?.item as Patient} />;
        case "confirmDeletePatient":
            return <ConfirmationModalContent itemName={(data?.item as any)?.name} onConfirm={() => executeDeletePatient((data?.item as any).id)} onCancel={() => setModalConfig({ type: null })}>פעולה זו תמחק גם את כל הפגישות, התשלומים והתיעודים המשויכים.</ConfirmationModalContent>;
        case "addAppointment": return <AppointmentForm onSubmit={handleAddOrEditAppointment} onCancel={() => setModalConfig({ type: null })} patients={patients} patientId={data?.patientId} appointmentTypes={appointmentTypes} existingAppointments={appointments} />;
        case "editAppointment": return <AppointmentForm onSubmit={handleAddOrEditAppointment} onCancel={() => setModalConfig({ type: null })} patients={patients} initialData={data?.item as Appointment} appointmentTypes={appointmentTypes} existingAppointments={appointments} />;
        case "editRecurringAppointmentPrompt":
            const item = data?.item as any;
            return (
                 <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-4">{item.delete ? "מחיקת פגישה חוזרת" : "עריכת פגישה חוזרת"}</h3>
                    <p>פגישה זו היא חלק מסדרה. כיצד תרצה לפעול?</p>
                    <div className="mt-6 flex flex-col gap-4">
                      {item.delete ? (
                          <>
                             <button onClick={() => {executeDeleteAppointment(item.id, item.seriesId, true)}} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">מחק פגישה זו וכל העתידיות</button>
                             <button onClick={() => {executeDeleteAppointment(item.id, undefined, false)}} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">מחק פגישה זו בלבד</button>
                          </>
                      ) : (
                          <>
                            <button onClick={() => {handleAddOrEditAppointment({appointmentData: item, recurrenceData: {updateFuture: true}}); setModalConfig({type: null});}} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">ערוך פגישה זו וכל העתידיות</button>
                            <button onClick={() => {handleAddOrEditAppointment({appointmentData: item, recurrenceData: {updateFuture: false}}); setModalConfig({type: null});}} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">ערוך פגישה זו בלבד</button>
                          </>
                      )}
                       <button onClick={() => setModalConfig({ type: null })} className="text-sm text-gray-500 hover:underline">ביטול</button>
                    </div>
                 </div>
            );
        case "confirmDeleteAppointment":
            return <ConfirmationModalContent itemName={`הפגישה "${(data?.item as any)?.name}"`} onConfirm={() => executeDeleteAppointment((data?.item as any).id)} onCancel={() => setModalConfig({ type: null })} />;
        case "addPayment": return <PaymentForm onSubmit={handleAddOrEditPayment} onCancel={() => setModalConfig({ type: null })} patientId={data?.patientId} patients={patients} appointments={appointments} funders={funders} />;
        case "editPayment": return <PaymentForm onSubmit={handleAddOrEditPayment} onCancel={() => setModalConfig({ type: null })} initialData={data?.item as Payment} patientId={(data?.item as Payment).patientId} patients={patients} appointments={appointments} funders={funders} />;
        case "confirmDeletePayment":
             return <ConfirmationModalContent itemName={`התשלום על סך ₪${(data?.item as Payment).amount}`} onConfirm={() => executeDeletePayment((data?.item as any).id)} onCancel={() => setModalConfig({ type: null })} />;
        case "addNote": return <NoteForm onSubmit={(note) => { noteService.addOrEdit(user!.uid, note); setModalConfig({ type: null }); }} onCancel={() => setModalConfig({ type: null })} patientId={data?.patientId} appointments={appointments} sessionNotes={sessionNotes} patients={patients} />;
        case "editNote": return <NoteForm onSubmit={(note) => { noteService.addOrEdit(user!.uid, note); setModalConfig({ type: null }); }} onCancel={() => setModalConfig({ type: null })} patientId={(data?.item as SessionNote).patientId} initialData={data?.item as SessionNote} appointments={appointments} sessionNotes={sessionNotes} patients={patients} />;
        case "confirmDeleteNote":
             return <ConfirmationModalContent itemName={`התיעוד "${(data?.item as any)?.name}"`} onConfirm={() => executeDeleteNote((data?.item as any).id)} onCancel={() => setModalConfig({ type: null })} />;
        case "viewReceipt":
            const paymentWithPatient = data?.item as Payment & { patient: Patient; clinicProfile: ClinicProfile; };
            if (!paymentWithPatient || !paymentWithPatient.patient || !clinicProfile) return null;
            return <PrintableReceipt payment={paymentWithPatient} patient={paymentWithPatient.patient} clinicProfile={clinicProfile} />;
        case "aiAssistant": return <AIAssistant patient={data?.item as Patient} patients={patients} appointments={appointments} notes={sessionNotes} onSaveLog={onSaveAILog} />;
        case "addFunder": return <FunderForm onSubmit={handleAddOrEditFunder} onCancel={() => setModalConfig({ type: null })} />;
        case "editFunder": return <FunderForm onSubmit={handleAddOrEditFunder} onCancel={() => setModalConfig({ type: null })} initialData={data?.item as Funder} />;
        case "confirmDeleteFunder":
            return <ConfirmationModalContent itemName={`הגורם המממן "${(data?.item as any)?.name}"`} onConfirm={() => executeDeleteFunder((data?.item as any).id)} onCancel={() => setModalConfig({ type: null })} />;
        case "confirmDeleteAttachment":
             return <ConfirmationModalContent itemName={`הקובץ "${(data?.item as any)?.name}"`} onConfirm={() => executeDeleteAttachment(data?.item as Attachment)} onCancel={() => setModalConfig({ type: null })}>
                <span className="block mt-2 text-sm text-red-500">שימו לב: פעולה זו לא תמחק את הקובץ מהענן, אלא רק את הרישום מהמערכת.</span>
             </ConfirmationModalContent>;
        default: return null;
    }
  };

  const getModalInfo = () => {
    switch (modalConfig.type) {
      case "addPatient": return { title: "הוספת מטופל חדש" };
      case "editPatient": return { title: "עריכת פרטי מטופל" };
      case "addAppointment": return { title: "קביעת פגישה חדשה" };
      case "editAppointment": return { title: "עריכת פגישה" };
      case "addPayment": return { title: "הוספת תשלום חדש" };
      case "editPayment": return { title: "עריכת תשלום" };
      case "addNote": return { title: "הוספת תיעוד פגישה", size: "lg" as const };
      case "editNote": return { title: "עריכת תיעוד פגישה", size: "lg" as const };
      case "addFunder": return { title: "הוספת גורם מממן" };
      case "editFunder": return { title: "עריכת גורם מממן" };
      case "confirmDeletePatient":
      case "confirmDeleteFunder":
      case "confirmDeletePayment":
      case "confirmDeleteNote":
      case "confirmDeleteAppointment": 
      case "confirmDeleteAttachment": return { title: "אישור מחיקה" };
      case "viewReceipt": {
        const itemAsPayment = modalConfig.data?.item as Payment;
        return { title: `קבלה מספר ${itemAsPayment?.receiptNumber || ''}` };
      }
      case "aiAssistant": return { title: "עוזר AI חכם" };
      case "editRecurringAppointmentPrompt": return { title: "עריכת פגישה חוזרת" };
      default: return { title: "" };
    }
  };
  
  const modalInfo = getModalInfo();

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Sidebar currentScreen={currentScreen} setScreen={setScreen} clinicProfile={clinicProfile} totalAlerts={totalAlerts} onOpenModal={setModalConfig} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-16 md:pb-0" key={activePatientId || currentScreen}>
          <div className="container mx-auto px-6 py-8">{renderScreen()}</div>
        </main>
      </div>
      {!activePatientId && (
        <div className="fixed top-4 left-4 z-50">
          <FloatingActionButton onOpenModal={setModalConfig} />
        </div>
      )}
      {modalConfig.type && (
        <Modal onClose={() => setModalConfig({ type: null })} title={modalInfo.title} size={modalInfo.size}>
          {renderModalContent()}
        </Modal>
      )}
      <BottomNavBar currentScreen={currentScreen} setScreen={setScreen} />
    </div>
  );
};

export default HomePage;
