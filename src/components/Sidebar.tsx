import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/firebase/config';
import { GridIcon, UsersIcon, CalendarIcon, WalletIcon, Cog8ToothIcon, SparklesIcon, BellIcon, LogOutIcon, StethoscopeIcon } from './icons';
import InitialsAvatar from './InitialsAvatar';
import { ClinicProfile, ModalConfig } from '@/types';

type SidebarProps = {
    currentScreen: string;
    setScreen: (screen: string) => void;
    clinicProfile: ClinicProfile | null;
    totalAlerts: number;
    onOpenModal: (config: ModalConfig) => void;
};

const Sidebar = ({ currentScreen, setScreen, clinicProfile, totalAlerts, onOpenModal }: SidebarProps) => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'לוח מחוונים', icon: GridIcon },
    { id: 'patients', label: 'מטופלים', icon: UsersIcon },
    { id: 'calendar', label: 'יומן פגישות', icon: CalendarIcon },
    { id: 'finances', label: 'כספים', icon: WalletIcon },
    { id: 'settings', label: 'הגדרות', icon: Cog8ToothIcon },
  ];
  
  const therapistName = clinicProfile?.therapistName || user?.email?.split('@')[0] || "מטפל";

  return (
    <div dir="rtl" className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      <div className="px-6 h-20 flex items-center shrink-0">
        {clinicProfile?.logoUrl ? (
          <img src={clinicProfile.logoUrl} alt="Clinic Logo" className="w-10 h-10 object-contain" />
        ) : (
          <StethoscopeIcon className="w-9 h-9 text-blue-600 dark:text-blue-500" />
        )}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mr-2">{clinicProfile?.clinicName || "SmartClinic"}</h1>
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-4 overflow-y-auto">
        <nav className="flex-1 px-4 space-y-1">
            <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase">ניווט ראשי</p>
            {navItems.map(item => (
                <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); setScreen(item.id); }}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentScreen === item.id 
                        ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`
                    }
                >
                    <item.icon className="w-5 h-5" />
                    <span className="mr-3">{item.label}</span>
                </a>
            ))}
            
            <p className="px-4 pt-8 pb-2 text-xs font-semibold text-gray-400 uppercase">כלים חכמים</p>
             <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal({ type: 'aiAssistant' }); }}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <SparklesIcon className="w-5 h-5 text-green-500" />
                <span className="mr-3">עוזר AI</span>
                <span className="mr-auto text-xs font-bold text-white bg-green-500 rounded-full px-2 py-0.5">חדש</span>
            </a>
            <a href="#" onClick={(e) => {e.preventDefault(); setScreen('dashboard');}}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <BellIcon className="w-5 h-5" />
                <span className="mr-3">התראות פעילות</span>
                {totalAlerts > 0 && <span className="mr-auto text-xs font-semibold text-white bg-red-500 flex items-center justify-center rounded-full w-5 h-5">{totalAlerts}</span>}
            </a>
        </nav>

        <div className="px-4 py-2 mt-4 shrink-0">
          <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer relative" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="flex items-center">
                {clinicProfile?.userImageUrl ? (
                    <img src={clinicProfile.userImageUrl} alt={therapistName} className="w-10 h-10 rounded-full object-cover"/>
                ) : (
                    <InitialsAvatar name={therapistName} />
                )}
                <div className="mr-3 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{therapistName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">מטפל מוסמך</p>
                </div>
            </div>
             {isMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5" onMouseLeave={() => setIsMenuOpen(false)}>
                    <button onClick={handleLogout} className="w-full text-right flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                      <LogOutIcon className="w-4 h-4"/>
                      <span>התנתק</span>
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
