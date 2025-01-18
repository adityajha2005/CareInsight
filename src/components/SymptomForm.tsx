'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SymptomFormProps {
  onSubmit: (symptoms: string) => void;
}

export default function SymptomForm({ onSubmit }: SymptomFormProps) {
  const [symptoms, setSymptoms] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(symptoms)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 border-cyan-500 border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-cyan-400 glow">Describe Your Symptoms</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter your symptoms..."
            className="bg-gray-700 text-cyan-200 border-cyan-500"
          />
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
            Analyze Symptoms
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
