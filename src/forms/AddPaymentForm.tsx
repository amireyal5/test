import React, { useState, useEffect, useMemo } from 'react';
import { Payment, Patient, Appointment, Funder } from '../types';

type PaymentFormProps = {
    onSubmit: (payment: Payment) => Promise<void>;
    onCancel: () => void;
    patientId?: string;
    initialData?: Payment;
    patients: Patient[];
    appointments: Appointment[];
    funders: Funder[];
};

const PaymentForm: React.FC<PaymentFormProps> = ({
    onSubmit,
    onCancel,
    patientId: propPatientId,
    initialData,
    patients,
    appointments,
    funders,
}) => {
    const isEditMode = Boolean(initialData);

    const [paymentData, setPaymentData] = useState<Partial<Payment>>(initialData || {
        patientId: propPatientId,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        method: 'Cash',
        notes: '',
        appointmentId: undefined,
        funderId: '',
        funderAmount: 0,
    });

    const activePatients = useMemo(() => patients.filter(p => p.status === 'Active'), [patients]);

    const patientAppointments = useMemo(() => {
        if (!paymentData.patientId) return [];
        return appointments.filter(appt => appt.patientId === paymentData.patientId);
    }, [appointments, paymentData.patientId]);

    useEffect(() => {
        if (propPatientId && !isEditMode && !paymentData.patientId) {
            setPaymentData(prev => ({ ...prev, patientId: propPatientId }));
        }
    }, [propPatientId, isEditMode, paymentData.patientId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!paymentData.patientId || paymentData.amount === undefined || !paymentData.date || !paymentData.method) {
            alert('אנא מלא את כל השדות הנדרשים: מטופל, סכום, תאריך ושיטת תשלום.');
            return;
        }
        
        const finalPayment: Payment = {
            id: paymentData.id,
            patientId: paymentData.patientId,
            amount: paymentData.amount,
            date: paymentData.date,
            method: paymentData.method,
            appointmentId: paymentData.appointmentId,
            notes: paymentData.notes,
            funderId: paymentData.funderId || undefined,
            funderAmount: paymentData.funderAmount || undefined,
        };

        await onSubmit(finalPayment);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">פרטי תשלום</h4>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מטופל *</label>
                        <select
                            id="patientId"
                            name="patientId"
                            required
                            value={paymentData.patientId || ''}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, patientId: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={isEditMode && !!initialData?.patientId}
                        >
                            <option value="">בחר מטופל</option>
                            {activePatients.map(patient => (
                                <option key={patient.id} value={patient.id}>{patient.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">קישור לפגישה (אופציונלי)</label>
                        <select
                            id="appointmentId"
                            name="appointmentId"
                            value={paymentData.appointmentId || ''}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, appointmentId: e.target.value || undefined }))}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={!paymentData.patientId}
                        >
                            <option value="">ללא קישור לפגישה</option>
                            {patientAppointments.map(appt => (
                                <option key={appt.id} value={appt.id}>
                                    {`${appt.type} - ${new Date(appt.date).toLocaleDateString('he-IL')} ${appt.time}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">סכום *</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                required
                                value={paymentData.amount || ''}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                min="0"
                                step="0.01"
                            />
                        </div>
                         <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תאריך *</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                value={paymentData.date || ''}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">אמצעי תשלום *</label>
                        <select
                            id="method"
                            name="method"
                            required
                            value={paymentData.method || ''}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value as Payment['method'] }))}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="Cash">מזומן</option>
                            <option value="Credit Card">כרטיס אשראי</option>
                            <option value="Bank Transfer">העברה בנקאית</option>
                            <option value="Check">צ'ק</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">הערות</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={2}
                            value={paymentData.notes || ''}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

             <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">מימון חיצוני</h4>
                <div className="space-y-4">
                    <div>
                         <label htmlFor="funderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">גורם מממן</label>
                         <select
                             id="funderId"
                             name="funderId"
                             value={paymentData.funderId || ''}
                             onChange={(e) => setPaymentData(prev => ({ ...prev, funderId: e.target.value || '' }))}
                             className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                         >
                             <option value="">ללא מימון</option>
                             {funders.map(funder => (
                                 <option key={funder.id} value={funder.id}>{funder.name}</option>
                             ))}
                         </select>
                    </div>
                    {paymentData.funderId && (
                        <div>
                            <label htmlFor="funderAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">סכום מימון</label>
                            <input
                                type="number"
                                id="funderAmount"
                                name="funderAmount"
                                value={paymentData.funderAmount || ''}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, funderAmount: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">ביטול</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    {isEditMode ? 'עדכן תשלום' : 'הוסף תשלום'}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;
