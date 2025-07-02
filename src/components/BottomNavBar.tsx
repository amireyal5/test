import React from 'react';
import { GridIcon, UsersIcon, CalendarIcon, WalletIcon, Cog8ToothIcon } from './icons';

const BottomNavBar = ({ currentScreen, setScreen }: { currentScreen: string, setScreen: (screen: string) => void }) => {

    const navItems = [
        { id: 'dashboard', label: 'ראשי', icon: GridIcon },
        { id: 'patients', label: 'מטופלים', icon: UsersIcon },
        { id: 'calendar', label: 'יומן', icon: CalendarIcon },
        { id: 'finances', label: 'כספים', icon: WalletIcon },
        { id: 'settings', label: 'הגדרות', icon: Cog8ToothIcon },
    ];

    return (
        <div dir="rtl" className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        type="button" 
                        onClick={() => setScreen(item.id)}
                        className={`inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                            currentScreen === item.id 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <item.icon className={`w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${currentScreen === item.id && 'text-blue-600 dark:text-blue-400'}`} />
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNavBar;