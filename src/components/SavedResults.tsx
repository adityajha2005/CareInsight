'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { SavedResult } from '../types/emergency'
import Link from 'next/link'
import { AnalysisResults } from './analysis-results'

export function SavedResults() {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const results = JSON.parse(
      localStorage.getItem('savedResults') || '[]'
    ) as SavedResult[]
    setSavedResults(results)
  }, [])

  const deleteResult = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()

    const updatedResults = savedResults.filter((result) => result.id !== id)
    setSavedResults(updatedResults)
    localStorage.setItem('savedResults', JSON.stringify(updatedResults))
    if (expandedId === id) {
      setExpandedId(null)
    }
  }
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }
  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'Medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'Low':
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  if (savedResults.length === 0) {
    return null
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Saved Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {savedResults.map((result) => (
            <Card
              key={result.id}
              className="p-4"
              onClick={() => toggleExpand(result.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">
                  {result.probable_medical_conditions.join(', ')}
                </h3>
                <div className="flex items-center gap-2">
                  {getUrgencyIcon(result.urgency)}
                  <span className="text-sm font-medium capitalize">
                    {result.urgency} Urgency
                  </span>
                  {expandedId === result.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(result.timestamp).toLocaleString()}
              </p>
              {expandedId === result.id && (
                <div className="mt-4 space-y-2">
                  <AnalysisResults data={result} showDialog={false} />
                  {/* <p>
                    <strong>Actions:</strong> {result.action.join(', ')}
                  </p>
                  {result.what_to_avoid && (
                    <p>
                      <strong>What to avoid:</strong>{' '}
                      {result.what_to_avoid.join(', ')}
                    </p>
                  )}
                  <p>
                    <strong>Common symptoms:</strong>{' '}
                    {result.common_symptoms.join(', ')}
                  </p>
                  <p>
                    <strong>Precautions:</strong>{' '}
                    {result.precautions.join(', ')}
                  </p>
                  <p>
                    <strong>Relevant resources:</strong>{' '}
                    {result.relevant_resources.join(', ')}
                  </p> */}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => deleteResult(result.id, e)}
                className="mt-2"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
