'use client'

import { Card } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Phone, AlertTriangle, Star, Download, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { SavedResult } from '@/types/emergency'

export interface AnalysisResult {
  probable_medical_conditions: string[]
  urgency: 'High' | 'Medium' | 'Low'
  action: string[]
  what_to_avoid?: string[]
  common_symptoms: string[]
  precautions: string[]
  relevant_resources: string[]
}

const translations = {
  english: {
    conditions: "Probable Medical Condition(s)",
    urgencyLevel: "Urgency Level",
    saveResult: "Save Result",
    emergencyActions: "Emergency Actions",
    emergencyDetected: "Emergency Situation Detected",
    immediateAttention: "This situation requires immediate attention. Please consider the following actions:",
    recommendedActions: "Recommended Actions",
    whatToAvoid: "What to Avoid",
    commonSymptoms: "Common Symptoms",
    precautions: "Precautions",
    relevantResources: "Relevant Resources",
    highPriority: "High Priority",
    mediumPriority: "Medium Priority",
    lowPriority: "Low Priority",
    iUnderstand: "I understand",
    callEmergency: "Call Emergency",
    suicidePrevention: "National Suicide Prevention Lifeline",
    domesticViolence: "National Domestic Violence Hotline",
    resultSaved: "Result saved successfully!"
  },
  hindi: {
    conditions: "संभावित चिकित्सीय स्थिति",
    urgencyLevel: "तात्कालिकता स्तर",
    saveResult: "परिणाम सहेजें",
    emergencyActions: "आपातकालीन कार्रवाई",
    emergencyDetected: "आपातकालीन स्थिति का पता चला",
    immediateAttention: "इस स्थिति में तत्काल ध्यान देने की आवश्यकता है। कृपया निम्नलिखित कार्रवाई पर विचार करें:",
    recommendedActions: "अनुशंसित कार्रवाई",
    whatToAvoid: "क्या न करें",
    commonSymptoms: "सामान्य लक्षण",
    precautions: "सावधानियां",
    relevantResources: "प्रासंगिक संसाधन",
    highPriority: "उच्च प्राथमिकता",
    mediumPriority: "मध्यम प्राथमिकता",
    lowPriority: "कम प्राथमिकता",
    iUnderstand: "मैं समझता/समझती हूं",
    callEmergency: "आपातकालीन कॉल करें",
    suicidePrevention: "राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन",
    domesticViolence: "राष्ट्रीय घरेलू हिंसा हेल्पलाइन",
    resultSaved: "परिणाम सफलतापूर्वक सहेजा गया!"
  }
};

interface AnalysisResultsProps {
  data: AnalysisResult
  showDialog: boolean
  language?: 'english' | 'hindi'
}

export function AnalysisResults({ data, showDialog, language = 'english' }: AnalysisResultsProps) {
  const t = translations[language];
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)
  const [previousUrgency, setPreviousUrgency] = useState<string | null>(null)

  useEffect(() => {
    setShowEmergencyDialog(false)
    if (
      (data.urgency === 'High' || data.urgency === 'Medium') &&
      data.urgency !== previousUrgency
    ) {
      setShowEmergencyDialog(showDialog)
    }
  }, [data.urgency, previousUrgency])

  const saveResult = () => {
    if (data) {
      const savedResults = JSON.parse(
        localStorage.getItem('savedResults') || '[]'
      ) as SavedResult[]

      const newSavedResult: SavedResult = {
        ...data,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      savedResults.push(newSavedResult)
      localStorage.setItem('savedResults', JSON.stringify(savedResults))
      alert(t.resultSaved)
    }
  }

  const getUrgencyStyles = () => {
    switch (data.urgency) {
      case 'High':
        return 'bg-red-50 border-red-200'
      case 'Medium':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-white'
    }
  }

  const formatBoldText = (text: string) => {
    // Split the text on **...** and map to JSX
    return text.split(/\*\*(.*?)\*\*/).map((part, index) =>
      index % 2 === 1 ? (
        <span key={index} className="font-medium">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <>
      <Card className={`p-6 mt-6 ${getUrgencyStyles()}`}>
        <h2 className="text-xl font-semibold mb-4 flex">
          {t.conditions}: {data.probable_medical_conditions.join(', ')}
          <Button variant="outline" size="sm" onClick={saveResult}>
            <Save className="w-4 h-4 mr-2" />
            {t.saveResult}
          </Button>
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">{t.urgencyLevel}</h3>
            <Alert
              variant={
                data.urgency === 'High'
                  ? 'destructive'
                  : data.urgency === 'Medium'
                  ? 'warning'
                  : 'default'
              }
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {data.urgency === 'High' ? t.highPriority :
                   data.urgency === 'Medium' ? t.mediumPriority : t.lowPriority}
                </AlertDescription>
              </div>
            </Alert>
          </div>
          {data.urgency === 'High' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="mt-2">
                  {t.emergencyActions}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-red-100">
                <DialogHeader>
                  <DialogTitle>{t.emergencyDetected}</DialogTitle>
                  <DialogDescription>{t.immediateAttention}</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Button
                    variant="destructive"
                    onClick={() => (window.location.href = 'tel:100')}
                  >
                    {t.callEmergency}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      (window.location.href = 'tel:1-800-273-8255')
                    }
                  >
                    {t.suicidePrevention}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      (window.location.href = 'tel:1-800-799-7233')
                    }
                  >
                    {t.domesticViolence}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <div>
            <h3 className="font-semibold mb-2">{t.recommendedActions}</h3>
            <ul className="list-disc pl-5 space-y-1">
              {data.action.map((action, index) => (
                <li key={index}>{formatBoldText(action)}</li>
              ))}
            </ul>
          </div>

          {data.what_to_avoid && data.what_to_avoid.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">{t.whatToAvoid}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {data.what_to_avoid.map((precaution, index) => (
                  <li key={index}>{formatBoldText(precaution)}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">{t.commonSymptoms}</h3>
            <ul className="list-disc pl-5 space-y-1">
              {data.common_symptoms.map((symptom, index) => (
                <li key={index}>{formatBoldText(symptom)}</li>
              ))}
            </ul>
          </div>

          {data.precautions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">{t.precautions}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {data.precautions.map((precaution, index) => (
                  <li key={index}>{formatBoldText(precaution)}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">{t.relevantResources}</h3>
            <ul className="list-disc pl-5 space-y-1">
              {data.relevant_resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {new URL(resource).hostname}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <AlertDialog
        open={showEmergencyDialog}
        onOpenChange={setShowEmergencyDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {data.urgency === 'High'
                ? t.emergencyDetected
                : t.immediateAttention}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {data.urgency === 'High'
                ? t.immediateAttention
                : 'Your symptoms suggest you should seek medical attention soon.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2">
            {data.urgency === 'High' && (
              <div className="flex-col space-y-2">
                <Button
                  variant="destructive"
                  className="w-80"
                  onClick={() => (window.location.href = 'tel:100')}
                >
                  {t.callEmergency}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = 'tel:1-800-273-8255')}
                >
                  {t.suicidePrevention}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = 'tel:1-800-799-7233')}
                >
                  {t.domesticViolence}
                </Button>
              </div>
            )}
          </AlertDialogFooter>
          <AlertDialogAction onClick={() => setShowEmergencyDialog(false)}>
            {t.iUnderstand}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
