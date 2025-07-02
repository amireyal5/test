import React, { useState } from 'react';
import { PlusIcon } from './icons'; // ודא ש-PlusIcon מיובא נכון
import { ModalConfig } from '../types'; // ודא ש-ModalConfig מיובא נכון

type FloatingActionButtonProps = {
    onOpenModal: (config: ModalConfig) => void;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onOpenModal }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (type: ModalConfig['type']) => {
        onOpenModal({ type });
        setIsOpen(false); // סגור את התפריט לאחר בחירה
    };

    return (
        <div className="relative">
            {/* כפתור ה-FAB הראשי */}
            <button
                onClick={handleButtonClick}
                className="relative z-20 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                aria-label="הוסף פריט חדש"
            >
                <PlusIcon className={`w-7 h-7 transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
            </button>

            {/* תפריט האפשרויות */}
            {isOpen && (
                <div className="absolute top-full mt-4 left-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10 origin-top-left animate-fade-in-down">
                    <ul className="py-2">
                        <li>
                            <button
                                onClick={() => handleOptionClick('addPatient')}
                                className="block w-full text-right px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                הוספת מטופל/ת
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleOptionClick('addAppointment')}
                                className="block w-full text-right px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                הוספת פגישה
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleOptionClick('addPayment')}
                                className="block w-full text-right px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                הוספת תשלום
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleOptionClick('addNote')}
                                className="block w-full text-right px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                הוספת תיעוד פגישה
                            </button>
                        </li>
                        {/* הוסף אפשרויות נוספות כאן לפי הצורך, לדוגמה "הוספת מסמך" */}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FloatingActionButton;