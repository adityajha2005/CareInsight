// "use client";
// import React, { useState, useEffect } from "react";
// import { db } from "../app/firebaseConfig";
// import { updateDoc, doc, getDoc } from "firebase/firestore";

// interface DosageTime {
//   hour: string;
//   minute: string;
// }

// interface EditPrescriptionProps {
//   prescriptionId: string;
//   onClose: () => void;
// }

// const EditPrescription = ({ prescriptionId, onClose }: EditPrescriptionProps) => {
//   const [formData, setFormData] = useState({
//     medication: "",
//     dosage: "",
//     frequency: "",
//     duration: "",
//     doctorName: "",
//     notes: "",
//     dosageTimes: [] as DosageTime[]
//   });

//   useEffect(() => {
//     const fetchPrescription = async () => {
//       try {
//         const docRef = doc(db, "prescriptions", prescriptionId);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setFormData({
//             medication: data.medication || "",
//             dosage: data.dosage || "",
//             frequency: data.frequency || "",
//             duration: data.duration || "",
//             doctorName: data.doctor_name || "",
//             notes: data.notes || "",
//             dosageTimes: data.dosageTimes || []
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching prescription:", error);
//       }
//     };

//     fetchPrescription();
//   }, [prescriptionId]);

//   // ... reuse the same handleChange, handleFrequencyChange, and handleTimeChange functions from AddPrescription ...

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateDoc(doc(db, "prescriptions", prescriptionId), {
//         ...formData,
//         doctor_name: formData.doctorName,
//         updated_at: new Date().toISOString(),
//       });
//       alert("Prescription updated successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Error updating prescription:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
//             Edit Prescription
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Copy the form fields structure from AddPrescription */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Add the same input fields as AddPrescription */}
//             {/* Include the dosage timing fields */}
//           </div>
          
//           <div className="flex gap-4">
//             <button
//               type="submit"
//               className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
//             >
//               Update Prescription
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPrescription;
