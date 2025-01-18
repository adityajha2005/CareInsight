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

    // const mockResponse = {
    //   probable_medical_conditions: ['Broken arm', 'Severe Pain'],
    //   urgency: 'High',
    //   action: [
    //     'Call your doctor to seek medical care.',
    //     "If you have a large amount of swelling or mild deformity of the arm, significant pain that is not relieved by ice and home pain medications, or pain in one specific part of the arm when it is pressed, your doctor may advise you to go directly to a hospital's emergency department.",
    //     'If you have a visible bone sticking out through the skin, heavy bleeding from an open wound, complete lack of movement or sensation of part of the arm, obvious deformity that looks drastically different from the usual appearance, or loss of consciousness, go directly to the hospital for emergency care.',
    //     'If you have a loud cracking or snap, raise the injured arm above the level of your heart to slow bleeding and reduce swelling. If a broken bone sticks out from the skin (open fracture), do not try to push it back in.',
    //   ],
    //   what_to_avoid: [],
    //   common_symptoms: [
    //     'Large amount of pain',
    //     'Increased pain when moving the arm',
    //     'Warmth, bruising, or redness',
    //     'Difficulty using or moving the arm normally',
    //     'Nausea',
    //   ],
    //   precautions: [
    //     'Do not try to push a broken bone back in if it sticks out from the skin.',
    //   ],
    //   relevant_resources: [
    //     'https://www.webmd.com/a-to-z-guides/broken-arm',
    //     'https://www.childrenshospital.org/conditions/broken-arm',
    //     'https://fortworthhandcenter.com/surgery/5-signs-broken-arm/',
    //     'https://www.cedars-sinai.org/health-library/diseases-and-conditions/b/broken-fractured-arm-or-shoulder.html',
    //   ],
    // }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl text-center font-mono font-bold mb-8">
          Emergency Situation Analyzer
        </h1>
        {/* <EmergencyAnalyzer /> */}
        <motion.div initial={{y: "100%", opacity: 0, filter: "blur(10px)"}} transition={spring_transition} animate={{y: 0, opacity: 1, filter: "blur(0px)"}}>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">
              What symptoms are you dealing with?
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {symptoms.map((symptom) => (
                  <Toggle
                      key={symptom}
                      pressed={selectedSymptoms.includes(symptom)}
                      onPressedChange={() => toggleSymptom(symptom)}
                      variant="outline"
                  >
                    {symptom}
                  </Toggle>
              ))}
            </div>

            <div className="relative">
              <Textarea
                  placeholder="Describe your medical condition or symptoms you are feeling"
                  className="min-h-[150px] mb-4"
                  maxLength={200}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                  size="icon"
                  variant={isListening ? 'destructive' : 'outline'}
                  className="absolute bottom-8 right-2"
                  onClick={handleVoiceInput}
              >
                <Mic className={isListening ? 'animate-pulse' : ''}/>
              </Button>
              <div className="text-sm text-muted-foreground text-right">
                {description.length}/200 characters
              </div>
            </div>

            <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={handleSubmit}
                disabled={
                    (selectedSymptoms.length === 0 && !description.trim()) ||
                    isLoading
                }
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
        </Card>
        </motion.div>

      {analysisResult && (
          <AnalysisResults data={analysisResult} showDialog={true}/>
      )}
      <SavedResults/>
    </div>
</main>
  )
}
