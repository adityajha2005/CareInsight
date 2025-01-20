import { NextResponse } from 'next/server'
import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY as string,
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    
    const response = await cohere.chat({
      message,
      model: 'command',
      preamble: `You are a helpful healthcare assistant. Provide concise, accurate information about health-related topics. Be supportive and professional.`,
      temperature: 0.7,
    })

    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process the chat request' },
      { status: 500 }
    )
  }
}
