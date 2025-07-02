import { db } from '@/firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Unsubscribe, runTransaction } from 'firebase/firestore';
import { Payment } from '../types';

export const listen = (userId: string, callback: (payments: Payment[]) => void, errorCallback?: (error: Error) => void): Unsubscribe => {
    const q = query(collection(db, "payments"), where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
        const payments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Payment[];
        callback(payments);
    }, (error) => {
        console.error("Payment listener error:", error);
        if (errorCallback) errorCallback(error);
    });
};

export const addOrEdit = async (userId: string, paymentData: Partial<Payment>, currentReceiptCounter: number): Promise<void> => {
    const { id, ...data } = paymentData;
    const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
    );

    try {
        if (id) {
            // Editing an existing payment does not change receipt number
            await updateDoc(doc(db, "payments", id), cleanedData);
        } else {
            // Adding a new payment requires a transaction to get a unique receipt number
            const settingsDocRef = doc(db, 'settings', userId);
            
            await runTransaction(db, async (transaction) => {
                const settingsDoc = await transaction.get(settingsDocRef);
                const newReceiptNumber = (settingsDoc.data()?.receiptCounter || 0) + 1;

                const newPaymentRef = doc(collection(db, "payments"));
                transaction.set(newPaymentRef, { 
                    ...cleanedData, 
                    userId, 
                    receiptNumber: newReceiptNumber.toString() 
                });
                
                transaction.update(settingsDocRef, { receiptCounter: newReceiptNumber });
            });
        }

        if (cleanedData.appointmentId && typeof cleanedData.appointmentId === 'string') {
             try {
                const apptDocRef = doc(db, "appointments", cleanedData.appointmentId);
                await updateDoc(apptDocRef, { paymentStatus: 'Paid' });
             } catch (e) {
                console.error("Could not update linked appointment status:", e);
             }
        }
    } catch (e) {
        console.error("Error modifying payment:", e);
    }
};

export const remove = async (paymentId: string): Promise<void> => {
    // Confirmation is handled in the UI
    try {
        await deleteDoc(doc(db, "payments", paymentId));
    } catch (e) {
        console.error("Error deleting payment:", e);
    }
};