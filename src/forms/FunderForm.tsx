import React, { useState, useEffect } from 'react';
import { Funder } from '../types';

type FunderFormProps = {
    onSubmit: (funder: Funder) => Promise<void>;
    onCancel: () => void;
    initialData?: Funder;
};

const FunderForm: React.FC<FunderFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const isEditMode = Boolean(initialData);
    const [funder, setFunder] = useState<Partial<Funder>>(initialData || {
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        billingDetails: '',
    });

    useEffect(() => {
        if (initialData) {
            setFunder(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFunder(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!funder.name) {
            alert('אנא מלא את שם הגורם המממן.');
            return;
        }
        await onSubmit(funder as Funder);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שם הגורם המממן *</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={funder.name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">איש קשר</label>
                <input
                    type="text"
                    name="contactPerson"
                    id="contactPerson"
                    value={funder.contactPerson || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">טלפון</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={funder.phone || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">אימייל</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={funder.email || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>
             <div>
                <label htmlFor="billingDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">פרטי חיוב</label>
                <textarea
                    name="billingDetails"
                    id="billingDetails"
                    rows={3}
                    value={funder.billingDetails || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">ביטול</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    {isEditMode ? 'עדכן גורם מממן' : 'הוסף גורם מממן'}
                </button>
            </div>
        </form>
    );
};

export default FunderForm;
