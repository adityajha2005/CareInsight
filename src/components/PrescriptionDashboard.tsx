"use client";
import React , {useState, useEffect} from "react";
import { db } from '../app/firebaseConfig';  

import { collection, getDocs } from "firebase/firestore";

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor_name: string;
  prescription_date: string;
  notes: string;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Prescriptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-4">{prescription.medication}</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Dosage:</span> {prescription.dosage}
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Frequency:</span> {prescription.frequency}
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Duration:</span> {prescription.duration}
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Doctor:</span> {prescription.doctor_name}
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Date:</span> 
                  {new Date(prescription.prescription_date).toLocaleDateString()}
                </p>
                {prescription.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-medium mb-1">Notes:</p>
                    <p className="text-gray-500">{prescription.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No prescriptions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDashboard;
