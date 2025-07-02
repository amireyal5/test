import React, { useState, useMemo } from 'react';
import { Payment, Patient, ModalConfig, Appointment, Funder, ClinicProfile } from '../types';
import { WalletIcon, CurrencyDollarIcon, DocumentTextIcon, PlusIcon, PrinterIcon, PencilIcon, TrashIcon } from '../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; }> = ({ title, value, icon: Icon, color }) => {
    const colorClasses: { [key: string]: { bg: string, text: string }} = {
        green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-500' },
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-500' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-500' },
    };
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]?.bg || ''}`}>
                <Icon className={`w-6 h-6 ${colorClasses[color]?.text || ''}`} />
            </div>
        </div>
    );
};

type FinancesScreenProps = {
    payments: Payment[];
    patients: Patient[];
    appointments: Appointment[];
    funders: Funder[];
    clinicProfile: ClinicProfile | null;
    onOpenModal: (config: ModalConfig) => void;
};

const FinancesScreen: React.FC<FinancesScreenProps> = ({ payments: allPayments, patients, appointments, funders, clinicProfile, onOpenModal }) => {
    
    const [patientFilter, setPatientFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('all');
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
    const [displayCount, setDisplayCount] = useState(10);
    
    const paymentsByDate = useMemo(() => {
        return [...allPayments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allPayments]);

    const filteredPayments = useMemo(() => {
        return paymentsByDate.filter(p => {
            if (!p.date) return false;
            const paymentDate = new Date(p.date);
            if (isNaN(paymentDate.getTime())) return false; // Filter out invalid dates
            const isPatientMatch = patientFilter === 'all' || p.patientId === patientFilter;
            const isYearMatch = yearFilter === 'all' || paymentDate.getFullYear().toString() === yearFilter;
            const isMonthMatch = monthFilter === 'all' || (paymentDate.getMonth() + 1).toString() === monthFilter;
            return isPatientMatch && isYearMatch && isMonthMatch;
        });
    }, [paymentsByDate, patientFilter, monthFilter, yearFilter]);

    const stats = useMemo(() => {
        const totalIncome = filteredPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
        const avgPayment = filteredPayments.length > 0 ? totalIncome / filteredPayments.length : 0;
        return {
            totalIncome,
            avgPayment,
            transactions: filteredPayments.length,
        };
    }, [filteredPayments]);
    
    const years = useMemo(() => {
        const paymentYears = new Set(allPayments
            .map(p => p.date ? new Date(p.date).getFullYear() : null)
            .filter((y): y is number => y !== null && !isNaN(y))
        );
        return Array.from(paymentYears).sort((a,b) => Number(b) - Number(a));
    }, [allPayments]);

    const months = [
        { value: '1', label: 'ינואר' }, { value: '2', label: 'פברואר' }, { value: '3', label: 'מרץ' },
        { value: '4', label: 'אפריל' }, { value: '5', label: 'מאי' }, { value: '6', label: 'יוני' },
        { value: '7', label: 'יולי' }, { value: '8', label: 'אוגוסט' }, { value: '9', label: 'ספטמבר' },
        { value: '10', label: 'אוקטובר' }, { value: '11', label: 'נובמבר' }, { value: '12', label: 'דצמבר' },
    ];

    const getPatientForPayment = (payment: Payment) => patients.find(p => p.id === payment.patientId);

    const handleOpenReceipt = (payment: Payment) => {
        const patientForPayment = getPatientForPayment(payment);
        if (patientForPayment && clinicProfile) {
            onOpenModal({
                type: 'viewReceipt',
                data: { item: { ...payment, patient: patientForPayment, clinicProfile } }
            });
        }
    };

    return (
        <div dir="rtl" className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">ניהול כספים</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">מעקב אחר הכנסות, תשלומים ודוחות</p>
                </div>
                <button
                    onClick={() => onOpenModal({ type: 'addPayment' })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>הוסף תשלום</span>
                </button>
            </div>

            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                 <select value={patientFilter} onChange={e => setPatientFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">כל המטופלים</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">כל החודשים</option>
                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                 <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">כל השנים</option>
                    {years.map(y => <option key={y} value={y.toString()}>{y}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                 <StatCard title="סהכ הכנסה (בסינון)" value={`₪${stats.totalIncome.toLocaleString()}`} icon={WalletIcon} color="green" />
                 <StatCard title="ערך עסקה ממוצע" value={`₪${stats.avgPayment.toFixed(0)}`} icon={CurrencyDollarIcon} color="blue" />
                 <StatCard title="סהכ עסקאות" value={stats.transactions} icon={DocumentTextIcon} color="purple" />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <h3 className="text-xl font-semibold mb-4">היסטוריית תשלומים</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                            <tr>
                                <th className="py-3 pr-4 font-semibold">תאריך</th>
                                <th className="py-3 px-2 font-semibold">מטופל</th>
                                <th className="py-3 px-2 font-semibold">סכום</th>
                                <th className="py-3 px-2 font-semibold">אמצעי</th>
                                <th className="py-3 px-2 font-semibold">הערות</th>
                                <th className="py-3 pl-4 font-semibold text-left">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {filteredPayments.slice(0, displayCount).map(payment => (
                                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                                    <td className="py-3 pr-4 text-gray-800 dark:text-gray-200">{new Date(payment.date).toLocaleDateString('he-IL')}</td>
                                    <td className="py-3 px-2 text-gray-800 dark:text-gray-200">{getPatientForPayment(payment)?.name || 'לא ידוע'}</td>
                                    <td className="py-3 px-2 font-semibold text-green-600">₪{payment.amount.toFixed(2)}</td>
                                    <td className="py-3 px-2">{payment.method}</td>
                                    <td className="py-3 px-2 text-gray-500 truncate" title={payment.notes}>{payment.notes || '-'}</td>
                                    <td className="py-3 pl-4 text-left">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onOpenModal({ type: 'editPayment', data: { item: payment } })} className="text-gray-400 hover:text-blue-500" aria-label={`ערוך תשלום`}>
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onOpenModal({ type: 'confirmDeletePayment', data: { item: payment } })} className="text-gray-400 hover:text-red-500" aria-label={`מחק תשלום`}>
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleOpenReceipt(payment)} className="text-gray-400 hover:text-green-500" aria-label={`הצג קבלה`}>
                                                <PrinterIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredPayments.length === 0 && (
                         <div className="text-center py-8 text-gray-500">
                            לא נמצאו תשלומים התואמים לסינון.
                        </div>
                    )}
                </div>
                {displayCount < filteredPayments.length && (
                    <div className="text-center mt-6">
                        <button onClick={() => setDisplayCount(prev => prev + 10)} className="px-6 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                            טען עוד
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FinancesScreen;