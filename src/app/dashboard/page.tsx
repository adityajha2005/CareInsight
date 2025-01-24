"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import WellnessProfile from "@/components/WellnessProfile";
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
interface ScheduleMedication {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescription_date: string;
}

const healthTips = [
    "Stay hydrated! Drink at least 8 glasses of water daily.",
    "Take a 5-minute break every hour to stretch.",
    "Regular exercise boosts your immune system!",
    "Good sleep is crucial for medication effectiveness.",
    "Eat a balanced diet rich in fruits and vegetables.",
    "Limit your screen time to reduce eye strain.",
    "Practice mindfulness or meditation for mental health.",
    "Wash your hands regularly to prevent infections.",
    "Avoid excessive caffeine or sugary drinks.",
    "Take the stairs instead of the elevator for extra activity.",
    "Schedule regular check-ups with your doctor.",
    "Wear sunscreen to protect your skin from UV damage.",
    "Maintain proper posture while sitting or working.",
    "Replace sugary snacks with healthier options like nuts or seeds.",
    "Avoid smoking and limit alcohol consumption.",
  ];
  

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    activePrescriptions: 0,
    upcomingRefills: 0
  });

  const [currentTip, setCurrentTip] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleMedication[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "prescriptions"));
        const total = querySnapshot.docs.length;
        const today = new Date();
        
        const active = querySnapshot.docs.filter(doc => {
          const data = doc.data();
          const endDate = new Date(data.prescription_date);
          endDate.setDate(endDate.getDate() + parseInt(data.duration));
          return endDate >= today;
        }).length;

        setStats({
          totalPrescriptions: total,
          activePrescriptions: active,
          upcomingRefills: Math.floor(active * 0.3) 
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % healthTips.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTodaySchedule = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "prescriptions"));
        const today = new Date();
        const todayMeds = querySnapshot.docs
          .map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          } as ScheduleMedication))
          .filter(med => {
            const startDate = new Date(med.prescription_date);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + parseInt(med.duration));
            return today >= startDate && today <= endDate;
          })
          .slice(0, 3); // Show only top 3 medications
        setSchedule(todayMeds);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchTodaySchedule();
  }, []);

  const quickActions = [
    { title: "Add Prescription", href: "/prescriptions", icon: "➕" },
    { title: "View All Prescriptions", href: "/prescriptions", icon: "📋" },
    { title: "Medical Profile", href: "/profile", icon: "👤" },
    { title: "Emergency Contacts", href: "/contacts", icon: "📞" },
  ];
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Welcome to CareInsight
          </h1>
          <div className="relative mt-6 p-4 bg-white rounded-xl shadow-md border border-teal-100">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-sm">
              Daily Health Tip
            </div>
            <p className="text-gray-600 mt-2 animate-fade-in">
              {healthTips[currentTip]}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
            <div className="text-4xl font-bold text-teal-600 mb-2">{stats.totalPrescriptions}</div>
            <div className="text-gray-600">Total Prescriptions</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
            <div className="text-4xl font-bold text-cyan-600 mb-2">{stats.activePrescriptions}</div>
            <div className="text-gray-600">Active Prescriptions</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.upcomingRefills}</div>
            <div className="text-gray-600">Upcoming Refills</div>
          </div>
        </div>

        {/* Wellness Profile */}
        <WellnessProfile />

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📅</span> Today's Medication Schedule
          </h2>
          <div className="space-y-4">
            {schedule.length > 0 ? schedule.map((med, index) => (
              <div key={med.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                    {med.medication[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-800">{med.medication}</div>
                    <div className="text-sm text-gray-500">{med.dosage} - {med.frequency}x daily</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                    Next dose: {new Date().getHours() + index + 1}:00
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center">No medications scheduled for today</p>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                href={action.href}
                className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <div className="font-medium text-gray-800">{action.title}</div>
              </Link>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Dashboard;