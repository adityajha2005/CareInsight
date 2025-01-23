'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using CareInsight, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
            <p>CareInsight provides AI-powered medical information and prescription analysis tools. Our services are intended for informational purposes only and should not replace professional medical advice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Use the service in compliance with applicable laws</li>
              <li>Not misuse or attempt to manipulate our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Medical Disclaimer</h2>
            <p>The information provided through our service is for general informational purposes only. Always consult with qualified healthcare professionals for medical advice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at legal@careinsight.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
