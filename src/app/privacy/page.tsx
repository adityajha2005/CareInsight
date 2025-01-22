'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-[9vh]">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Collection and Use</h2>
            <p>We collect and process the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information you provide directly to us</li>
              <li>Usage data and analytics</li>
              <li>Prescription images (temporarily stored for analysis)</li>
              <li>Cookie and device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Protection</h2>
            <p>We implement appropriate security measures to protect your personal information. All prescription images are encrypted and automatically deleted after analysis.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Third-Party Services</h2>
            <p>We may use third-party services for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analytics and performance monitoring</li>
              <li>AI-powered image analysis</li>
              <li>Email communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request data deletion</li>
              <li>Opt-out of communications</li>
              <li>Request data portability</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
