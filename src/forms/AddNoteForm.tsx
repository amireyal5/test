import React, { useState, useMemo, useEffect } from 'react';
import { SessionNote, Appointment, Patient } from '../types';
import { addDays } from 'date-fns';

type NoteFormProps = {
    onSubmit: (note: SessionNote) => void;
    onCancel: () => void;
    patientId?: string; // Optional initial patient
    initialData?: SessionNote;
    appointments: Appointment[];
    sessionNotes: SessionNote[];
    patients: Patient[];
};

const NoteForm = ({ onSubmit, onCancel, patientId: initialPatientId, initialData, appointments, sessionNotes, patients }: NoteFormProps) => {
    const isEditMode = Boolean(initialData);

    const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || initialData?.patientId || '');

    const [noteData, setNoteData] = useState<Partial<SessionNote>>(initialData || {
        date: new Date().toISOString().split('T')[0],
        title: '',
        content: '',
    });

    const [selectedAppointmentId, setSelectedAppointmentId] = useState(initialData?.appointmentId || '');

    const patientAppointments = useMemo(() => {
        return appointments.filter(appt => appt.patientId === selectedPatientId);
    }, [appointments, selectedPatientId]);

    const availableAppointments = useMemo(() => {
        const documentedAppointmentIds = new Set(
            sessionNotes
                .filter(note => note.id !== initialData?.id)
                .map(note => note.appointmentId)
                .filter(Boolean)
        );

        const today = new Date();
        const pastAppts = patientAppointments
            .filter(appt => new Date(appt.date) <= today && !documentedAppointmentIds.has(appt.id))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const futureAppts = patientAppointments
            .filter(appt => new Date(appt.date) > today && !documentedAppointmentIds.has(appt.id))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);
            
        return [...futureAppts.reverse(), ...pastAppts];
    }, [patientAppointments, sessionNotes, initialData]);

    useEffect(() => {
        if (selectedAppointmentId) {
            const selectedAppt = appointments.find(a => a.id === selectedAppointmentId);
            if (selectedAppt) {
                setNoteData(prev => ({ ...prev, date: selectedAppt.date, title: prev.title || selectedAppt.type }));
            }
        } else if (!isEditMode) {
            setNoteData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
        }
    }, [selectedAppointmentId, appointments, isEditMode]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const finalNote: SessionNote = {
            id: initialData?.id,
            patientId: selectedPatientId,
            title: noteData.title || 'תיעוד כללי',
            content: noteData.content || '',
            date: noteData.date!,
            appointmentId: selectedAppointmentId || undefined,
        };

        onSubmit(finalNote);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            {!initialPatientId && (
                 <div>
                    <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מטופל *</label>
                    <select
                        id="patientId"
                        name="patientId"
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="" disabled>בחר מטופל</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            )}
            
            {selectedPatientId && (
                <div>
                    <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">קישור לפגישה</label>
                    <select
                        id="appointmentId"
                        name="appointmentId"
                        value={selectedAppointmentId}
                        onChange={(e) => setSelectedAppointmentId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">תיעוד כללי (ללא קישור)</option>
                        {availableAppointments.map(appt => (
                            <option key={appt.id} value={appt.id}>
                                {`${new Date(appt.date).toLocaleDateString('he-IL')} - ${appt.type}`}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">הרשימה מציגה פגישות עבר ו-3 פגישות עתידיות שטרם תועדו.</p>
                </div>
            )}

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תאריך תיעוד</label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    value={noteData.date || ''}
                    onChange={e => setNoteData(prev => ({ ...prev, date: e.target.value }))}
                    disabled={!!selectedAppointmentId}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                />
            </div>

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">כותרת *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={noteData.title || ''}
                    onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תוכן התיעוד *</label>
                <textarea
                    name="content"
                    id="content"
                    rows={8}
                    required
                    value={noteData.content || ''}
                    onChange={(e) => setNoteData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="תיאור מהלך הפגישה, תובנות, התרשמות כללית..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">ביטול</button>
                <button type="submit" disabled={!selectedPatientId} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-400">
                    {isEditMode ? 'עדכן תיעוד' : 'הוסף תיעוד'}
                </button>
            </div>
        </form>
    );
};

export default NoteForm;