"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import WellnessProfile from "@/components/WellnessProfile";
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { FaPills, FaClipboardList, FaHistory, FaUser, FaCalendar, FaBell, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface ScheduleMedication {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescription_date: string;
}

interface UserProfile {
  name: string;
  avatar: string;
  lastCheckup: string;
  healthScore: number;
  nextAppointment: string;
}

interface HealthGoal {
  id: number;
  title: string;
  progress: number;
  target: number;
  unit: string;
}

interface EmergencyContact {
  id: number;
  name: string;
  relation: string;
  phone: string;
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
  

const quickActions = [
  { title: "Add Prescription", href: "/prescriptions", icon: <FaPills className="w-6 h-6" />, color: "bg-teal-500" },
  { title: "View All Prescriptions", href: "/prescriptions", icon: <FaClipboardList className="w-6 h-6" />, color: "bg-cyan-900" },
  { title: "Medical Profile", href: "/", icon: "👤", color: "bg-blue-500" },
  { title: "Emergency Contacts", href: "/emergency", icon: "📞", color: "bg-purple-500" },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    activePrescriptions: 0,
    upcomingRefills: 0
  });

  const [currentTip, setCurrentTip] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleMedication[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    avatar: "/avatar.png",
    lastCheckup: "2024-01-15",
    healthScore: 85,
    nextAppointment: "2024-02-01"
  });

  const [healthGoals] = useState<HealthGoal[]>([
    { id: 1, title: "Daily Steps", progress: 8000, target: 10000, unit: "steps" },
    { id: 2, title: "Water Intake", progress: 6, target: 8, unit: "glasses" },
    { id: 3, title: "Sleep", progress: 7, target: 8, unit: "hours" },
  ]);

  const [emergencyContacts] = useState<EmergencyContact[]>([
    { id: 1, name: "Jane Doe", relation: "Spouse", phone: "+1234567890" },
    { id: 2, name: "Dr. Smith", relation: "Primary Doctor", phone: "+1987654321" },
  ]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* User Profile Quick View */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
        >
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20">
              <Image
                src={userProfile.avatar}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{userProfile.name}</h2>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span>Last Checkup: {userProfile.lastCheckup}</span>
                <span>Health Score: {userProfile.healthScore}%</span>
                <span>Next Appointment: {userProfile.nextAppointment}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push('/profile')}
            >
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to CareInsight</h1>
          <p className="text-teal-100 text-lg">Your personal health companion</p>
          
          {/* Health Tip Card */}
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <h3 className="text-xl font-semibold">Daily Health Tip</h3>
            </div>
            <p className="mt-3 text-teal-50 animate-fade-in">
              {healthTips[currentTip]}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total Prescriptions", value: stats.totalPrescriptions, icon: <FaPills />, color: "from-teal-500" },
            { title: "Active Prescriptions", value: stats.activePrescriptions, icon: <FaClipboardList />, color: "from-cyan-500" },
            { title: "Upcoming Refills", value: stats.upcomingRefills, icon: <FaHistory />, color: "from-blue-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${stat.color} to-white/80 p-6`}>
                <div className="flex items-center gap-4">
                  <div className="text-white text-2xl">{stat.icon}</div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/90">{stat.title}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health Goals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaChartLine className="text-teal-500" />
            Health Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthGoals.map(goal => (
              <div key={goal.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">{goal.title}</span>
                  <span className="text-sm text-gray-500">{goal.progress}/{goal.target} {goal.unit}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medication Schedule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaPills className="text-teal-500" />
            Today's Medication Schedule
          </h2>
          <div className="space-y-4">
            {schedule.length > 0 ? schedule.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-teal-50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    {med.medication[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-lg">{med.medication}</div>
                    <div className="text-gray-500">{med.dosage} - {med.frequency}x daily</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium">
                    Next: {new Date().getHours() + index + 1}:00
                  </span>
                </div>
              </motion.div>
            )) : (
              <p className="text-gray-500 text-center py-8">No medications scheduled for today</p>
            )}
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <FaBell className="text-teal-500" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map(contact => (
              <div 
                key={contact.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-all duration-300"
              >
                <div>
                  <div className="font-medium text-gray-800">{contact.name}</div>
                  <div className="text-sm text-gray-500">{contact.relation}</div>
                </div>
                <a 
                  href={`tel:${contact.phone}`}
                  className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-200 transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                href={action.href}
                className={`${action.color} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-white`}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <div className="font-medium text-lg">{action.title}</div>
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