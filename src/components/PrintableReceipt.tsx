// src/components/PrintableReceipt.tsx
'use client'; 

import React from 'react';
import { Payment, Patient, ClinicProfile } from '../types';
import { PrinterIcon } from './icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const printStyles = `
@media print {
  body * {
    visibility: hidden;
  }
  .printable-invoice, .printable-invoice * {
    visibility: visible;
  }
  .printable-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    padding: 0;
  }
  .no-print {
    display: none !important;
  }
}
`;

interface InvoiceActionButtonsProps {
  onPrint: () => void;
  onDownload: () => void;
  onEmail: () => void;
}

const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({ onPrint, onDownload, onEmail }) => (
  <div className="no-print p-4 flex justify-end gap-2 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
    <button onClick={onEmail} className="px-4 py-2 text-sm rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">
      שלח במייל
    </button>
    <button onClick={onDownload} className="px-4 py-2 text-sm rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">
      הורד PDF
    </button>
    <button onClick={onPrint} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
      <PrinterIcon className="w-4 h-4"/>
      הדפס
    </button>
  </div>
);

interface PrintableReceiptProps {
  payment: Payment;
  patient: Patient;
  clinicProfile: ClinicProfile;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ payment, patient, clinicProfile }) => {

  const handlePrint = () => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);
    window.print();
    document.head.removeChild(styleSheet);
  };

  const handleDownload = () => {
    const input = document.getElementById('receipt-content');
    if (input) {
      html2canvas(input, { 
        scale: 2,
        useCORS: true, 
        width: input.scrollWidth,
        height: input.scrollHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4'
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`receipt-${payment.receiptNumber || 'unknown'}.pdf`);
      });
    }
  };

  const handleEmail = () => {
    const subject = `קבלה מספר ${payment.receiptNumber}`;
    const body = `שלום ${patient.name},\n\nמצ"ב קבלה עבור התשלום.\n\nשים לב: עקב מגבלות דפדפן, לא ניתן לצרף את קובץ החשבונית אוטומטית. אנא הורד את החשבונית מהאפליקציה וצרף אותה למייל זה.\n\nתודה,\n${clinicProfile.clinicName}`;
    window.location.href = `mailto:${patient.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const receiptNumber = payment.receiptNumber || 'N/A';

  return (
    <div className="text-sm">
      <div id="receipt-content" className="printable-invoice bg-white text-gray-800 p-6">
          <header className="flex justify-between items-start pb-4 border-b">
            <div className="text-right">
              {clinicProfile.logoUrl && <img src={clinicProfile.logoUrl} alt="Clinic Logo" className="h-16 mb-2"/>}
              <h1 className="text-2xl font-bold text-blue-600">{clinicProfile.clinicName}</h1>
              <p>ע.מ./ח.פ: {clinicProfile.licenseNumber}</p>
              <p>{clinicProfile.address}</p>
              <p>טלפון: {clinicProfile.phone}</p>
              <p>אימייל: {clinicProfile.email}</p>
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-bold">קבלה</h2>
              <p className="font-semibold text-lg">מקור</p>
              <p className="mt-2"><span className="font-semibold">מספר קבלה:</span> {receiptNumber}</p>
              <p><span className="font-semibold">תאריך הפקה:</span> {new Date(payment.date).toLocaleDateString('he-IL')}</p>
            </div>
          </header>

          <div className="my-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">לכבוד:</h3>
            <p className="font-medium">{patient.name}</p>
            {patient.address && <p>{patient.address}</p>}
            <p>{patient.phone}</p>
            <p>{patient.email}</p>
          </div>

          <table className="w-full mt-4 text-right">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 pr-2 font-semibold">תיאור</th>
                <th className="py-2 px-2 font-semibold">אמצעי תשלום</th>
                <th className="py-2 px-2 font-semibold text-left">סכום</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 pr-2">{payment.notes || 'תשלום עבור טיפול'}</td>
                <td className="py-3 px-2">{payment.method}</td>
                <td className="py-3 px-2 text-left font-medium">₪{payment.amount?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-full max-w-xs text-left">
              <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                <span className="font-bold text-lg">סה"כ ששולם:</span>
                <span className="font-bold text-lg">₪{payment.amount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <footer className="text-center text-xs text-gray-500 pt-8 mt-8 border-t">
            <p>תודה שבחרתם ב-{clinicProfile.clinicName}!</p>
            <p>זוהי קבלה ממוחשבת.</p>
          </footer>
      </div>
      <InvoiceActionButtons onPrint={handlePrint} onDownload={handleDownload} onEmail={handleEmail} />
    </div>
  );
};