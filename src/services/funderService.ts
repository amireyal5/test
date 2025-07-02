
import { db } from '@/firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Unsubscribe } from 'firebase/firestore';
import { Funder } from '../types';

export const listen = (userId: string, callback: (funders: Funder[]) => void, errorCallback?: (error: Error) => void): Unsubscribe => {
    const q = query(collection(db, "funders"), where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
        const funders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Funder[];
        callback(funders);
    }, (error) => {
        console.error("Funder listener error:", error);
        if (errorCallback) errorCallback(error);
    });
};

export const addOrEdit = async (userId: string, funderData: Omit<Funder, 'id'> & { id?: string }): Promise<void> => {
    const { id, ...data } = funderData;
    try {
        if (id) {
            await updateDoc(doc(db, "funders", id), data);
        } else {
            await addDoc(collection(db, "funders"), { ...data, userId });
        }
    } catch (e) {
        console.error("Error modifying funder:", e);
    }
};

export const remove = async (funderId: string): Promise<void> => {
    // Note: This does not automatically handle payments linked to this funder.
    // The confirmation logic is now handled in the UI layer (modal).
    await deleteDoc(doc(db, "funders", funderId));
};