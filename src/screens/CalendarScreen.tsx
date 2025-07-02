'use client';
import React, { useState, useMemo } from 'react';
import { Appointment, ModalConfig, AppointmentType, SessionNote } from '../types';
import {
    format, addMonths, endOfMonth, endOfWeek, eachDayOfInterval,
    isSameMonth, isToday, isSameDay, addDays, addWeeks,
    subMonths,
    startOfMonth,
    startOfWeek,
    subDays,
    subWeeks,
    isPast,
} from 'date-fns';
import { he } from 'date-fns/locale/he';
import { PlusIcon, FilterIcon } from '../components/icons';
import { AlertCircle } from 'lucide-react';
import { usePersistentState } from '../hooks/usePersistentState';

type CalendarScreenProps = {
    appointments: Appointment[];
    appointmentTypes: AppointmentType[];
    sessionNotes: SessionNote[];
    onOpenModal: (config: ModalConfig) => void;
};

type ViewMode = 'month' | 'week' | 'day';

const CalendarScreen = ({ appointments: allAppointments, appointmentTypes, sessionNotes, onOpenModal }: CalendarScreenProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = usePersistentState<ViewMode>('calendarView', 'day');
    const [typeFilter, setTypeFilter] = useState('all');

    const appointmentTypeOptions = useMemo(() => ['all', ...appointmentTypes.map(t => t.name)], [appointmentTypes]);

    const appointments = useMemo(() => {
        if (typeFilter === 'all') return allAppointments;
        return allAppointments.filter(a => a.type === typeFilter);
    }, [allAppointments, typeFilter]);
    
    const isAppointmentUndocumented = (appointmentId?: string) => {
        if (!appointmentId) return false;
        return !sessionNotes.some(note => note.appointmentId === appointmentId);
    };

    const next = () => {
        if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
        else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 1));
    };
    const prev = () => {
        if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
        else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
        else setCurrentDate(subDays(currentDate, 1));
    };
    const goToToday = () => setCurrentDate(new Date());

    const renderHeader = () => {
        let title = '';
        if (viewMode === 'month') title = format(currentDate, 'LLLL yyyy', { locale: he });
        else if (viewMode === 'day') title = format(currentDate, 'eeee, d LLLL yyyy', { locale: he });
        else {
            const weekStart = startOfWeek(currentDate, { locale: he });
            const weekEnd = endOfWeek(currentDate, { locale: he });
            title = `${format(weekStart, 'd LLL', { locale: he })} - ${format(weekEnd, 'd LLL yyyy', { locale: he })}`;
        }

        return (
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white text-center md:text-right">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={prev} className="px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">&lt; הקודם</button>
                        <button onClick={goToToday} className="px-3 py-1.5 rounded-md border dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">היום</button>
                        <button onClick={next} className="px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">הבא &gt;</button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-500" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full sm:w-40 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-sm"
                        >
                            {appointmentTypeOptions.map(type => (
                                <option key={type} value={type}>{type === 'all' ? 'כל סוגי הפגישות' : type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                        {(['month', 'week', 'day'] as ViewMode[]).map(view => (
                            <button key={view} onClick={() => setViewMode(view)} className={`px-3 py-1 text-sm font-semibold rounded-md ${viewMode === view ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}>
                                {{month: 'חודש', week: 'שבוע', day: 'יום'}[view]}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => onOpenModal({ type: 'addAppointment'})}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    >
                        <PlusIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">פגישה חדשה</span>
                    </button>
                </div>
            </header>
        );
    };

    const renderAppointmentBadges = (appt: Appointment) => (
        <div className="absolute top-1 left-1 flex gap-1">
            {appt.paymentStatus === 'Unpaid' && <div className="w-2 h-2 bg-red-500 rounded-full" title="לא שולם"></div>}
            {isPast(new Date(appt.date)) && isAppointmentUndocumented(appt.id) && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full" title="לא תועד"></div>
            )}
        </div>
    );

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startDate = startOfWeek(monthStart, { locale: he });
        const endDate = endOfWeek(monthEnd, { locale: he });
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

        const appointmentsByDay = (day: Date) => appointments.filter(appt => appt.date && isSameDay(new Date(appt.date), day));

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-7 text-center font-semibold text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                    {dayNames.map(day => <div key={day} className="py-3">{day}</div>)}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((day, i) => {
                        const dailyAppointments = appointmentsByDay(day);
                        return (
                            <div key={i} className={`h-36 border-b border-l dark:border-gray-700 p-2 flex flex-col relative ${isSameMonth(day, currentDate) ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50'}`}>
                                <span className={`font-medium mb-1 ${isToday(day) ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>{format(day, 'd')}</span>
                                <div className="overflow-y-auto text-xs space-y-1">
                                    {dailyAppointments.map(appt => (
                                        <div
                                            key={appt.id}
                                            className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 relative cursor-pointer"
                                            onClick={() => onOpenModal({ type: 'editAppointment', data: { item: appt }})}
                                        >
                                            {renderAppointmentBadges(appt)}
                                            <p className="font-semibold truncate">{appt.patientName}</p>
                                            <p>{appt.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const weekStart = startOfWeek(currentDate, { locale: he });
        const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
        const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
                {days.map((day, i) => {
                    const dailyAppointments = appointments.filter(appt => appt.date && isSameDay(new Date(appt.date), day)).sort((a,b) => a.time.localeCompare(b.time));
                    return (
                        <div key={i} className="flex flex-col">
                            <div className={`text-center py-2 border-b dark:border-gray-700 ${isToday(day) ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}>
                                <p className="font-semibold text-sm">{dayNames[i]}</p>
                                <p className={`text-xl font-bold ${isToday(day) ? 'text-blue-600 dark:text-blue-300' : ''}`}>{format(day, 'd')}</p>
                            </div>
                            <div className="p-2 space-y-2 flex-grow min-h-[60vh]">
                                {dailyAppointments.map(appt => (
                                    <div
                                        key={appt.id}
                                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs relative cursor-pointer"
                                        onClick={() => onOpenModal({ type: 'editAppointment', data: { item: appt }})}
                                    >
                                        {renderAppointmentBadges(appt)}
                                        <p className="font-bold">{appt.time}</p>
                                        <p className="font-semibold truncate">{appt.patientName}</p>
                                        <p className="truncate">{appt.type}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDayView = () => {
        const dailyAppointments = appointments.filter(appt => appt.date && isSameDay(new Date(appt.date), currentDate));
        const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
        const slotHeight = 60;

        const timeToPosition = (time: string) => {
            const [hour, minute] = time.split(':').map(Number);
            return (hour - 7 + minute / 60) * slotHeight;
        };

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex" style={{ minHeight: '80vh' }}>
                <div className="w-16 text-center text-sm text-gray-500 dark:text-gray-400 border-l dark:border-gray-700">
                    {hours.map(hour => (
                        <div key={hour} className="h-15 flex items-start justify-center pt-1 relative">
                            <span className="relative -top-2">{`${String(hour).padStart(2, '0')}:00`}</span>
                        </div>
                    ))}
                </div>
                <div className="flex-1 relative">
                    {hours.map(hour => (
                        <div key={`line-${hour}`} className="h-15 border-b dark:border-gray-700">
                            <div className="h-full border-b border-dashed dark:border-gray-700/50 w-full" style={{ marginTop: `${slotHeight/2}px`}}></div>
                        </div>
                    ))}
                    {dailyAppointments.map(appt => {
                        const top = timeToPosition(appt.time);
                        const height = (appt.duration / 60) * slotHeight;
                        return (
                            <div
                                key={appt.id}
                                className="absolute right-2 left-2 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/70 border-r-4 border-blue-500 text-blue-800 dark:text-blue-200 text-xs shadow-lg z-10 cursor-pointer"
                                style={{ top: `${top}px`, height: `${height}px` }}
                                onClick={() => onOpenModal({ type: 'editAppointment', data: { item: appt }})}
                            >
                                <p className="font-bold">{appt.time}</p>
                                <p className="font-semibold truncate">{appt.patientName}</p>
                                <p className="truncate">{appt.type}</p>
                                <div className="absolute top-1.5 left-1.5 flex gap-1">
                                    {appt.paymentStatus === 'Unpaid' && <div className="w-2 h-2 bg-red-500 rounded-full" title="לא שולם"></div>}
                                    {isPast(new Date(appt.date)) && isAppointmentUndocumented(appt.id) && (
                                        <div title="לא תועד"><AlertCircle className="w-4 h-4 text-yellow-500" /></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div dir="rtl">
            {renderHeader()}
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
        </div>
    );
};

export default CalendarScreen;