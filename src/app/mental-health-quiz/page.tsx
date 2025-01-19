'use client'
// import { MentalHealthQuiz } from '@/components/MentalHealthQuiz'
import { MentalHealthQuiz } from '@/components/MentalHealth'
import { Card } from '@/components/ui/card'

export default function MentalHealthQuizPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <Card className="p-6">
                    <MentalHealthQuiz />
                </Card>
            </div>
        </main>
    )
}
