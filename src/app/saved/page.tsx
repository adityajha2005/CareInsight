'use client';
import { motion } from 'framer-motion';
import { SavedResults } from '@/components/SavedResults';
import { SignInButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';

export default function Page() {
  const { isSignedIn } = useAuth(); // Client-side hook to check if the user is signed in
  
  if (!isSignedIn) {
    return (
      <div>
        <h1>You need to sign in to access this page</h1>
        <SignInButton /> {/* Or you can redirect them to sign-in */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mt-[9vh]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Saved Analysis Results</h1>
            <p className="text-gray-600 font-inter">View and manage your previous medical analysis results (don't clear the browser cache)</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SavedResults />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
