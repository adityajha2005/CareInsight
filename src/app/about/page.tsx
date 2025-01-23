'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Heart, Brain, Shield } from 'phosphor-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            About CareInsight
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Empowering healthcare decisions with AI technology and making medical information accessible to everyone.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { number: '1000+', label: 'Diseases Cataloged' },
            { number: '24/7', label: 'AI Assistance' },
            { number: '99%', label: 'Accuracy Rate' },
            { number: '50K+', label: 'Users Helped' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          className="mb-16"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Our Mission</h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <p className="text-gray-600 text-lg leading-relaxed text-center">
              CareInsight aims to bridge the gap between complex medical information and public understanding. 
              We leverage cutting-edge AI technology to make healthcare knowledge more accessible while supporting 
              the invaluable role of healthcare professionals.
            </p>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="mb-16"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Disease Catalogue",
                description: "Comprehensive database of medical conditions with detailed information about treatments and management.",
                icon: <Brain size={32} weight="duotone" className="text-blue-600" />
              },
              {
                title: "Prescription Analysis",
                description: "AI-powered tool to help understand prescription details and important medical information.",
                icon: <GraduationCap size={32} weight="duotone" className="text-blue-600" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-blue-600 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart size={32} weight="duotone" className="text-blue-600" />,
                title: "User-Centric",
                description: "Putting users' needs first in everything we do"
              },
              {
                icon: <Shield size={32} weight="duotone" className="text-blue-600" />,
                title: "Privacy-Focused",
                description: "Ensuring the security and privacy of your medical data"
              },
              {
                icon: <Brain size={32} weight="duotone" className="text-blue-600" />,
                title: "Innovation-Driven",
                description: "Continuously improving our AI technology"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
