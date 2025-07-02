import React, { useState } from 'react';
import { Patient, Appointment, SessionNote } from '../types';
import { DocumentTextIcon, CheckCircleIcon, LightBulbIcon, ArrowLeftIcon, ArrowRightIcon, BrainIcon } from './icons';

const AIResponseDisplay = ({ title, content, onBack, onSave }: { title: string, content: string, onBack: () => void, onSave?: () => void }) => (
    <div className="space-y-4 text-right">
        <div className="flex justify-between items-center">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium" aria-label="חזרה לבחירת פעולת AI">
                <ArrowRightIcon />
                <span>חזרה</span>
            </button>
            {onSave && (
                 <button onClick={onSave} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    שמור ביומן אישי
                </button>
            )}
        </div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h4>
        <div 
            className="text-gray-700 dark:text-gray-300 text-right space-y-2 prose prose-p:my-1 prose-ul:my-2 prose-li:my-0.5"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    </div>
);


const AIAssistant = ({ patient, patients, notes, onSaveLog }: { patient?: Patient, patients: Patient[], appointments: Appointment[], notes: SessionNote[], onSaveLog?: (log: string) => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<{title: string, content: string, actionType: string} | null>(null);
    const [error, setError] = useState('');

    const handleAction = async (actionType: 'summarize' | 'goals' | 'recommendations') => {
        setIsLoading(true);
        setResponse(null);
        setError('');

        try {
            const targetPatient = patient || (patients.length > 0 ? patients[0] : null);
            if (!targetPatient) {
                setError('לא נבחר מטופל.');
                setIsLoading(false);
                return;
            }

            const patientNotes = notes.filter(n => n.patientId === targetPatient.id);

            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actionType,
                    patient: targetPatient,
                    notes: patientNotes,
                }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'שגיאה בשרת');
            }

            setResponse({ title: data.title, content: data.content, actionType });
        } catch (e) {
            console.error("AI Assistant Error:", e);
            setError('מצטערים, אירעה שגיאה בעת התקשורת עם עוזר ה-AI. אנא נסה שוב מאוחר יותר.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSave = () => {
        if(response && onSaveLog && patient) {
            const logEntry = `
## ${response.title} (${new Date().toLocaleDateString('he-IL')})
${response.content.replace(/<[^>]*>/g, '\n').replace(/\n\n/g, '\n')}
---
`;
            onSaveLog(logEntry);
        }
    }


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">ה-AI חושב...</p>
            </div>
        );
    }
    
    if (error) {
         return (
             <div className="text-center p-4">
                 <p className="text-red-500">{error}</p>
                 <button onClick={() => { setError(''); setResponse(null); }} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">חזרה</button>
             </div>
         );
    }

    if (response) {
        const canSave = patient && onSaveLog && ['goals', 'recommendations'].includes(response.actionType);
        return <AIResponseDisplay title={response.title} content={response.content} onBack={() => setResponse(null)} onSave={canSave ? handleSave : undefined} />;
    }

    const titleText = patient ? `עוזר AI עבור ${patient.name}` : 'תובנות מרכזיות';
    const subTitleText = patient ? 'השתמש בנתוני המטופל לקבלת תובנות מותאמות אישית.' : 'העזר ב-AI כדי לייעל את עבודתך, לקבל תובנות ולשפר את הטיפול.';

    return (
        <div dir="rtl" className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex justify-center items-center gap-2">
                    <BrainIcon className="w-8 h-8 text-primary-500" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{titleText}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subTitleText}</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-3">
                        <DocumentTextIcon className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                        <span><strong>חסוך בזמן</strong> בעזרת כתיבת סיכום פגישה מהיר.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span><strong>העזר בסיוע של ה-AI</strong> ליצירת מטרות טיפול מותאמות אישית.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <LightBulbIcon className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        <span><strong>קבל המלצות ורעיונות</strong> לפעולה על בסיס נתוני המטופל.</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                <p className="font-semibold text-center text-gray-800 dark:text-white">בחר פעולה</p>
                <button onClick={() => handleAction('summarize')} className="w-full flex justify-between items-center p-3 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors">
                    <span className="font-semibold text-sm">כתוב סיכום טיפול</span>
                    <ArrowLeftIcon />
                </button>
                <button onClick={() => handleAction('goals')} className="w-full flex justify-between items-center p-3 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors">
                    <span className="font-semibold text-sm">הצע מטרות טיפול</span>
                    <ArrowLeftIcon />
                </button>
                 <button onClick={() => handleAction('recommendations')} className="w-full flex justify-between items-center p-3 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors">
                    <span className="font-semibold text-sm">ספק המלצות להמשך</span>
                    <ArrowLeftIcon />
                </button>
            </div>
        </div>
    );
};
export default AIAssistant;
