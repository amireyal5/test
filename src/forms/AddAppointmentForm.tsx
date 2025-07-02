import React, { useState } from 'react';
import { Appointment, Patient, AppointmentType } from '../types';
import { ClockIcon } from '../components/icons';
import { addMinutes, isWithinInterval } from 'date-fns';

type AppointmentFormProps = {
    onSubmit: (data: any) => Promise<void>; // שונה פה
    onCancel: () => void;
    patients: Patient[];
    appointmentTypes: AppointmentType[];
    existingAppointments: Appointment[];
    patientId?: string;
    initialData?: Appointment;
};

const AppointmentForm = ({
    onSubmit,
    onCancel,
    patients,
    appointmentTypes,
    existingAppointments,
    patientId,
    initialData
}: AppointmentFormProps) => {
    const isEditMode = Boolean(initialData);
    const [isRecurring, setIsRecurring] = useState(false);
    const [collisionWarning, setCollisionWarning] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCollisionWarning(null);
        const formData = new FormData(e.currentTarget);

        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const duration = parseInt(formData.get('duration') as string, 10);

        const newApptStart = new Date(`${date}T${time}`);
        const newApptEnd = addMinutes(newApptStart, duration);

        const conflictingAppointment = existingAppointments.find(appt => {
            if (appt.id === initialData?.id) return false;
            const existingApptStart = new Date(`${appt.date}T${appt.time}`);
            const existingApptEnd = addMinutes(existingApptStart, appt.duration);
            return (
                isWithinInterval(newApptStart, { start: existingApptStart, end: existingApptEnd }) ||
                isWithinInterval(newApptEnd, { start: existingApptStart, end: existingApptEnd }) ||
                isWithinInterval(existingApptStart, { start: newApptStart, end: newApptEnd })
            );
        });

        if (conflictingAppointment) {
            setCollisionWarning(`התראה: פגישה זו מתנגשת עם פגישה קיימת של ${conflictingAppointment.patientName} בשעה ${conflictingAppointment.time}.`);
            return;
        }

        const appointmentData = {
            id: initialData?.id,
            patientId: formData.get('patientId') as string,
            date,
            time,
            type: formData.get('type') as string,
            duration,
            price: parseFloat(formData.get('price') as string),
            paymentStatus: formData.get('paymentStatus') as 'Paid' | 'Unpaid',
        };

        const recurrenceData = {
            isRecurring: formData.get('isRecurring') === 'on',
            endDate: formData.get('endDate') as string,
        };

        await onSubmit({ appointmentData, recurrenceData }); // await הוסף
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            {collisionWarning && (
                <div className="p-3 bg-yellow-100 border-r-4 border-yellow-500 text-yellow-800 rounded-md">
                    <p className="font-bold">אזהרת התנגשות</p>
                    <p>{collisionWarning}</p>
                </div>
            )}

            <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">פרטי הפגישה</h4>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מטופל *</label>
                        <select name="patientId" id="patientId" required defaultValue={initialData?.patientId || patientId || ""} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="" disabled>בחר מטופל</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תאריך *</label>
                            <input type="date" name="date" id="date" required defaultValue={initialData?.date || new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שעה *</label>
                            <input type="time" name="time" id="time" required defaultValue={initialData?.time || '09:00'} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">סוג פגישה *</label>
                        <select name="type" id="type" required defaultValue={initialData?.type} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="" disabled>בחר סוג פגישה</option>
                            {appointmentTypes.map(type => (
                                <option key={type.id} value={type.name}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">משך (דקות) *</label>
                        <div className="relative">
                            <input type="number" name="duration" id="duration" required defaultValue={initialData?.duration || 50} className="w-full px-3 py-2 pl-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">פרטים כספיים</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מחיר</label>
                        <div className="relative">
                            <input type="number" name="price" id="price" step="0.01" defaultValue={initialData?.price || 350} className="w-full px-3 py-2 pr-8 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">סטטוס תשלום</label>
                        <select name="paymentStatus" id="paymentStatus" defaultValue={initialData?.paymentStatus || "Unpaid"} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="Unpaid">לא שולם</option>
                            <option value="Paid">שולם</option>
                        </select>
                    </div>
                </div>
            </div>

            {!isEditMode && (
                <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">פגישה חוזרת</h4>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="isRecurring" name="isRecurring" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                            <label htmlFor="isRecurring" className="ml-2 mr-2 block text-sm text-gray-900 dark:text-gray-300">פגישה שבועית חוזרת</label>
                        </div>
                        {isRecurring && (
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">חזור על הפגישה עד תאריך</label>
                                <input type="date" name="endDate" id="endDate" required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">ביטול</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    {isEditMode ? 'עדכן פגישה' : 'קבע פגישה'}
                </button>
            </div>
        </form>
    );
};

export default AppointmentForm;
