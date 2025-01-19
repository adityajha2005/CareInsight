'use client'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import {Button} from '@/components/ui/button'
import {Card} from '@/components/ui/card'
import {Textarea} from '@/components/ui/textarea'
import {Mic} from 'lucide-react'
import React, {useState} from 'react'
import {Toggle} from '@/components/ui/toggle'
import {AnalysisResults} from '@/components/analysis-results'
import {motion} from 'motion/react'
import FeedbackForm from '@/components/feedback'
import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/navigation'

const spring_transition = {
    type: "spring",
    stiffness: 200, 
    damping: 30,    // Controls the resistance of the spring
    bounce: 0.5,   
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
    const router = useRouter();
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
    const [description, setDescription] = useState(
        'I\'m having cold, cough and fever with a running nose.'
    )
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
        console.log(prompt) 

        try {
            const response = await fetch('/api/cohere', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({prompt}),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch')
            }

            const data = await response.json()
            setAnalysisResult(data)
            
            toast('Would you like to take a quick mental health checkup?', {
                action: {
                    label: 'Yes, take me there',
                    onClick: () => router.push('/mental-health-quiz')
                },
                duration: 8000,
                className: "border relative overflow-hidden"
            })
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const handleFeedbackSubmit = async (feedback: any) => {
        try {
        // just for showing 
          setFeedbackSubmitted(true);
        } catch (error) {
          console.error('Error submitting feedback:', error);
        }
      };
    
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Toaster 
                position="bottom-right" 
                className="max-sm:!top-6 max-sm:!bottom-auto max-sm:!right-4" 
            />
            <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-xl text-center font-mono font-bold mb-8 text-blue-600">
          Emergency Situation Analyzer
        </h1>
                {/* <EmergencyAnalyzer /> */}
                <motion.div initial={{y: "100%", opacity: 0, filter: "blur(10px)"}}
                            animate={{y: 0, opacity: 1, filter: "blur(0px)"}} transition={spring_transition}>
                    <Card className="p-6 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <h2 className="text-2xl font-semibold mb-6 text-blue-600">
                            How are you feeling today?
                        </h2>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {symptoms.map((symptom) => (
                                <Toggle
                                    key={symptom}
                                    pressed={selectedSymptoms.includes(symptom)}
                                    onPressedChange={() => toggleSymptom(symptom)}
                                    variant="outline"
                                    className="border-blue-200 hover:bg-blue-50 data-[state=on]:bg-blue-100"
                                >
                                    {symptom}
                                </Toggle>
                            ))}
                        </div>

                        <div className="relative">
                            <Textarea
                                placeholder="Describe your medical condition or symptoms you are feeling"
                                className="min-h-[150px] mb-4 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                maxLength={200}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <p className="text-xs my-5 w-[65%] md:w-full md:text-sm leading-3 text-gray-400">DISCLAIMER:
                                Not a replacement for medical
                                professionals.</p>
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
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
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
                {analysisResult &&
                    <motion.div
                        initial={{y: "100%", opacity: 0, filter: "blur(10px)"}}
                        animate={{y: 0, opacity: 1, filter: "blur(0px)"}}
                        transition={spring_transition}
                    >
                        <AnalysisResults data={analysisResult} showDialog={false}/>
                        {!feedbackSubmitted ? (
              <FeedbackForm onSubmit={handleFeedbackSubmit} />
            ) : (
              <p className="mt-4 text-green-600">
                <CheckIcon />{" "}Thank you for your feedback!</p>
            )}
                    </motion.div>}
            </div>
        </main>
    )
}
