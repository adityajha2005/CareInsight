'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProfileData {
  phone: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    phone: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    // Here you would typically save the data to your backend
    // For now, we'll just console.log it
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24">
                  {user?.imageUrl && (
                    <Image
                      src={user.imageUrl}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user?.fullName || 'Your Profile'}
                  </h1>
                  <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700">Basic Information</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Emergency contact information"
                    />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-700">Medical Information</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={profileData.bloodType}
                      onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Your blood type"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={profileData.allergies}
                      onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                      disabled={!isEditing}
                      placeholder="List any allergies"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Input
                      id="conditions"
                      value={profileData.medicalConditions}
                      onChange={(e) => setProfileData({...profileData, medicalConditions: e.target.value})}
                      disabled={!isEditing}
                      placeholder="List any medical conditions"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
