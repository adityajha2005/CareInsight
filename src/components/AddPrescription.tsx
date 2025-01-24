"use client";
import React, { useState } from "react";
import { db } from "../app/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

interface DosageTime {
  hour: string;
  minute: string;
}

const AddPrescription = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    doctorName: "",
    notes: "",
    dosageTimes: [] as DosageTime[]
  });

  const getDefaultTimes = (frequency: number): DosageTime[] => {
    switch (frequency) {
      case 3:
        return [
          { hour: "08", minute: "00" }, // 8 AM
          { hour: "14", minute: "00" }, // 2 PM
          { hour: "20", minute: "00" }, // 8 PM
        ];
      case 2:
        return [
          { hour: "08", minute: "00" }, // 8 AM
          { hour: "20", minute: "00" }, // 8 PM
        ];
      case 1:
        return [{ hour: "08", minute: "00" }]; // Default to 8 AM for single dose
      default:
        return Array(frequency).fill({ hour: "23", minute: "25" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const freq = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      frequency: e.target.value,
      dosageTimes: getDefaultTimes(freq)
    }));
  };

  const handleTimeChange = (index: number, field: 'hour' | 'minute', value: string) => {
    const newDosageTimes = [...formData.dosageTimes];
    newDosageTimes[index] = { ...newDosageTimes[index], [field]: value };
    setFormData(prev => ({ ...prev, dosageTimes: newDosageTimes }));
  };

  const clearForm = () => {
    setFormData({
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      doctorName: "",
      notes: "",
      dosageTimes: []
    });
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const prescriptionId = Date.now().toString();
      await setDoc(doc(db, "prescriptions", prescriptionId), {
        ...formData,
        userId: user?.id,
        doctor_name: formData.doctorName,
        prescription_date: new Date().toISOString(),
      });

      alert("Prescription added successfully!");
      clearForm();
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-8">
          Add Prescription
        </h2>
        <form onSubmit={handleAddPrescription} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Medication Name</label>
              <input
                type="text"
                name="medication"
                value={formData.medication}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 hover:border-teal-300"
                required
                pattern="[A-Za-z0-9\s-]+"
                title="Only letters, numbers, spaces and hyphens are allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dosage (mg)</label>
              <input
                type="number"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 hover:border-teal-300"
                required
                min="0"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Frequency (per day)</label>
              <input
                type="number"
                name="frequency"
                value={formData.frequency}
                onChange={handleFrequencyChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 hover:border-teal-300"
                required
                min="1"
                max="24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 hover:border-teal-300"
                required
                min="1"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Doctor's Name</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 hover:border-teal-300"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 hover:border-teal-300 min-h-[120px] resize-y"
              />
            </div>
          </div>
          {formData.frequency && Number(formData.frequency) > 0 && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Dosage Times</label>
                {Number(formData.frequency) === 1 && (
                  <span className="text-sm text-teal-600">Please select your preferred time</span>
                )}
                {Number(formData.frequency) > 1 && (
                  <span className="text-sm text-teal-600">Recommended timings (can be adjusted)</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.dosageTimes.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Dose {index + 1}:</span>
                    <select
                      value={time.hour}
                      onChange={(e) => handleTimeChange(index, 'hour', e.target.value)}
                      className="px-2 py-1 rounded border"
                    >
                      {Array.from({ length: 24 }, (_, i) => 
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}:00
                        </option>
                      )}
                    </select>
                    <span>:</span>
                    <select
                      value={time.minute}
                      onChange={(e) => handleTimeChange(index, 'minute', e.target.value)}
                      className="px-2 py-1 rounded border"
                    >
                      {['00', '15', '30', '45'].map(min => 
                        <option key={min} value={min}>{min}</option>
                      )}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-[1.02]"
            >
              Add Prescription
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescription;
