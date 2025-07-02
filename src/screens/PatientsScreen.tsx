import React from 'react';
import { Patient, ModalConfig } from '../types';
import { PlusIcon, MagnifyingGlassIcon, FilterIcon, UsersIcon, PhoneIcon, EnvelopeIcon, EyeIcon, UserCircleIcon, UserPlusIcon } from '../components/icons';
import { PatientCardSkeleton } from '../components/Skeletons';
import { differenceInYears } from 'date-fns';

type PatientsScreenProps = {
    patients: Patient[];
    onViewDetails: (id: string | undefined) => void; 
    onOpenModal: (config: ModalConfig) => void;
    onDeletePatient: (patient: Patient) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    allPatients: Patient[];
    isLoading: boolean;
};

// ממשק עבור ה-props של רכיב EmptyState
interface EmptyStateProps {
    onActionClick: (config: ModalConfig) => void;
}

// רכיב EmptyState
const EmptyState: React.FC<EmptyStateProps> = ({ onActionClick }) => (
    <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">לא נמצאו מטופלים</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">לא נמצאו מטופלים התואמים את החיפוש שלך.</p>
        <div className="mt-6">
            <button
                type="button"
                onClick={() => onActionClick({ type: 'addPatient'})}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                הוסף מטופל חדש
            </button>
        </div>
    </div>
);

// ממשק עבור ה-props של רכיב PatientCard
interface PatientCardProps {
    patient: Patient;
    onViewDetails: (id: string | undefined) => void;
}

// רכיב PatientCard
const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewDetails }) => {
    const age = patient.birthDate ? differenceInYears(new Date(), new Date(patient.birthDate)) : 'N/A';

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col justify-between">
            <div>
                <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                        <UserCircleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="mr-3">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{patient.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {patient.status === 'Active' ? 'פעיל' : 'לא פעיל'}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span>{patient.phone || 'לא צוין'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span>{patient.email || 'לא צוין'}</span>
                    </div>
                    <div className="flex items-center">
                        <span>גיל: {age} שנים</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onViewDetails(patient.id)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
            >
                <EyeIcon className="w-5 h-5" />
                <span>צפה בתיק המטופל</span>
            </button>
        </div>
    );
};

const PatientsScreen: React.FC<PatientsScreenProps> = ({ patients, onViewDetails, onOpenModal, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isLoading }) => {

    return (
        <div dir="rtl" className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">ניהול מטופלים</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">רשימת כל המטופלים שלך</p>
                </div>
                <button
                    onClick={() => onOpenModal({ type: 'addPatient'})}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>הוסף מטופל חדש</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="חפש לפי שם, טלפון או אימייל..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    >
                        <option value="all">כל הסטטוסים</option>
                        <option value="Active">פעיל</option>
                        <option value="Inactive">לא פעיל</option>
                    </select>
                </div>
            </div>

            {/* Patient Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => <PatientCardSkeleton key={index} />)
                ) : patients.length > 0 ? (
                    patients.map(patient => (
                        <PatientCard key={patient.id || patient.phone} patient={patient} onViewDetails={onViewDetails} />
                    ))
                ) : (
                    <EmptyState onActionClick={onOpenModal} />
                )}
            </div>
        </div>
    );
};

export default PatientsScreen;