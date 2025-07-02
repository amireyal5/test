"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

type FileUploadProps = {
    onUploadSuccess: (url: string, fileName: string) => void;
    folder: string;
    label: string;
};

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, folder, label }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
            setError("הגדרות Cloudinary חסרות. אנא בדוק את משתני הסביבה.");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", folder);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            if (!res.ok || !data.secure_url) {
                throw new Error(data.error?.message || "שגיאה בהעלאה ל-Cloudinary");
            }

            onUploadSuccess(data.secure_url, file.name);

        } catch (err: any) {
            console.error(err);
            setError("אירעה שגיאה בהעלאת הקובץ.");
        } finally {
            setUploading(false);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div>
            <label htmlFor={`file-upload-${folder}`} className={`flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed rounded-md transition-colors ${uploading ? 'cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-700' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <UploadCloud className={`w-5 h-5 text-gray-500 ${uploading ? 'animate-pulse' : ''}`}/>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {uploading ? 'מעלה קובץ...' : label}
                </span>
            </label>
            <input 
                id={`file-upload-${folder}`} 
                ref={fileInputRef}
                name="file-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleUpload} 
                disabled={uploading}
            />
            {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
        </div>
    );
};

export default FileUpload;