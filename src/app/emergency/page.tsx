"use client"

import React, { useState } from 'react';
import { motion } from 'motion/react'
import { useRouter } from "next/navigation";
import { PhoneButton } from "@/components/PhoneButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Search, MapPin } from "lucide-react";

const spring_transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

const EmergencyContactsPage = () => {
  const router = useRouter();
  const [pincode, setPincode] = useState("");

  const handleSearch = () => {
    if (!pincode || pincode.length !== 6) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive",
      });
      return;
    }
    router.push(`/hospitals?pincode=${pincode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-center text-3xl font-semibold text-gray-800 mb-2">Indian Helplines</h1>
        <p className="text-center text-gray-600 font-inter pb-5">Find your help here.</p>

        {/* Search Hospitals Section */}
        <motion.div
          initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={spring_transition}
          className="mb-8"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 w-full md:w-1/2 mx-auto">
            <h2 className="text-2xl font-semibold text-teal-600 text-center mb-4">Find Nearby Hospitals</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="pl-10"
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

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
