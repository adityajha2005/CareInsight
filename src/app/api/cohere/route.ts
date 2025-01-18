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
      prompt: `Provide critical information for a medical emergency or general situation based on the symptoms and description provided. Use first person. Use simple words and simple vocabulary. Adhere strictly to the output format instructions and ensure the information is concise and actionable. Use "you" directly, but avoid starting sentences with "you." Begin sentences with verbs. Follow the instructions meticulously.

Desired output format in json:
{
probable_medical_conditions: <array of maximum 1-3 conditions, easy to understand>,
urgency: <one of these 3: high, medium, low>,
action: <array of actions you should take, no more than 8 points. Use simple vocabulary and not longer sentences. Bold important keywords.>,
what_to_avoid: <array of maximum 2-5 related to what to avoid>,
common_symptoms: <array of symptoms at most 5 and at least 2>,
precautions: <array of 2-5 precautions>,
relevant_resources: <array of relevant links related to condition>,
}

Input: 
Symptoms: <comma_separated_list_of_symptoms>
Description: <user's feelings as a string>

Example Input: Symptoms: Chest pain, nausea, vomiting
Description: I'm feeling short of breath

Example Output:
{
  “probable_medical_conditions": ["Heart Attack", "Cardiac Arrest"],
  “urgency": "High",
  “action": [
    "Call emergency services (100 in the US) immediately. Do not drive yourself to the hospital.",
    "Chew and swallow an aspirin (if not allergic) while waiting for help. This can help thin your blood.",
    "Sit down and try to remain calm. Loosen any tight clothing.",
    "Unlock the door if alone, so emergency responders can enter easily.",
    "Stop all activity and rest in a comfortable position, typically sitting up.",
    "Take nitroglycerin as prescribed by your doctor, if applicable.",
    "Perform CPR immediately if you become unconscious and stop breathing, if someone is trained to do so."
  ],
  “what_to_avoid": [],
  “common_symptoms": [
    "Chest pain/pressure",
    "Arm, back, neck, jaw pain",
    "Shortness of breath",
    "Cold sweat",
    "Nausea",
    "Lightheadedness"
  ],
  “precautions": [],
  “relevant_resources": [
    "https://www.mayoclinic.org/first-aid/first-aid-heart-attack/basics/art-20056679",
    "https://www.healthxchange.sg/heart-lungs/heart-attack/how-to-survive-a-heart-attack-when-alone",
    "https://firstaidforlife.org.uk/heart-attack-on-your-own/"
  ],
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
