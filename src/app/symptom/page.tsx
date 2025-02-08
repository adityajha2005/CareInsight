'use client'
import React, { useState , useEffect} from 'react'
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
import { motion } from 'framer-motion'
// import { useauth } from '@clerk/nextjs/server'
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs'

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
  const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.replace('/sign-in');
      }
    }, [isLoaded, isSignedIn, router]);
  
    if (!isLoaded || !isSignedIn) {
      return null; // or a small spinner
    }
  
  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    try {
      const base64Data = base64Image.split(',')[1];
      const trimmedDescription = description.slice(0, 250); // Reduced from 500 to 250
      
      const completion = await openai.chat.completions.create({
        model: "x-ai/grok-2-vision-1212",
        temperature: 0.7,
        top_p: 1,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Brief medical analysis and no bold text , and start 1line about which disease is this, then 2-3 lines about it then cure:" }, 
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Data}` }
              },
              { type: "text", text: trimmedDescription }
            ]
          }
        ]
      });

      setAnalysis(completion.choices?.[0]?.message?.content || 'No analysis available');
    } catch (error: any) {
      setAnalysis(error.response?.data?.code === 402
        ? "Insufficient credits. Please upgrade plan at openrouter.ai/credits"
        : `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white ">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Medical Image Analysis</h1>
            <p className="text-gray-600 font-inter">Upload your medical images for instant AI-powered analysis</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/80">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-gray-700 text-sm font-medium">
                      Describe Your Symptoms (Optional)
                    </label>
                    <Textarea
                      placeholder="Please describe your symptoms in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[120px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg transition-colors"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-gray-700 text-sm font-medium">
                      Upload Medical Reports/X-rays
                    </label>
                    <div className="p-6 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                      <FileUpload
                        onChange={(files) => handleFileUpload(files)}
                      />
                    </div>
                    {uploadStatus && (
                      <p className={`text-sm ${uploadStatus.includes('failed') ? 'text-red-500' : 'text-emerald-600'}`}>
                        {uploadStatus}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-200 ${loading || !imageUrl ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading || !imageUrl}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Spinner className="mr-2" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      'Analyze Image'
                    )}
                  </Button>
                </form>

                {analysis && (
                  <motion.div 
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="mt-8"
                  >
                    <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
                      <div className="prose prose-blue max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{analysis}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default symptom