'use client'
import AddPrescription from '@/components/AddPrescription'
import PrescriptionDashboard from '@/components/PrescriptionDashboard'
import { useState, useEffect } from 'react'

export default function PrescriptionsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Add debugging log
  useEffect(() => {
    console.log('PrescriptionsPage rendered')
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Prescriptions
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-[1.02] flex items-center gap-2"
          >
            <span>{showAddForm ? '← View Prescriptions' : '+ Add New Prescription'}</span>
          </button>
        </div>
        
        {showAddForm ? <AddPrescription /> : <PrescriptionDashboard />}
      </div>
    </div>
  )
}
