'use client'
import React, { useState } from 'react'
import OpenAI from "openai"
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPEN_ROUTER_GROK_API,
  dangerouslyAllowBrowser: true ,
  defaultHeaders: {
    "HTTP-Referer": "https://care-insight.vercel.app",
    "X-Title": "CareInsight"
  }
});

const symptom = () => {
  const [description, setDescription] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    try {
      console.log("Request data:", {
        model: "x-ai/grok-2-vision-1212",
        temperature: 1,
        top_p: 1,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this medical image..."
              },
              {
                type: "image_url",
                image_url: { url: "<PUBLIC_IMAGE_URL>" }
              },
              {
                type: "text",
                text: description
              }
            ]
          }
        ]
      });
      const completion = await openai.chat.completions.create({
        model: "x-ai/grok-2-vision-1212",
        temperature: 1,
        top_p: 1,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this medical image..."
              },
              {
                type: "image_url",
                image_url: { url: "<PUBLIC_IMAGE_URL>" }
              },
              {
                type: "text",
                text: description
              }
            ]
          }
        ]
      });
      console.log("Full completion response:", completion);
  
      const analysisResult = completion.choices?.[0]?.message?.content;
      if (!analysisResult) {
        console.error('Analysis result is undefined or empty. Debugging details:');
        console.log('completion.choices:', completion.choices);
        console.log('First choice:', completion.choices?.[0]);
        console.log('Message in first choice:', completion.choices?.[0]?.message);
    
        throw new Error('No analysis results in response');
      }
  
      console.log('Successfully retrieved analysis result:', analysisResult);
  setAnalysis(analysisResult);
} catch (error: any) {
  if (error.response?.data?.code === 402) {
    setAnalysis("Insufficient credits. Please visit https://openrouter.ai/credits to upgrade your plan.");
  } else {
    setAnalysis(`Error: ${error.message}`);
  }
} finally {
  setLoading(false);
} };
  

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setUploadStatus('File uploaded successfully');
      };

      reader.onerror = () => {
        setUploadStatus('Failed to read file');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrl) {
      await analyzeImage(imageUrl)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Medical Image Analysis</h1>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Describe Your Symptoms (Optional)
              </label>
              <Textarea
                placeholder="Please describe your symptoms in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Upload Medical Reports/X-rays
              </label>
              <FileUpload
                onChange={(files) => handleFileUpload(files)}
              />
              {uploadStatus && (
                <p className={`mt-2 text-sm ${uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {uploadStatus}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading || !imageUrl}>
              {loading ? <Spinner className="mr-2" /> : null}
              Analyze Image
            </Button>
          </form>

          {analysis && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Analysis Results</h2>
              <p className="whitespace-pre-wrap">{analysis}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default symptom