"use client";

import React from 'react';
import { Payment, Patient, ModalConfig, Funder, ClinicProfile } from '../types';
import { PencilIcon, TrashIcon, PrinterIcon } from './icons';

type PaymentsListProps = {
    payments: Payment[];
    patient: Patient;
    funders: Funder[];
    clinicProfile: ClinicProfile | null;
    onOpenModal: (config: ModalConfig) => void;
};

const PaymentsList: React.FC<PaymentsListProps> = ({ payments, patient, funders, clinicProfile, onOpenModal }) => {

    const getFunderInfo = (payment: Payment) => {
        if (!payment.funderId) return '-';
        const funder = funders.find(f => f.id === payment.funderId);
        if (!funder) return 'גורם לא ידוע';
        return `${funder.name} (₪${payment.funderAmount?.toFixed(2) || 0})`;
    };

    const handleOpenReceipt = (payment: Payment) => {
        if (patient && clinicProfile) {
            onOpenModal({
                type: 'viewReceipt',
                data: { item: { ...payment, patient, clinicProfile } }
            });
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">תשלומים</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                        <tr>
                            <th className="py-3 pr-4 font-semibold">תאריך</th>
                            <th className="py-3 px-2 font-semibold">סכום</th>
                            <th className="py-3 px-2 font-semibold">אמצעי</th>
                            <th className="py-3 px-2 font-semibold">הערות</th>
                            <th className="py-3 px-2 font-semibold">גורם מממן</th>
                            <th className="py-3 pl-4 font-semibold text-left">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {payments.length > 0 ? (
                            payments.map(payment => (
                                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                                    <td className="py-3 pr-4 text-gray-800 dark:text-gray-200">{new Date(payment.date).toLocaleDateString('he-IL')}</td>
                                    <td className="py-3 px-2 font-semibold text-green-600">₪{payment.amount.toFixed(2)}</td>
                                    <td className="py-3 px-2">{payment.method}</td>
                                    <td className="py-3 px-2 text-gray-500 truncate" title={payment.notes}>{payment.notes || '-'}</td>
                                    <td className="py-3 px-2 text-gray-500">{getFunderInfo(payment)}</td>
                                    <td className="py-3 pl-4 text-left">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onOpenModal({ type: 'editPayment', data: { item: payment } })}
                                                className="text-gray-400 hover:text-blue-500"
                                                aria-label="ערוך תשלום"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onOpenModal({ type: 'confirmDeletePayment', data: { item: payment }})}
                                                className="text-gray-400 hover:text-red-500"
                                                aria-label="מחק תשלום"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenReceipt(payment)}
                                                className="text-gray-400 hover:text-green-500"
                                                aria-label="הפק קבלה"
                                            >
                                                <PrinterIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    אין היסטוריית תשלומים עבור מטופל זה.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsList;