// src/screens/DashboardScreen.tsx
'use client';

import React, { useMemo } from 'react';
import { Appointment, Patient, Payment, SessionNote, ModalConfig } from '../types';
import {
  Wallet, Calendar, Users, AlertTriangle, Eye, Bell, UserPlus,
} from 'lucide-react'; 
import { StatCardSkeleton, AlertCardSkeleton } from '../components/Skeletons'; 
import { differenceInDays, differenceInMonths, parseISO, isSameDay, isSameMonth, isSameYear } from 'date-fns';

// מפת צבעים
const colorMap = {
  red: {
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-500'
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/50',
    text: 'text-yellow-500'
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-500'
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/50',
    text: 'text-indigo-500'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-500'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-500'
  },
};

// ממשק עבור ה-props של רכיב StatCard
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string; // אופציונלי
  icon: React.ElementType; // טיפוס עבור רכיב אייקון (כמו UsersIcon)
  color: keyof typeof colorMap; // מגביל את הצבעים למפת הצבעים
  onClick?: () => void; // אופציונלי
}

// רכיב StatCard
const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex items-start justify-between ${onClick ? 'cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all' : ''}`}>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
      {change && (
        <p className={`text-xs mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{change}</p>
      )}
    </div>
    <div className={`p-3 rounded-full ${colorMap[color].bg}`}>
      <Icon className={`w-6 h-6 ${colorMap[color].text}`} />
    </div>
  </div>
);

// ממשק עבור פריטים בתוך AlertCard
interface AlertItem {
  id?: string; // יכול להיות אופציונלי
  patientId?: string; // יכול להיות אופציונלי
  primaryText: string;
  secondaryText: string;
}

// ממשק עבור ה-props של רכיב AlertCard
interface AlertCardProps {
  title: string;
  description: (count: number) => string;
  icon: React.ElementType;
  color: keyof typeof colorMap; // מגביל את הצבעים למפת הצבעים
  items: AlertItem[];
  onViewDetails: (patientId: string | undefined) => void;
}

// רכיב AlertCard
const AlertCard: React.FC<AlertCardProps> = ({ title, description, icon: Icon, color, items, onViewDetails }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${colorMap[color].bg} rounded-full`}>
          <Icon className={`w-6 h-6 ${colorMap[color].text}`} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description(items.length)}</p>
        </div>
      </div>
      <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
        {items.map(item => (
          <li key={item.id || item.primaryText} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div>
              <p className="font-semibold">{item.primaryText}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.secondaryText}</p>
            </div>
            <button
              onClick={() => onViewDetails(item.patientId)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
              aria-label={`צפה בתיק של ${item.primaryText}`}
            >
              <Eye className="w-4 h-4" />
              <span>צפה בתיק</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ממשק עבור ה-props של רכיב DashboardScreen
interface DashboardScreenProps {
  appointments: Appointment[];
  patients: Patient[];
  payments: Payment[];
  sessionNotes: SessionNote[];
  onOpenModal: (config: ModalConfig) => void;
  onViewDetails: (patientId: string | undefined) => void;
  navigateTo: (screen: string, subScreen?: string) => void;
  isLoading: boolean;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ appointments, patients, payments, onOpenModal, onViewDetails, navigateTo, isLoading }) => {
  const today = new Date();
  
  const monthlyIncome = useMemo(() => {
    return payments
      .filter(p => p.date && isSameMonth(parseISO(p.date), today) && isSameYear(parseISO(p.date), today))
      .reduce((acc, p) => acc + (p.amount || 0), 0);
  }, [payments, today]);

  const todaysAppointments = appointments.filter(a => a.date && isSameDay(parseISO(a.date), today)).length;
  const activePatients = patients.filter(p => p.status === 'Active').length;

  const stats = [
    { title: 'הכנסה חודשית', value: `₪${monthlyIncome.toLocaleString()}`, icon: Wallet, color: 'purple' as keyof typeof colorMap, onClick: () => navigateTo('finances') },
    { title: 'פגישות היום', value: todaysAppointments, icon: Calendar, color: 'green' as keyof typeof colorMap, onClick: () => navigateTo('calendar', 'day') },
    { title: 'מטופלים פעילים', value: activePatients, icon: Users, color: 'blue' as keyof typeof colorMap, onClick: () => navigateTo('patients') },
  ];

  type TempBirthdayItem = AlertItem & { daysUntilBirthday: number };

  const upcomingBirthdays = patients
    .map(p => {
      if (!p.birthDate) return null;
      const birthDate = new Date(p.birthDate);
      const currentYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      let daysUntilBirthday = differenceInDays(currentYearBirthday, today);

      if (daysUntilBirthday < 0) {
        daysUntilBirthday = differenceInDays(new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate()), today);
      }

      return {
        id: p.id,
        patientId: p.id,
        primaryText: p.name,
        secondaryText: `יום הולדת בעוד ${daysUntilBirthday} ימים`,
        daysUntilBirthday: daysUntilBirthday
      } as TempBirthdayItem;
    })
    .filter((item: TempBirthdayItem | null): item is TempBirthdayItem =>
        item !== null && item.daysUntilBirthday >= 0 && item.daysUntilBirthday <= 30
    )
    .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday)
    .map(item => { 
      const { daysUntilBirthday, ...rest } = item;
      return rest;
    });

  const unconfirmedAppointments = appointments
    .filter(a => a.confirmationStatus === 'Unconfirmed' && a.date && differenceInDays(parseISO(a.date), today) >= 0 && differenceInDays(parseISO(a.date), today) <= 7)
    .map(a => ({ id: a.id, patientId: a.patientId, primaryText: a.patientName || 'מטופל לא ידוע', secondaryText: `${a.date ? new Date(a.date).toLocaleDateString('he-IL') : 'לא צוין'} - ${a.type || 'לא צוין'}`}));

  const inactivePatients = patients.filter(p => {
      const lastAppointment = appointments
          .filter(a => a.patientId === p.id && a.date)
          .sort((a, b) => {
              const dateA = a.date ? new Date(a.date) : new Date(0);
              const dateB = b.date ? new Date(b.date) : new Date(0);
              return dateB.getTime() - dateA.getTime();
          })[0];
      if (!lastAppointment?.date) return false;
      return differenceInMonths(today, new Date(lastAppointment.date)) >= 3;
  }).map(p => ({ id: p.id, patientId: p.id, primaryText: p.name, secondaryText: "לא ביקר מעל 3 חודשים" }));


  if (isLoading) {
    return (
      <div dir="rtl">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 dark:bg-gray-700 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="space-y-6 mt-6">
          <AlertCardSkeleton />
          <AlertCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">לוח המחוונים</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">סקירה כללית של הקליניקה שלך</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="space-y-6 mt-6">
        <AlertCard
          title="תשלומים ממתינים"
          description={(count) => `נמצאו ${count} פגישות עבר שלא שולמו.`}
          icon={AlertTriangle}
          color="red"
          items={appointments.filter(a => a.paymentStatus === 'Unpaid' && a.date && new Date(a.date) < new Date()).map(a => ({ id: a.id, patientId: a.patientId, primaryText: a.patientName || 'מטופל לא ידוע', secondaryText: `${a.date ? new Date(a.date).toLocaleDateString('he-IL') : 'לא צוין'} - ${a.type || 'לא צוין'}` }))}
          onViewDetails={onViewDetails}
        />
        <AlertCard
          title="ימי הולדת קרובים"
          description={(count) => `ל-${count} מטופלים יש יום הולדת החודש.`}
          icon={Bell}
          color="yellow"
          items={upcomingBirthdays}
          onViewDetails={onViewDetails}
        />
        <AlertCard
          title="פגישות לאישור"
          description={(count) => `יש לאשר ${count} פגישות לשבוע הקרוב.`}
          icon={Calendar}
          color="blue"
          items={unconfirmedAppointments}
          onViewDetails={onViewDetails}
        />
        <AlertCard
          title="מטופלים לא פעילים"
          description={(count) => `${count} מטופלים לא ביקרו מעל 3 חודשים.`}
          icon={UserPlus}
          color="indigo"
          items={inactivePatients}
          onViewDetails={onViewDetails}
        />
      </div>
    </div>
  );
};

export default DashboardScreen;