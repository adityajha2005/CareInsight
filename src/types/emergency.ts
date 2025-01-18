export interface AnalysisResult {
  probable_medical_conditions: string[]
  urgency: 'High' | 'Medium' | 'Low'
  action: string[]
  what_to_avoid?: string[]
  common_symptoms: string[]
  precautions: string[]
  relevant_resources: string[]
}

export interface SavedResult extends AnalysisResult {
  id: string
  timestamp: number
}
