'use client';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Medical Disclaimer</h1>
        
        <div className="space-y-6 text-gray-600">
          <section className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="font-medium text-yellow-800">
              The information provided by CareInsight is for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Not Medical Advice</h2>
            <p>Our AI-powered analysis and medical information database should not be used to make medical decisions without consulting healthcare professionals.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Emergency Situations</h2>
            <p>In case of medical emergency, immediately contact emergency services or visit the nearest healthcare facility.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
            <p>We make no warranties or representations about the accuracy or completeness of the information provided through our services.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
