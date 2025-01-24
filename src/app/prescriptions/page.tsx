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
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all"
          >
            {showAddForm ? 'View Prescriptions' : 'Add New Prescription'}
          </button>
        </div>
        
        {showAddForm ? <AddPrescription /> : <PrescriptionDashboard />}
      </div>
    </div>
  )
}
