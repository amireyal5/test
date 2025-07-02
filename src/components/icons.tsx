import React from 'react';

export const Icon = ({ path, className = "w-6 h-6" }: { path: string, className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export const GridIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />;
export const UsersIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m9 5.197a6 6 0 01-3.172-10.957M15 21a3 3 0 01-6 0m6 0a3 3 0 00-6 0" />;
export const CalendarIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
export const WalletIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M3.75 4.5a3 3 0 00-3 3v10.5a3 3 0 003 3h16.5a3 3 0 003-3V7.5a3 3 0 00-3-3H3.75zM16.5 4.5V21m-9-16.5V21" />;
export const BuildingOfficeIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M3.75 21h16.5M4.5 3.75v16.5M20.25 3.75v16.5M5.25 3.75h14.25M5.25 9h14.25M5.25 15h14.25" />;
export const Cog8ToothIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />;
export const SparklesIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 01-2.624-3.802C4.563 9.01 7.27 6.116 11.05 6.116c2.493 0 4.538 1.506 5.232 3.692a4.5 4.5 0 01-2.624 3.802L12 18l.813-2.096H9.813zM12 21a2.25 2.25 0 01-2.24-2.025L9.124 14.5h5.752l-.636 4.475A2.25 2.25 0 0112 21zM5.25 3a.75.75 0 000 1.5h.093a4.5 4.5 0 012.335 2.335.75.75 0 001.41-.353A6 6 0 003.093 3.5H3a.75.75 0 00-.75.75c0 .414.336.75.75.75h.093a4.5 4.5 0 012.335 2.335.75.75 0 001.41-.353A6 6 0 003.093 3.5H2.25A2.25 2.25 0 014.5 1.25h15A2.25 2.25 0 0121.75 3.5h-.843a6 6 0 00-5.907-3.418.75.75 0 00-.353 1.41 4.5 4.5 0 012.335 2.335h.093a.75.75 0 000-1.5h-.093a4.5 4.5 0 01-2.335-2.335.75.75 0 00-1.41.353A6 6 0 0015.843 6.5h.907a.75.75 0 000-1.5h-.907a4.5 4.5 0 01-2.335-2.335.75.75 0 00-1.41.353A6 6 0 009.25 6.5h.907a.75.75 0 000-1.5H9.25a4.5 4.5 0 01-2.335-2.335A.75.75 0 005.505 3H5.25z"/>
export const BellIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />;
export const LogOutIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" />;
export const ClockIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />;

export const StethoscopeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 4.2 2a3.5 3.5 0 0 0-3.2 4.2l2.3 5.8.8.3.8-.3 2.3-5.8A3.5 3.5 0 0 0 4.8 2.3Z"></path>
        <path d="M8 8.5a3.5 3.5 0 0 0-3.2 2.3l-1 2.5a.3.3 0 1 0 .6.2l1-2.5a2.9 2.9 0 0 1 5.2 0l1 2.5a.3.3 0 1 0 .6-.2l-1-2.5A3.5 3.5 0 0 0 8 8.5Z"></path>
        <path d="M14 3a4 4 0 0 0-4 4v13a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4h-2Zm0 1.5h2a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5h-2a2.5 2.5 0 0 1-2.5-2.5V7A2.5 2.5 0 0 1 14 4.5Z"></path>
    </svg>
);

export const ChartUpIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M3.75 19.5h16.5m-16.5-9L8.25 6l3.75 4.5 5.25-6.75L20.25 15" />;
export const AlertTriangleIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />;
export const WaveIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M3 12h3l3-9 6 18 3-9h3" />;


export const PlusIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M12 4v16m8-8H4" />;
export const XIcon = ({className = "w-6 h-6"}: { className?: string }) => <Icon className={className} path="M6 18L18 6M6 6l12 12" />;
export const PencilIcon = ({ className }: { className?: string }) => <Icon className={className} path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />;
export const TrashIcon = ({ className }: { className?: string }) => <Icon className={className} path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />;
export const PrinterIcon = ({ className }: { className?: string }) => <Icon className={className} path="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />;
export const UserPlusIcon = ({ className }: { className?: string }) => <Icon className={className} path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
export const CalendarPlusIcon = ({ className }: { className?: string }) => <Icon className={className} path="M12 9v3m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
export const ArrowRightIcon = () => <Icon path="M17 8l4 4m0 0l-4 4m4-4H3" />;
export const ArrowLeftIcon = () => <Icon className="w-5 h-5" path="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />;
export const BrainIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M9.5 12.75a.75.75 0 00-1.5 0v3c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H9.5v-2.25zM10 9a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0V9zm3.25-3.094a4.125 4.125 0 00-7.875 1.036.75.75 0 001.48.212 2.625 2.625 0 015.034-.658.75.75 0 001.36-.39zm-3.5 11.344a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM12 12.75a.75.75 0 00-.75-.75H9.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5zM15 9.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm.75-3a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5h.75zM12 3.75a8.25 8.25 0 100 16.5A8.25 8.25 0 0012 3.75zM5.106 18.894A6.75 6.75 0 1118.894 5.106 6.75 6.75 0 015.106 18.894z" />;


// Icons for search and filtering
export const MagnifyingGlassIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />;
export const FilterIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9v4.5" />;
export const UserCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />;
export const PhoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.211-.992-.58-1.352l-2.4-2.4a1.125 1.125 0 00-1.592.093l-.324.324a1.125 1.125 0 01-1.606.062a10.5 10.5 0 01-5.656-5.656a1.125 1.125 0 01.062-1.606l.324-.324a1.125 1.125 0 00.093-1.592l-2.4-2.4A2.25 2.25 0 006.75 2.25H5.25A2.25 2.25 0 003 4.5v2.25z" />;
export const EnvelopeIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />;
export const EyeIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M2.036 12.322a1.012 1.012 0 010-.639l4.25-8.5a1 1 0 011.895-.064l1.42 2.84a1 1 0 001.275.545l3.18-.8a1 1 0 011.23.23l4.25 8.5a1 1 0 01-1.895.949l-1.42-2.84a1 1 0 00-1.275-.545l-3.18.8a1 1 0 01-1.23-.23zM12 15a3 3 0 100-6 3 3 0 000 6z" />;

// Icons for AI Assistant
export const DocumentTextIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
export const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
export const LightBulbIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M12 3.375c-3.11 0-5.625 2.515-5.625 5.625 0 2.235 1.3 4.153 3.125 5.06v2.19c0 .414.336.75.75.75h3.5a.75.75 0 00.75-.75v-2.19c1.825-.907 3.125-2.825 3.125-5.06 0-3.11-2.515-5.625-5.625-5.625zM12 18.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H12z" />;

// Finance Icons
export const CurrencyDollarIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.75 11 12 11c-.75 0-1.536.21-2.121.682l-.879.659M7.5 12.75h9" />;
export const CreditCardIcon = ({ className = "w-6 h-6" }: { className?: string }) => <Icon className={className} path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m3 0l-3-3m-3.75 6.75h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25z" />;
