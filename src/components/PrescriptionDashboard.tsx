"use client";
import React, { useState, useEffect } from "react";
import { db } from '../app/firebaseConfig';  
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import EditPrescription from './EditPrescription';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor_name: string;
  prescription_date: string;
  notes?: string;
  dosageTimes?: { hour: number; minute: number }[];
}

const PrescriptionDashboard = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "prescriptions"));
        const prescriptionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }) as Prescription);
        setPrescriptions(prescriptionsList);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await deleteDoc(doc(db, "prescriptions", id));
        setPrescriptions(prescriptions.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting prescription:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-8">
        Your Prescriptions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div key={prescription.id} className="relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-teal-100 transform hover:scale-[1.02]">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleDelete(prescription.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{prescription.medication}</h3>
                <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                  {new Date(prescription.prescription_date).toLocaleDateString()}
                </span>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-500">Dosage</span>
                  <span className="text-gray-900">{prescription.dosage}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-500">Frequency</span>
                  <span className="text-gray-900">{prescription.frequency}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-500">Duration</span>
                  <span className="text-gray-900">{prescription.duration}</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="font-medium text-gray-500">Doctor</span>
                  <span className="text-gray-900">{prescription.doctor_name}</span>
                </div>
                {prescription.dosageTimes && prescription.dosageTimes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-medium text-gray-500 mb-2">Daily Schedule</p>
                    <div className="grid grid-cols-2 gap-2">
                      {prescription.dosageTimes.map((time, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-500">Dose {index + 1}</span>
                          <span className="text-sm font-medium text-teal-600">
                            {time.hour}:{time.minute}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {prescription.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-medium text-gray-500 mb-2">Notes</p>
                    <p className="text-gray-600 text-sm italic">{prescription.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg mb-2">No prescriptions found</p>
            <p className="text-gray-400 text-sm">Add your first prescription using the button above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDashboard;
