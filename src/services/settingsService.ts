import { db } from '@/firebase/config';
import { collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, Unsubscribe } from 'firebase/firestore';
import { ClinicProfile, AppointmentType } from '../types';

// --- Clinic Profile ---

export const listenToProfile = (userId: string, callback: (profile: ClinicProfile | null) => void, errorCallback?: (error: Error) => void): Unsubscribe => {
    const docRef = doc(db, 'settings', userId);
    return onSnapshot(docRef, (docSnap) => {
        callback(docSnap.exists() ? docSnap.data() as ClinicProfile : null);
    }, (error) => {
        console.error("Profile listener error:", error);
        if (errorCallback) errorCallback(error);
    });
};

export const saveProfile = async (userId: string, profileData: ClinicProfile): Promise<void> => {
    const docRef = doc(db, 'settings', userId);
    // The component now handles uploads and passes the URLs, so we just save the data.
    await setDoc(docRef, profileData, { merge: true });
};


// --- Appointment Types ---

export const listenToAppointmentTypes = (userId: string, callback: (types: AppointmentType[]) => void, errorCallback?: (error: Error) => void): Unsubscribe => {
    const collectionRef = collection(db, `settings/${userId}/appointmentTypes`);
    return onSnapshot(collectionRef, (snapshot) => {
        const types = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AppointmentType[];
        callback(types);
    }, (error) => {
        console.error("Appointment types listener error:", error);
        if (errorCallback) errorCallback(error);
    });
};

export const addAppointmentType = async (userId: string, name: string): Promise<void> => {
    const collectionRef = collection(db, `settings/${userId}/appointmentTypes`);
    await addDoc(collectionRef, { name });
};

export const updateAppointmentType = async (userId: string, typeId: string, name: string): Promise<void> => {
     const docRef = doc(db, `settings/${userId}/appointmentTypes`, typeId);
     await updateDoc(docRef, { name });
}


export const deleteAppointmentType = async (userId: string, typeId: string): Promise<void> => {
    const docRef = doc(db, `settings/${userId}/appointmentTypes`, typeId);
    await deleteDoc(docRef);
};