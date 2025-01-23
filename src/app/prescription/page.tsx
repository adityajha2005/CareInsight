'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
export default function PrescriptionPage() {
  
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  const handleSubmit = async () => {
    if (!imageUrl) {
      setError('Please enter an image URL');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4  sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Prescription Analysis</h1>
          <p className="text-sm sm:text-base text-gray-600">Upload a prescription image to extract information</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong className="font-medium">Important Notice:</strong> This prescription analysis tool is in beta testing 
                and is provided for demonstration purposes only. The AI model's results may be inaccurate or incomplete. 
                Do not use this tool for medical decisions. Always consult qualified healthcare professionals and rely on 
                official prescription documents for medical information.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription Image URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter the URL of the prescription image"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Analyze'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {(imageUrl || result) && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6"
          >
            {imageUrl && (
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Image Preview</h3>
                <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={imageUrl}
                    alt="Prescription"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Analysis Results</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 overflow-auto max-h-[400px]">{result}</pre>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}