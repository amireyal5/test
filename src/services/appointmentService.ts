
import { db } from '@/firebase/config';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch, Unsubscribe, getDocs, collectionGroup } from 'firebase/firestore';
import { Appointment } from '../types';
import { addWeeks, format } from 'date-fns';

export const listen = (userId: string, callback: (appointments: Appointment[]) => void, errorCallback?: (error: Error) => void): Unsubscribe => {
    const q = query(collection(db, "appointments"), where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
        const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
        callback(appointments);
    }, (error) => {
        console.error("Appointment listener error:", error);
        if (errorCallback) errorCallback(error);
    });
};

export const addOrEdit = async (
    userId: string, 
    { appointmentData, recurrenceData }: { appointmentData: any, recurrenceData: any },
    patientName: string
): Promise<void> => {
    const isEdit = !!appointmentData.id;
    
    // Detach from series if editing a single recurring event
    if (isEdit && appointmentData.seriesId && !recurrenceData?.updateFuture) {
        appointmentData.seriesId = null; 
    }

    const baseAppointment = {
      ...appointmentData,
      patientName: patientName,
      userId: userId,
      confirmationStatus: appointmentData.confirmationStatus || 'Unconfirmed',
    };
    delete baseAppointment.id;

    if (isEdit) {
        if (recurrenceData?.updateFuture && appointmentData.seriesId) {
            // Update this and all future appointments in the series
            const batch = writeBatch(db);
            const seriesQuery = query(collection(db, "appointments"), where("seriesId", "==", appointmentData.seriesId), where("date", ">=", appointmentData.date));
            const snapshot = await getDocs(seriesQuery);

            snapshot.forEach(docSnap => {
                const existingAppt = docSnap.data();
                const updatedAppt = {
                    ...existingAppt,
                    time: appointmentData.time,
                    type: appointmentData.type,
                    duration: appointmentData.duration,
                    price: appointmentData.price,
                };
                batch.update(doc(db, "appointments", docSnap.id), updatedAppt);
            });
            await batch.commit();

        } else {
            // Update a single appointment
            await updateDoc(doc(db, "appointments", appointmentData.id), appointmentData);
        }

    } else { // Add mode
        const batch = writeBatch(db);
        if (recurrenceData.isRecurring && recurrenceData.endDate) {
            let currentDate = new Date(appointmentData.date);
            const endDate = new Date(recurrenceData.endDate);

            while(currentDate <= endDate) {
                const newAppt = { ...baseAppointment, date: format(currentDate, 'yyyy-MM-dd') };
                batch.set(doc(collection(db, "appointments")), newAppt);
                currentDate = addWeeks(currentDate, 1);
            }
        } else {
            batch.set(doc(collection(db, "appointments")), baseAppointment);
        }
        await batch.commit();
    }
};

export const remove = async (appointmentId: string, seriesId?: string, deleteAllFuture?: boolean): Promise<void> => {
    // Confirmation logic is now handled in the UI layer.
    if (deleteAllFuture && seriesId) {
        const batch = writeBatch(db);
        const apptToDeleteDoc = await getDocs(query(collection(db, "appointments"), where("id", "==", appointmentId)));
        const apptToDelete = (await getDocs(query(collection(db, "appointments"), where("__name__", "==", appointmentId)))).docs[0];

        if(!apptToDelete.exists()) return;
        const startDate = apptToDelete.data().date;

        const q = query(collection(db, "appointments"), where("seriesId", "==", seriesId), where("date", ">=", startDate));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    } else {
        await deleteDoc(doc(db, "appointments", appointmentId));
    }
};
