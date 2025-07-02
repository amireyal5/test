import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";

const rubik = Rubik({ 
  subsets: ["hebrew", "latin"],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "SmartClinic - ניהול קליניקה חכם",
  description: "אפליקציה מתקדמת לניהול מטופלים המשלבת ממשק אינטואיטיבי עם עוזר AI חכם המופעל על ידי Gemini, לשיפור היעילות והטיפול במרפאה.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={rubik.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}