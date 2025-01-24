// // ...existing imports...

// const generateTimeOptions = () => {
//   const options = [];
//   for (let hour = 0; hour < 24; hour++) {
//     for (let minute = 0; minute < 60; minute += 5) { // Changed from 15 to 5
//       const formattedHour = hour.toString().padStart(2, '0');
//       const formattedMinute = minute.toString().padStart(2, '0');
//       options.push({
//         value: `${formattedHour}:${formattedMinute}`,
//         label: `${formattedHour}:${formattedMinute}`
//       });
//     }
//   }
//   return options;
// };

// export function PrescriptionForm() {
//   // ...existing code...
  
//   return (
//     <form>
//       {/* ...existing form fields... */}
//       <select 
//         value={selectedTime} 
//         onChange={(e) => handleTimeChange(e.target.value)}
//       ></select>
//         {generateTimeOptions().map(option => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//       {/* ...rest of the form... */}
//     </form>
//   );
// }
