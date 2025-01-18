import { NextResponse } from 'next/server'
import { generateText, tool } from 'ai'
import { createVertex } from '@ai-sdk/google-vertex'
import { createCohere } from '@ai-sdk/cohere'

const cohere = createCohere({
  baseURL: 'https://api.cohere.com/v2/',
  apiKey: process.env.COHERE_API_KEY,
})
// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export async function POST(req: Request) {
  const { prompt } = await req.json()

  try {
    const result = await generateText({
      model: cohere('command-r-08-2024'),
      prompt: `Provide critical medical information based on the symptoms and description provided. Use **simple, easy-to-understand language** with a focus on being concise, actionable, and helpful. Address the user directly using "you" but avoid starting sentences with "you." Begin sentences with verbs, and keep instructions practical and precise.

**Important Guidelines:**
1. Use **first-person language** and keep the tone supportive.
2. Adhere strictly to the **JSON output format**.
3. Include a maximum of **3 probable medical conditions** (use layman's terms).
4. Ensure the actions and precautions are easy to follow and no more than **8 points** in total. Highlight critical words with **bold formatting**.
5. Avoid lengthy sentences and unnecessary medical jargon.
6. Use reliable and **relevant resources** with links to trusted sites (e.g., Mayo Clinic, NHS, CDC).

**Desired Output Format (JSON):**
{
  "probable_medical_conditions": [<array of maximum 1-3 conditions, easy to understand>],
  "urgency": <"high", "medium", or "low">,
  "action": [<array of up to 8 actionable steps, short and concise. Highlight important words with **bold formatting**>],
  "what_to_avoid": [<array of 2-5 points related to what to avoid>],
  "common_symptoms": [<array of 2-5 common symptoms>],
  "precautions": [<array of 2-5 general precautions>],
  "relevant_resources": [<array of 2-3 trusted links related to the condition>]
}

**Example Input:**  
Symptoms: Chest pain, nausea, vomiting  
Description: I'm feeling short of breath  

**Example Output:**  
{
  "probable_medical_conditions": ["Heart Attack", "Angina", "Gastroesophageal Reflux Disease (GERD)"],
  "urgency": "High",
  "action": [
    "Call emergency services immediately (e.g., 911). Do not attempt to drive yourself.",
    "Chew a full-strength **aspirin** (if not allergic) while waiting for help.",
    "Sit upright to reduce pressure on your chest and remain calm.",
    "Unlock doors and notify someone nearby if possible.",
    "Stop all activity immediately and rest comfortably.",
    "Perform CPR if unconscious and trained, or instruct someone nearby to do so."
  ],
  "what_to_avoid": [
    "Avoid lying down flat.",
    "Do not ignore symptoms or delay seeking help."
  ],
  "common_symptoms": [
    "Chest pain or tightness",
    "Shortness of breath",
    "Cold sweat",
    "Nausea",
    "Lightheadedness"
  ],
  "precautions": [
    "Maintain a heart-healthy diet.",
    "Exercise regularly as recommended by your doctor.",
    "Avoid smoking and excessive alcohol consumption."
  ],
  "relevant_resources": [
    "https://www.mayoclinic.org/first-aid/first-aid-heart-attack/basics/art-20056679",
    "https://www.nhs.uk/conditions/heart-attack/",
    "https://www.heart.org/en/health-topics/heart-attack"
  ]
}

**Input Fields:**  
- **Symptoms**: Comma-separated list of symptoms.  
- **Description**: Free-text description of how the user is feeling.

**Ensure that:**
- The information is concise, actionable, and fits the format.
- Always prioritize **safety** and **urgency** in medical emergencies.
- Use **simple language** and **clear instructions**.
- No need to include ** in the output and bold the important keywords.
} 
  Situation: ${prompt}`,
      // prompt: `Given the following situation, analyze it and provide an output in JSON format with an urgency level (high, medium, or low) and a description. Situation: I have cough cold and high fever`,
      temperature: 0.3,
    })

    // Parse the JSON from the result
    console.log(replaceInvalidChar(result.text))
    console.log('*********')
    const parsedResult = JSON.parse(replaceInvalidChar(result.text))
    console.log('*********')
    console.log(parsedResult)

    return NextResponse.json(parsedResult)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    )
  }
}

function replaceInvalidChar(text: string) {
  return text.replace(/[“”]/g, '"')
}
