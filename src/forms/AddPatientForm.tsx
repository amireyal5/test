

import React, { useState, useEffect } from 'react';
import { Patient } from '../types';

type PatientFormProps = {
    onSubmit: (patient: Patient) => Promise<void>;
    onCancel: () => void;
    initialData?: Patient;
};

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const isEditMode = Boolean(initialData);

    const [patient, setPatient] = useState<Partial<Patient>>(() => {
        const defaultData: Partial<Patient> = {
            name: '',
            phone: '',
            email: '',
            address: '',
            status: 'Active',
            birthDate: undefined,
        };
        if (initialData) {
            return {
                ...defaultData,
                ...initialData,
                birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : undefined,
            };
        }
        return defaultData;
    });

    useEffect(() => {
        if (initialData) {
             setPatient(prev => ({
                ...prev,
                ...initialData,
                birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : undefined,
            }));
        }
    }, [initialData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'status') {
            setPatient(prev => ({ ...prev, status: value as Patient['status'] }));
        } else {
            setPatient(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!patient.name || !patient.phone || !patient.email || !patient.status) {
            alert('אנא מלא את כל השדות הנדרשים: שם, טלפון, אימייל וסטטוס.');
            return;
        }

        const patientToSubmit: Patient = {
            id: patient.id,
            name: patient.name,
            phone: patient.phone,
            email: patient.email,
            status: patient.status,
            address: patient.address,
            ...(patient.birthDate && { birthDate: patient.birthDate }),
        } as Patient;

        await onSubmit(patientToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שם מלא *</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={patient.name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מספר טלפון *</label>
                <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={patient.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">אימייל *</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={patient.email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

             <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">כתובת (לקבלה)</label>
                <textarea
                    name="address"
                    id="address"
                    value={patient.address || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תאריך לידה (אופציונלי)</label>
                <input
                    type="date"
                    name="birthDate"
                    id="birthDate"
                    value={patient.birthDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">סטטוס *</label>
                <select
                    name="status"
                    id="status"
                    required
                    value={patient.status || 'Active'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="Active">פעיל</option>
                    <option value="Inactive">לא פעיל</option>
                </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">ביטול</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    {isEditMode ? 'עדכן מטופל' : 'הוסף מטופל'}
                </button>
            </div>
        </form>
    );
};

export default PatientForm;