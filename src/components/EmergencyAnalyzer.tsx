'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface EmergencyResponse {
  urgency: 'high' | 'medium' | 'low'
  description: string
}

export default function EmergencyAnalyzer() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<EmergencyResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

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
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Emergency Situation Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the situation..."
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </form>

        {result && (
          <div className="mt-4">
            <h3 className="font-semibold">Analysis Result:</h3>
            <p>Urgency: {result.urgency}</p>
            <p>Description: {result.description}</p>

            {result.urgency === 'high' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="mt-2">
                    Emergency Actions
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-red-100">
                  <DialogHeader>
                    <DialogTitle>Emergency Situation Detected</DialogTitle>
                    <DialogDescription>
                      This situation requires immediate attention. Please
                      consider the following actions:
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Button
                      variant="destructive"
                      onClick={() => (window.location.href = 'tel:100')}
                    >
                      Call 100
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = 'tel:1-800-273-8255')
                      }
                    >
                      National Suicide Prevention Lifeline
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = 'tel:1-800-799-7233')
                      }
                    >
                      National Domestic Violence Hotline
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const EmergencyDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-2">
          Emergency Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-red-100">
        <DialogHeader>
          <DialogTitle>Emergency Situation Detected</DialogTitle>
          <DialogDescription>
            This situation requires immediate attention. Please consider the
            following actions:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Button
            variant="destructive"
            onClick={() => (window.location.href = 'tel:100')}
          >
            Call 100
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = 'tel:1-800-273-8255')}
          >
            National Suicide Prevention Lifeline
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = 'tel:1-800-799-7233')}
          >
            National Domestic Violence Hotline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
