'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Mic } from 'lucide-react'
import { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import { AnalysisResults } from '@/components/analysis-results'
import { SavedResults } from '@/components/SavedResults'
import { motion } from 'motion/react'
import { Alert } from '@/components/ui/alert'
import { MentalHealthQuiz } from '@/components/MentalHealth'

const spring_transition = {
  type: "spring",
  stiffness: 200, // Controls how tight the spring is
  damping: 40,    // Controls the resistance of the spring
  bounce: 0.5,    // Controls the amount of bounce (0 to 2 is common)
  duration: 0.8,  // Optional, spring usually ignores this unless combined
}

const symptoms = [
  'Fever',
  'Headache',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Cough',
  'Shortness of breath',
  'Chest pain',
  'Muscle aches',
  'Sore throat',
]

let recognition: any = null

export default function Home() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      // Initialize recognition only once
      if (!recognition) {
        recognition = new (window as any).webkitSpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('')
          setDescription(transcript)
        }

        recognition.onend = () => {
          setIsListening(false)
        }
      }

      try {
        if (isListening) {
          recognition.stop()
        } else {
          recognition.start()
        }
      } catch (error) {
        console.error('Speech recognition error:', error)
        setIsListening(false)
      }
    } else {
      alert('Speech recognition is not supported in your browser.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const prompt = `Symptoms: ${selectedSymptoms.join(
      ', '
    )}. Description: ${description}`
    console.log(prompt) // For testing the format

    try {
      const response = await fetch('/api/cohere', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch')
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }

    
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
       <MentalHealthQuiz />
    </div>
</main>
  )
}
