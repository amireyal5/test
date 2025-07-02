import React from 'react';
import { Funder, ModalConfig } from '../types';
import { PlusIcon, MagnifyingGlassIcon, BuildingOfficeIcon, PhoneIcon, EnvelopeIcon, PencilIcon, TrashIcon } from '../components/icons';
import InitialsAvatar from '../components/InitialsAvatar';

type FundersScreenProps = {
    funders: Funder[];
    onOpenModal: (config: ModalConfig) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isLoading: boolean;
};

const FunderCard: React.FC<{ funder: Funder; onOpenModal: (config: ModalConfig) => void; }> = ({ funder, onOpenModal }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col justify-between group">
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center mb-4">
                        <InitialsAvatar name={funder.name} className="w-12 h-12 text-xl" />
                        <div className="mr-3">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{funder.name}</h3>
                            {funder.contactPerson && <p className="text-sm text-gray-500 dark:text-gray-400">{funder.contactPerson}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => onOpenModal({ type: 'editFunder', data: { item: funder }})} className="text-gray-400 hover:text-blue-500" aria-label="Edit Funder">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => onOpenModal({ type: 'confirmDeleteFunder', data: { item: funder }})} className="text-gray-400 hover:text-red-500" aria-label="Delete Funder">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {funder.phone && <div className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-gray-400" /><span>{funder.phone}</span></div>}
                    {funder.email && <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-gray-400" /><span>{funder.email}</span></div>}
                </div>
            </div>
        </div>
    );
};


const FundersScreen: React.FC<FundersScreenProps> = ({ funders, onOpenModal, searchQuery, setSearchQuery, isLoading }) => {
    
    const FunderCardSkeleton = () => (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-pulse">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="mr-3 flex-1">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
    );
    
    return (
        <div dir="rtl" className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">גורמים מממנים</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">נהל את רשימת הגורמים המממנים שלך</p>
                </div>
                <button onClick={() => onOpenModal({ type: 'addFunder' })} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900">
                    <PlusIcon className="w-5 h-5"/>
                    <span>הוסף גורם מממן</span>
                </button>
            </div>
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </span>
                    <input type="text" placeholder="חפש לפי שם או איש קשר..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => <FunderCardSkeleton key={index} />)
                ) : funders.length > 0 ? (
                    funders.map(funder => <FunderCard key={funder.id} funder={funder} onOpenModal={onOpenModal} />)
                ) : (
                    <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">לא נמצאו גורמים מממנים</h3>
                        <div className="mt-6">
                            <button type="button" onClick={() => onOpenModal({ type: 'addFunder' })} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                הוסף גורם מממן
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FundersScreen;
