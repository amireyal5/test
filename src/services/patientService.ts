


import { db } from '@/firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs, Unsubscribe, setDoc, getDoc } from 'firebase/firestore';
import { Patient, Attachment } from '../types';
import { mockPatients, mockAppointments, mockPayments, mockSessionNotes } from '@/data';

// ==================
// PATIENT SERVICE
// ==================

export const listen = (userId: string, callback: (patients: Patient[]) => void, errorCallback?: (error: Error) => void): Unsubscribe => {
    const q = query(collection(db, "patients"), where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
        const patients = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Patient[];
        callback(patients);
    }, (error) => {
        console.error("Patient listener error:", error);
        if (errorCallback) errorCallback(error);
    });
};

export const addOrEdit = async (userId: string, patientData: Omit<Patient, 'id'> & { id?: string }): Promise<void> => {
    const { id, ...data } = patientData;
    try {
        if (id) {
            await updateDoc(doc(db, "patients", id), data);
        } else {
            await addDoc(collection(db, "patients"), { ...data, userId });
        }
    } catch (e) {
        console.error("Error modifying patient:", e);
    }
};

export const updateLog = async (patientId: string, log: string): Promise<void> => {
    await updateDoc(doc(db, "patients", patientId), { personalLog: log });
}

export const remove = async (userId: string, patientId: string): Promise<void> => {
    // Files on Cloudinary are not deleted automatically as it requires a secure backend implementation.
    // This function will delete all patient data from Firestore.
    const batch = writeBatch(db);

    // 1. Delete the patient document itself
    batch.delete(doc(db, "patients", patientId));

    // 2. Query and delete all associated documents from Firestore
    const collectionsToDelete = ['attachments', 'appointments', 'payments', 'sessionNotes'];
    for (const colName of collectionsToDelete) {
        const q = query(collection(db, colName), where("userId", "==", userId), where("patientId", "==", patientId));
        
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(docSnap => {
            batch.delete(docSnap.ref);
        });
    }

    await batch.commit();
};


// ==================
// ATTACHMENT SERVICE
// ==================
export const listenToAttachments = (patientId: string, callback: (attachments: Attachment[]) => void): Unsubscribe => {
    const q = query(collection(db, "attachments"), where("patientId", "==", patientId));
    return onSnapshot(q, (snapshot) => {
        const attachments = snapshot.docs.map(docSnap => docSnap.data() as Attachment);
        callback(attachments);
    });
};

export const addAttachment = async (userId: string, patientId: string, url: string, fileName: string): Promise<void> => {
    const attachmentDocRef = doc(collection(db, "attachments"));
    await setDoc(attachmentDocRef, {
        id: attachmentDocRef.id,
        userId,
        patientId,
        fileName,
        url,
        uploadedAt: new Date().toISOString()
    });
};

export const removeAttachment = async (attachment: Attachment): Promise<void> => {
    // This only deletes the record from Firestore.
    // Deleting the actual file from Cloudinary requires a secure backend API call.
    // Confirmation is handled in the UI.
    const attachmentDocRef = doc(db, "attachments", attachment.id);
    await deleteDoc(attachmentDocRef);
};


// ==================
// SEEDING (for new users)
// ==================
export const seed = async (userId: string): Promise<boolean> => {
    const settingsDoc = await getDoc(doc(db, 'settings', userId));
    if (settingsDoc.exists() && settingsDoc.data()?.seeded) {
        return false;
    }
    
    const patientsQuery = query(collection(db, 'patients'), where("userId", "==", userId));
    const patientsSnapshot = await getDocs(patientsQuery);

    if (patientsSnapshot.empty) {
        console.log("Seeding database for new user...");
        const batch = writeBatch(db);

        const patientIdMap = new Map<number, string>();

        mockPatients.forEach((p, index) => {
            const docRef = doc(collection(db, 'patients'));
            patientIdMap.set(index + 1, docRef.id);
            batch.set(docRef, { ...p, userId, address: 'רחוב הדוגמה 1, תל אביב' });
        });

        mockAppointments.forEach(a => {
            let mockPatientId: number | undefined;
            if (typeof a.patientId === 'string') {
                const parsed = parseInt(a.patientId, 10);
                if (!isNaN(parsed)) mockPatientId = parsed;
            }

            if (typeof mockPatientId === 'number') {
                const patientId = patientIdMap.get(mockPatientId);
                if (patientId) {
                    const docRef = doc(collection(db, 'appointments'));
                    batch.set(docRef, { ...a, patientId, userId });
                }
            }
        });
        mockPayments.forEach((p, index) => {
             let mockPatientId: number | undefined;
            if (typeof p.patientId === 'string') {
                const parsed = parseInt(p.patientId, 10);
                if (!isNaN(parsed)) mockPatientId = parsed;
            }
             if (typeof mockPatientId === 'number') {
                const patientId = patientIdMap.get(mockPatientId);
                if (patientId) {
                    const docRef = doc(collection(db, 'payments'));
                    batch.set(docRef, { ...p, patientId, userId, receiptNumber: `${index + 1}` });
                }
            }
        });
        mockSessionNotes.forEach(n => {
            let mockPatientId: number | undefined;
            if (typeof n.patientId === 'string') {
                const parsed = parseInt(n.patientId, 10);
                if (!isNaN(parsed)) mockPatientId = parsed;
            }
             if (typeof mockPatientId === 'number') {
                const patientId = patientIdMap.get(mockPatientId);
                if (patientId) {
                    const docRef = doc(collection(db, 'sessionNotes'));
                    batch.set(docRef, { ...n, patientId, userId });
                }
            }
        });

        const settingsRef = doc(db, 'settings', userId);
        batch.set(settingsRef, {
            clinicName: 'SmartClinic',
            therapistName: 'עמיר אייל',
            licenseNumber: '028891208',
            address: 'חטיבת יפתח, תל אביב',
            phone: '054-7509962',
            email: 'amirher@gmail.com',
            receiptCounter: mockPayments.length,
            seeded: true
        });

        const defaultApptTypes = ['בדיקה תקופתית', 'ייעוץ', 'מעקב'];
        defaultApptTypes.forEach(name => {
            const typeRef = doc(collection(db, `settings/${userId}/appointmentTypes`));
            batch.set(typeRef, { name });
        });


        await batch.commit();
        return true;
    }
    return false;
}