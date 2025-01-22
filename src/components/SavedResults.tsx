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
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Saved Results</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4">
          {savedResults.map((result) => (
            <Card
              key={result.id}
              className="border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              onClick={() => toggleExpand(result.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-800">
                  {result.probable_medical_conditions.join(', ')}
                </h3>
                <div className="flex items-center gap-2">
                  {getUrgencyIcon(result.urgency)}
                  <span className="text-sm font-medium capitalize text-gray-600">
                    {result.urgency} Urgency
                  </span>
                  {expandedId === result.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(result.timestamp).toLocaleString()}
              </p>
              {expandedId === result.id && (
                <div className="mt-4 space-y-4 bg-blue-50 rounded-lg p-4">
                  <AnalysisResults data={result} showDialog={false} />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => deleteResult(result.id, e)}
                className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
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
