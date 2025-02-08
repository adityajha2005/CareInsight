'use client'

import { MentalHealthQuiz } from '@/components/MentalHealth'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function MentalHealthQuizPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto px-4"
            >
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Mental Health Assessment
                </h1>
                <p className="text-center mb-8 text-gray-600">
                    Take a moment to reflect on your mental well-being with our interactive assessment
                </p>
                <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                    <MentalHealthQuiz />
                </Card>
                <footer className="mt-8 text-center text-sm text-gray-500">
                    <p>This quiz is designed to help you understand your mental well-being better.</p>
                    <p>If you're experiencing severe symptoms, please consult a healthcare professional.</p>
                </footer>
            </motion.div>
        </main>
    )
}
