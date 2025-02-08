'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const questions = [
    { id: 1, text: "How would you rate your overall mood today?", options: ["Excellent", "Good", "Fair", "Poor"] },
    { id: 2, text: "How well did you sleep last night?", options: ["Very well", "Well", "Not so well", "Poorly"] },
    { id: 3, text: "How would you describe your stress level?", options: ["Low", "Moderate", "High", "Very high"] },
    // Add more questions as needed
]

export function MentalHealthQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const progress = (currentQuestion / questions.length) * 100

    const handleAnswer = (answer: string) => {
        setAnswers([...answers, answer])
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        }
    }

    return (
        <div className="space-y-6">
            <Progress value={progress} className="w-full h-2" />
            
            <AnimatePresence mode="wait">
                {currentQuestion < questions.length ? (
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-semibold">
                            {questions[currentQuestion].text}
                        </h2>
                        <div className="grid gap-3">
                            {questions[currentQuestion].options.map((option) => (
                                <Button
                                    key={option}
                                    variant="outline"
                                    className="w-full text-left justify-start hover:bg-blue-50 transition-colors"
                                    onClick={() => handleAnswer(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <h2 className="text-2xl font-bold text-green-600">Thank you for completing the quiz!</h2>
                        <p>We'll analyze your responses and provide personalized insights.</p>
                        <Button 
                            onClick={() => {
                                setCurrentQuestion(0)
                                setAnswers([])
                            }}
                            className="mt-4"
                        >
                            Take Quiz Again
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
