import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ClinicProfile, AppointmentType, ModalConfig, Funder } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, BuildingOfficeIcon, PhoneIcon, EnvelopeIcon } from '../components/icons';
import { UploadCloud } from 'lucide-react';
import Modal from '../components/Modal';
import InitialsAvatar from '../components/InitialsAvatar';

type SettingsScreenProps = {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    clinicProfile: ClinicProfile | null;
    appointmentTypes: AppointmentType[];
    funders: Funder[];
    onSaveProfile: (profile: ClinicProfile) => void;
    onAddAppointmentType: (name: string) => void;
    onUpdateAppointmentType: (id: string, name: string) => void;
    onDeleteAppointmentType: (id: string) => void;
    onOpenModal: (config: ModalConfig) => void;
}

const ClinicProfileForm: React.FC<{
    initialProfile: ClinicProfile | null;
    onSave: (profile: ClinicProfile) => void;
    onShowAlert: (message: string) => void;
}> = ({ initialProfile, onSave, onShowAlert }) => {
    const [profile, setProfile] = useState<ClinicProfile>({
        clinicName: '', therapistName: '', licenseNumber: '', address: '', phone: '', email: '', logoUrl: '', userImageUrl: ''
    });
    const [isUploading, setIsUploading] = useState<'logo' | 'userImage' | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const userImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialProfile) {
            setProfile(initialProfile);
        }
    }, [initialProfile]);

    const handleCloudinaryUpload = async (file: File, folder: string): Promise<string> => {
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
            throw new Error("Cloudinary environment variables not set.");
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", folder);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!res.ok || !data.secure_url) {
            throw new Error(data.error?.message || "Error uploading to Cloudinary");
        }
        return data.secure_url;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'userImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(type);
        try {
            const folder = type === 'logo' ? 'logos' : 'userImages';
            const url = await handleCloudinaryUpload(file, folder);
            
            setProfile(prev => ({ 
                ...prev, 
                [type === 'logo' ? 'logoUrl' : 'userImageUrl']: url 
            }));

        } catch (error) {
            console.error(error);
            onShowAlert("אירעה שגיאה בהעלאת התמונה.");
        } finally {
            setIsUploading(null);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(profile);
        onShowAlert("פרטי הקליניקה עודכנו בהצלחה!");
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">לוגו קליניקה</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                           {profile.logoUrl ? <img src={profile.logoUrl} alt="Logo Preview" className="w-full h-full object-contain"/> : <BuildingOfficeIcon className="w-10 h-10 text-gray-400"/>}
                        </div>
                        <button type="button" onClick={() => logoInputRef.current?.click()} disabled={!!isUploading} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 disabled:opacity-50">
                           <UploadCloud className="w-4 h-4"/>
                           {isUploading === 'logo' ? 'מעלה...' : 'שנה לוגו'}
                        </button>
                        <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} disabled={!!isUploading}/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">תמונת מטפל</label>
                     <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                           {profile.userImageUrl ? <img src={profile.userImageUrl} alt="User Preview" className="w-full h-full object-cover"/> : <InitialsAvatar name={profile.therapistName} className="w-20 h-20 text-3xl"/>}
                        </div>
                        <button type="button" onClick={() => userImageInputRef.current?.click()} disabled={!!isUploading} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 disabled:opacity-50">
                           <UploadCloud className="w-4 h-4"/>
                           {isUploading === 'userImage' ? 'מעלה...' : 'שנה תמונה'}
                        </button>
                        <input type="file" ref={userImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'userImage')} disabled={!!isUploading}/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שם הקליניקה</label>
                    <input type="text" id="clinicName" value={profile.clinicName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                    <label htmlFor="therapistName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שם המטפל</label>
                    <input type="text" id="therapistName" value={profile.therapistName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
            </div>
            <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">מספר עוסק/רישיון</label>
                <input type="text" id="licenseNumber" value={profile.licenseNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">כתובת</label>
                <textarea id="address" value={profile.address} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">טלפון</label>
                    <input type="tel" id="phone" value={profile.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">אימייל</label>
                    <input type="email" id="email" value={profile.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
            </div>
            <div className="pt-4 flex justify-end">
                <button type="submit" disabled={!!isUploading} className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:opacity-50">שמור שינויים</button>
            </div>
        </form>
    );
};

const AppointmentTypesManager: React.FC<{
    types: AppointmentType[];
    onAdd: (name: string) => void;
    onUpdate: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onShowConfirm: (id: string, message: string, onConfirm: (id: string) => void) => void;
}> = ({ types, onAdd, onUpdate, onDelete, onShowConfirm }) => {
    const [newTypeName, setNewTypeName] = useState('');
    const [editingType, setEditingType] = useState<AppointmentType | null>(null);

    const handleAdd = () => {
        if (newTypeName.trim()) {
            onAdd(newTypeName.trim());
            setNewTypeName('');
        }
    };

    const handleUpdate = () => {
        if (editingType && editingType.id && editingType.name.trim()) {
            onUpdate(editingType.id, editingType.name.trim());
            setEditingType(null);
        }
    };

    const handleDelete = (id: string) => {
        onShowConfirm(id, 'אתה בטוח שברצונך למחוק את סוג הפגישה?', onDelete);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input type="text" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} placeholder="הוסף סוג פגישה חדש..." className="flex-grow px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700"><PlusIcon className="w-5 h-5" />הוסף</button>
            </div>
            <ul className="space-y-2">
                {types.map(type => (
                    <li key={type.id || type.name} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        {editingType?.id === type.id ? (
                            <input type="text" value={editingType?.name || ''} onChange={(e) => setEditingType(prev => (prev ? { ...prev, name: e.target.value } : null))} className="flex-grow px-2 py-1 border rounded-md dark:bg-gray-600 dark:border-gray-500" />
                        ) : (
                            <span className="text-gray-800 dark:text-gray-200">{type.name}</span>
                        )}
                        <div className="flex gap-2">
                            {editingType?.id === type.id ? (
                                <button onClick={handleUpdate} className="text-green-600 hover:text-green-800">שמור</button>
                            ) : (
                                <button onClick={() => setEditingType(type)} className="text-gray-500 hover:text-primary-600"><PencilIcon className="w-4 h-4" /></button>
                            )}
                            {type.id && <button onClick={() => handleDelete(type.id!)} className="text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
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

const FundersManager: React.FC<{ funders: Funder[], onOpenModal: (config: ModalConfig) => void }> = ({ funders, onOpenModal }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFunders = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return funders;
        return funders.filter(f =>
            f.name.toLowerCase().includes(query) ||
            (f.contactPerson && f.contactPerson.toLowerCase().includes(query))
        );
    }, [funders, searchQuery]);
    
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </span>
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="חפש לפי שם או איש קשר..." 
                        className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <button onClick={() => onOpenModal({ type: 'addFunder' })} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
                    <PlusIcon className="w-5 h-5"/>
                    <span>הוסף גורם מממן</span>
                </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFunders.length > 0 ? (
                    filteredFunders.map(funder => <FunderCard key={funder.id} funder={funder} onOpenModal={onOpenModal} />)
                ) : (
                    <div className="col-span-full text-center py-16">
                        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">לא נמצאו גורמים מממנים</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({
    theme,
    setTheme,
    clinicProfile,
    appointmentTypes,
    funders,
    onSaveProfile,
    onAddAppointmentType,
    onUpdateAppointmentType,
    onDeleteAppointmentType,
    onOpenModal,
}) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'funders'>('profile');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [confirmConfig, setConfirmConfig] = useState<{ id: string; message: string; onConfirm: (id: string) => void } | null>(null);

    const handleShowAlert = (message: string) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(null), 3000);
    };

    const handleShowConfirm = (id: string, message: string, onConfirm: (id: string) => void) => {
        setConfirmConfig({ id, message, onConfirm });
    };

    const handleConfirmAction = () => {
        if (confirmConfig) {
            confirmConfig.onConfirm(confirmConfig.id);
            setConfirmConfig(null);
        }
    };

    return (
        <div dir="rtl" className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">הגדרות המערכת</h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <nav className="-mb-px flex space-x-6" dir="rtl">
                        <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            פרופיל ומיתוג
                        </button>
                        <button onClick={() => setActiveTab('appointments')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            סוגי פגישות
                        </button>
                        <button onClick={() => setActiveTab('funders')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'funders' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            גורמים מממנים
                        </button>
                    </nav>
                </div>

                <div>
                    {activeTab === 'profile' && <ClinicProfileForm initialProfile={clinicProfile} onSave={onSaveProfile} onShowAlert={handleShowAlert} />}
                    {activeTab === 'appointments' && <AppointmentTypesManager types={appointmentTypes} onAdd={onAddAppointmentType} onUpdate={onUpdateAppointmentType} onDelete={onDeleteAppointmentType} onShowConfirm={handleShowConfirm} />}
                    {activeTab === 'funders' && <FundersManager funders={funders} onOpenModal={onOpenModal} />}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-8">
                <h3 className="text-xl font-semibold mb-4">ערכת נושא</h3>
                <div className="flex gap-4">
                    <button onClick={() => setTheme('light')} className={`px-6 py-2 rounded-md font-medium transition-colors ${theme === 'light' ? 'bg-primary-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>בהיר</button>
                    <button onClick={() => setTheme('dark')} className={`px-6 py-2 rounded-md font-medium transition-colors ${theme === 'dark' ? 'bg-primary-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>כהה</button>
                </div>
            </div>

            {alertMessage && (
                <Modal onClose={() => setAlertMessage(null)} title="הודעה">
                    <div className="p-4 text-center">
                        <p>{alertMessage}</p>
                        <button onClick={() => setAlertMessage(null)} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">אישור</button>
                    </div>
                </Modal>
            )}

            {confirmConfig && (
                <Modal onClose={() => setConfirmConfig(null)} title="אישור פעולה">
                    <div className="p-4 text-center">
                        <p className="mb-4">{confirmConfig.message}</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleConfirmAction} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">אישור</button>
                            <button onClick={() => setConfirmConfig(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">ביטול</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SettingsScreen;