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

const EmergencyContactsPage = () => {
  return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto md:p-8">
          <h1 className="text-center text-2xl md:text-5xl font-mono bold text-primary mb-8 md:leading-3">Indian Helplines</h1>
          <p className="text-center pb-5">Find your help here.</p>
          <motion.div initial={{y: "100%", opacity: 0, filter: "blur(10px)"}} animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)"
          }} transition={spring_transition}>
            <div className="flex flex-col justify-center gap-8">
              <div
                  className="bg-card text-text p-6 rounded-lg shadow-lg border-2 border-gray-500 w-full md:w-1/2 mx-auto">
                <h2 className="text-2xl font-semibold text-primary text-center mb-4">Hospitals</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>AIIMS Delhi</strong>
                    <p>Emergency Department: 011-26594404</p>
                  </li>
                  <li>
                    <strong>Fortis Hospital, Bangalore</strong>
                    <p>Emergency Department: 080-66214444</p>
                  </li>
                  <li>
                    <strong>Medanta - The Medicity, Gurgaon</strong>
                    <p>Emergency Department: 0124-4141414</p>
                  </li>
                </ul>
              </div>

              {/* Paramedic Services */}
              <div
                  className="bg-card text-text p-6 rounded-lg shadow-lg border-2 border-gray-500 w-full md:w-1/2 mx-auto">
                <h2 className="text-2xl font-semibold text-primary text-center mb-4">Paramedic Services</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>Delhi Ambulance Services</strong>
                    <p>Emergency Medical Services: 102</p>
                    <p>Non-Emergency Inquiries: 011-12345678</p>
                  </li>
                </ul>
              </div>

              {/* First Responders */}
              <div
                  className="bg-card text-text p-6 rounded-lg shadow-lg border-2 border-gray-500 w-full md:w-1/2 mx-auto">
                <h2 className="text-2xl font-semibold text-primary text-center mb-4">First Responders</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>Delhi Police</strong>
                    <p>Emergency: 100</p>
                    <p>Non-Emergency: 011-23456789</p>
                  </li>
                  <li>
                    <strong>Delhi Fire Service</strong>
                    <p>Emergency: 101</p>
                    <p>Non-Emergency: 011-23456790</p>
                  </li>
                </ul>
              </div>

              {/* Mental Health Services */}
              <div
                  className="bg-card text-text p-6 rounded-lg shadow-lg border-2 border-gray-500 w-full md:w-1/2 mx-auto">
                <h2 className="text-2xl font-semibold text-primary text-center mb-4">Mental Health Services</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>Vandrevala Foundation Helpline</strong>
                    <p>Available 24/7</p>
                    <p>Contact: 9999-666-555</p>
                    <p>Website: <a href="https://www.vandrevalafoundation.com/" className="text-link">Vandrevala Foundation</a></p>
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
