export interface DosageTime {
  hour: string;
  minute: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor_name: string;
  prescription_date: string;
  notes?: string;
  dosageTimes: DosageTime[];
}

export interface PrescriptionFormData {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctorName: string;
  notes: string;
  dosageTimes: DosageTime[];
}
