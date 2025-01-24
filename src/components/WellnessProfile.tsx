"use client";
import React, { useState, useEffect } from 'react';
import { db } from "../app/firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

interface WellnessData {
  height: number;
  weight: number;
  age: number;
  gender: string;
  goal: string;
  activityLevel: string;
}

const WellnessProfile = () => {
  const [showForm, setShowForm] = useState(false);
  const [wellnessData, setWellnessData] = useState<WellnessData>({
    height: 0,
    weight: 0,
    age: 0,
    gender: '',
    goal: '',
    activityLevel: 'moderate'
  });

  useEffect(() => {
    const fetchWellnessData = async () => {
      try {
        const docRef = doc(db, "wellness", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWellnessData(docSnap.data() as WellnessData);
        }
      } catch (error) {
        console.error("Error fetching wellness data:", error);
      }
    };

    fetchWellnessData();
  }, []);

  const calculateBMI = () => {
    const heightInMeters = wellnessData.height / 100;
    return (wellnessData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateDailyCalories = () => {
    // Basic BMR calculation using Harris-Benedict equation
    const bmr = wellnessData.gender === 'male' 
      ? 88.362 + (13.397 * wellnessData.weight) + (4.799 * wellnessData.height) - (5.677 * wellnessData.age)
      : 447.593 + (9.247 * wellnessData.weight) + (3.098 * wellnessData.height) - (4.330 * wellnessData.age);

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const dailyCalories = bmr * activityMultipliers[wellnessData.activityLevel as keyof typeof activityMultipliers];

    // Adjust based on goal
    switch (wellnessData.goal) {
      case 'lose': return dailyCalories - 500;
      case 'gain': return dailyCalories + 500;
      default: return dailyCalories;
    }
  };

  const getBMICategory = () => {
    const bmi = Number(calculateBMI());
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getChartData = () => {
    const dailyCalories = calculateDailyCalories();
    
    const macrosPieData = {
      labels: ['Protein', 'Carbs', 'Fats'],
      datasets: [{
        data: [
          dailyCalories * 0.3, // 30% protein
          dailyCalories * 0.5, // 50% carbs
          dailyCalories * 0.2, // 20% fats
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    };

    const weeklyProgressData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Calories Burned',
        data: [2200, 2300, 2100, 2400, 2000, 1900, 2150],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      }],
    };

    return { macrosPieData, weeklyProgressData };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "wellness", "profile"), wellnessData);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving wellness profile:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <span className="mr-2">💪</span> Wellness Profile
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          {showForm ? 'Close' : 'Update Profile'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={wellnessData.height || ''}
                onChange={(e) => setWellnessData({...wellnessData, height: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                required
                min="0"
                max="300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={wellnessData.weight || ''}
                onChange={(e) => setWellnessData({...wellnessData, weight: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                required
                min="0"
                max="500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={wellnessData.age || ''}
                onChange={(e) => setWellnessData({...wellnessData, age: Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                required
                min="0"
                max="150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={wellnessData.gender}
                onChange={(e) => setWellnessData({...wellnessData, gender: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
              <select
                value={wellnessData.goal}
                onChange={(e) => setWellnessData({...wellnessData, goal: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                required
              >
                <option value="">Select goal</option>
                <option value="lose">Weight Loss</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Build Muscle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
              <select
                value={wellnessData.activityLevel}
                onChange={(e) => setWellnessData({...wellnessData, activityLevel: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                required
              >
                <option value="sedentary">Sedentary (office job)</option>
                <option value="light">Light Exercise</option>
                <option value="moderate">Moderate Exercise</option>
                <option value="active">Active Exercise</option>
                <option value="veryActive">Very Active</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300"
          >
            Save Profile
          </button>
        </form>
      ) : (
        wellnessData.weight > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-teal-700">{calculateBMI()}</div>
                <div className="text-sm text-gray-600">BMI</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-teal-700">{Math.round(calculateDailyCalories())}</div>
                <div className="text-sm text-gray-600">Daily Calories</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-teal-700">{Math.round(wellnessData.weight * 0.033 * 1000)}ml</div>
                <div className="text-sm text-gray-600">Daily Water</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-teal-700">7,000</div>
                <div className="text-sm text-gray-600">Daily Steps Goal</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="p-4 bg-white rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Macronutrient Distribution</h3>
                <div className="h-64">
                  <Pie data={getChartData().macrosPieData} options={{
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} />
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-md md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: ['Current', 'Goal'],
                      datasets: [{
                        label: 'Weight (kg)',
                        data: [
                          wellnessData.weight,
                          wellnessData.goal === 'lose' 
                            ? wellnessData.weight * 0.9 
                            : wellnessData.goal === 'gain' 
                              ? wellnessData.weight * 1.1 
                              : wellnessData.weight
                        ],
                        backgroundColor: [
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                        ],
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>

              <div className="md:col-span-2 p-4 bg-white rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Health Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
                    <p className="text-sm text-gray-600">BMI Category</p>
                    <p className="text-lg font-semibold text-teal-700">{getBMICategory()}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
                    <p className="text-sm text-gray-600">Daily Protein Goal</p>
                    <p className="text-lg font-semibold text-teal-700">
                      {Math.round(calculateDailyCalories() * 0.3 / 4)}g
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weekly Activity Goal</p>
                    <p className="text-lg font-semibold text-teal-700">
                      {wellnessData.activityLevel === 'active' ? '5-6' : '3-4'} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default WellnessProfile;
