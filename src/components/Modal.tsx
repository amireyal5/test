import React, { useEffect, useRef } from 'react';
import { XIcon } from './icons';

type ModalProps = {
    children?: React.ReactNode;
    onClose: () => void;
    title: string;
    size?: 'md' | 'lg' | 'xl' | '2xl';
};

const Modal = ({ children, onClose, title, size = 'md' }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const sizeClasses: { [key: string]: string } = {
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        
        // Focus the modal on open for accessibility
        modalRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
            onClick={onClose} 
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                ref={modalRef}
                tabIndex={-1}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full focus:outline-none ${sizeClasses[size]}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 id="modal-title" className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="סגור חלון"
                    >
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;