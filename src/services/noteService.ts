import { db } from '@/firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Unsubscribe } from 'firebase/firestore';
import { SessionNote } from '../types';

export const listen = (userId: string, callback: (notes: SessionNote[]) => void, errorCallback?: (error: Error) => void): Unsubscribe => {
    const q = query(collection(db, "sessionNotes"), where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
        const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SessionNote[];
        callback(notes);
    }, (error) => {
        console.error("Note listener error:", error);
        if (errorCallback) errorCallback(error);
    });
};

export const addOrEdit = async (userId: string, noteData: Omit<SessionNote, 'id'> & { id?: string }): Promise<void> => {
    const { id, ...data } = noteData;
    if (id) {
        await updateDoc(doc(db, "sessionNotes", id), data);
    } else {
        await addDoc(collection(db, "sessionNotes"), { ...data, userId });
    }
};

export const remove = async (noteId: string): Promise<void> => {
    // Confirmation logic is now handled in the UI layer.
    await deleteDoc(doc(db, "sessionNotes", noteId));
};