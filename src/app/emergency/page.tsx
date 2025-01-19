"use client"

import React from 'react';

import { motion } from 'motion/react'

const spring_transition = {
  type: "spring",
  stiffness: 200, // Controls how tight the spring is
  damping: 30,    // Controls the resistance of the spring
  bounce: 0.5,    // Controls the amount of bounce (0 to 2 is common)
  duration: 0.6,  // Optional, spring usually ignores this unless combined
}

const PhoneButton = ({ number }: { number: string }) => {
  const cleanNumber = number.replace(/[^\d+]/g, '');
  return (
    <div className="flex items-center gap-2">
      <p>{number}</p>
      <a
        href={`tel:${cleanNumber}`}
        className="inline-flex items-center justify-center bg-primary text-white rounded-full p-2 hover:bg-primary/80 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </a>
    </div>
  );
};

const EmergencyContactsPage = () => {
  return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto md:p-8">
          <h1 className="text-center text-2xl md:text-5xl font-mono bold text-teal-600 pt-16 mb-8 md:leading-3">Indian Helplines</h1>
          <p className="text-center text-slate-600 pb-5">Find your help here.</p>
          <motion.div initial={{y: "100%", opacity: 0, filter: "blur(10px)"}} animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)"
          }} transition={spring_transition}>
            <div className="flex flex-col justify-center gap-8">
              <div
                  className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 w-full md:w-1/2 mx-auto hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 text-center mb-4">Hospitals</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>AIIMS Delhi</strong>
                    <PhoneButton number="011-26594404" />
                  </li>
                  <li>
                    <strong>Fortis Hospital, Bangalore</strong>
                    <PhoneButton number="080-66214444" />
                  </li>
                  <li>
                    <strong>Medanta - The Medicity, Gurgaon</strong>
                    <PhoneButton number="0124-4141414" />
                  </li>
                </ul>
              </div>

              {/* Paramedic Services */}
              <div
                  className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 w-full md:w-1/2 mx-auto hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 text-center mb-4">Paramedic Services</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>Delhi Ambulance Services</strong>
                    <PhoneButton number="102" />
                    <PhoneButton number="011-12345678" />
                  </li>
                </ul>
              </div>

              {/* First Responders */}
              <div
                  className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 w-full md:w-1/2 mx-auto hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 text-center mb-4">First Responders</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>Delhi Police</strong>
                    <PhoneButton number="100" />
                    <PhoneButton number="011-23456789" />
                  </li>
                  <li>
                    <strong>Delhi Fire Service</strong>
                    <PhoneButton number="101" />
                    <PhoneButton number="011-23456790" />
                  </li>
                </ul>
              </div>

              {/* Mental Health Services */}
              <div
                  className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 w-full md:w-1/2 mx-auto hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-semibold text-teal-600 text-center mb-4">Mental Health Services</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>Vandrevala Foundation Helpline</strong>
                    <p>Available 24/7</p>
                    <PhoneButton number="9999-666-555" />
                    <p>Website: <a href="https://www.vandrevalafoundation.com/" className="text-teal-600 hover:text-teal-800 hover:underline">Vandrevala Foundation</a></p>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
  );
};

export default EmergencyContactsPage;
