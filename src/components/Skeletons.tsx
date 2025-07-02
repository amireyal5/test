import React from 'react';
import { UserCircleIcon, EyeIcon } from './icons';

export const StatCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-start justify-between">
            <div>
                <div className="h-4 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
                <div className="h-8 bg-gray-300 rounded w-32 mt-2 dark:bg-gray-600"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
    </div>
);

export const AlertCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded w-1/2 dark:bg-gray-600"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-2 dark:bg-gray-700"></div>
            </div>
        </div>
        <div className="space-y-3">
            <div className="h-10 bg-gray-100 rounded-md dark:bg-gray-700/50"></div>
            <div className="h-10 bg-gray-100 rounded-md dark:bg-gray-700/50"></div>
        </div>
    </div>
);


export const PatientCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col justify-between animate-pulse">
        <div>
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="mr-3 flex-1">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                </div>
            </div>
            <div className="space-y-3 text-sm">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
        <div className="mt-6 w-full h-11 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
    </div>
);
