"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { StethoscopeIcon } from '@/components/icons';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await auth.signInWithEmailAndPassword(email, password);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('אימייל או סיסמה לא נכונים.');
            } else {
                setError('אירעה שגיאה. נסה שוב מאוחר יותר.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || (!loading && user)) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }
    
    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="text-center flex flex-col items-center">
                    <div className="flex items-center justify-center">
                        <StethoscopeIcon className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mr-2">SmartClinic</h1>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">התחבר לחשבון המטפל שלך</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            כתובת אימייל
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            סיסמה
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:focus:ring-offset-gray-900"
                        >
                            {isSubmitting ? 'מתחבר...' : 'התחבר'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;