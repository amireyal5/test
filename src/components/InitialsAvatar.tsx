import React from 'react';

const getInitials = (name: string = ''): string => {
    if (!name) return '?';
    let processedName = name.trim();

    // Handle email addresses
    if (processedName.includes('@')) {
        processedName = processedName.split('@')[0];
    }
    // Replace common separators with a space
    processedName = processedName.replace(/[._-]/g, ' ');

    const parts = processedName.split(' ').filter(Boolean); // Filter out empty strings

    if (parts.length === 0) return '?';

    if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    
    if (parts[0].length > 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return parts[0].toUpperCase();
};


const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const getColor = (name: string): string => {
    if (!name) return 'bg-gray-500';
    const hash = hashString(name);
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

type InitialsAvatarProps = {
    name: string;
    className?: string;
};

const InitialsAvatar = ({ name, className = "w-10 h-10 text-base" }: InitialsAvatarProps) => {
    const initials = getInitials(name);
    const color = getColor(name);

    return (
        <div className={`flex items-center justify-center rounded-full text-white font-bold shrink-0 ${color} ${className}`}>
            <span>{initials}</span>
        </div>
    );
};

export default InitialsAvatar;
