"use client";
// src/components/AddPrescription.js
import React, { useState } from "react";
import { db } from "../app/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const AddPrescription = () => {
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddPrescription = async (e:any) => {
    e.preventDefault();

    try {
      const prescriptionId = Date.now().toString(); 

      await setDoc(doc(db, "prescriptions", prescriptionId), {
        medication,
        dosage,
        frequency,
        duration,
        doctor_name: doctorName,
        prescription_date: new Date().toISOString(),
        notes,
      });

      alert("Prescription added successfully!");
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Add Prescription</h2>
      <form onSubmit={handleAddPrescription} className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-teal-100">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Medication"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            required
          />
          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            required
          />
          <input
            type="text"
            placeholder="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            required
          />
          <input
            type="text"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            required
          />
          <input
            type="text"
            placeholder="Doctor's Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
            required
          />
          <textarea
            placeholder="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all min-h-[120px] resize-y"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Add Prescription
        </button>
      </form>
    </div>
  );
};

export default AddPrescription;
