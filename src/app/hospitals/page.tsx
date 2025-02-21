"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, Hospital, ArrowLeft, Phone } from "lucide-react";
import {
  getPincodeCoordinates,
  getHospitalsNearby,
  formatHospitalData,
} from "../../lib/openstreetmap";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface Hospital {
  id: string;
  name: string;
  distance: number;
  address: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

function HospitalSkeleton() {
  return (
    <div className="group p-6 rounded-xl border bg-card animate-pulse">
      <div className="space-y-4">
        <div className="h-7 bg-muted-foreground/20 rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
          <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-muted-foreground/20 rounded w-24" />
          <div className="w-24 h-9 bg-muted-foreground/20 rounded" />
        </div>
      </div>
    </div>
  );
}

function HospitalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pincode = searchParams.get("pincode");
    if (!pincode) {
      router.push("/");
      return;
    }

    const fetchHospitals = async () => {
      try {
        const coordinates = await getPincodeCoordinates(pincode);
        if (!coordinates) {
          toast({
            title: "Error",
            description: "Could not find coordinates for the pincode",
            variant: "destructive",
          });
          router.push("/");
          return;
        }

        const nearbyHospitals = await getHospitalsNearby(coordinates);
        const formattedHospitals = nearbyHospitals.map((hospital) =>
          formatHospitalData(hospital, coordinates.lat, coordinates.lon)
        );
        setHospitals(formattedHospitals);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast({
          title: "Error",
          description: "Failed to fetch hospitals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [searchParams, router]);

  const handleChatClick = (hospitalId: string) => {
    router.push(`/auth?hospital=${hospitalId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <HospitalSkeleton />
        <HospitalSkeleton />
        <HospitalSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hospitals.map((hospital, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          key={hospital.id}
          className="group p-6 rounded-xl border bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-teal-50 rounded-full opacity-20" />
          <div className="relative">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{hospital.name}</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="h-4 w-4 text-teal-600" />
              <span className="text-sm">{hospital.address}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-x-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-1"
                >
                  <MapPin className="h-4 w-4" />
                  View on map
                </a>
                <span className="text-sm text-gray-500">
                  {hospital.distance.toFixed(1)} km away
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-teal-600 border-teal-200 hover:bg-teal-50"
                  onClick={() => handleChatClick(hospital.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function HospitalsPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-3xl py-8 px-4 mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">Nearby Hospitals</h1>
            <Hospital className="w-8 h-8 text-teal-600" />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <HospitalSkeleton />
              <HospitalSkeleton />
              <HospitalSkeleton />
            </div>
          }
        >
          <HospitalsContent />
        </Suspense>
      </div>
    </div>
  );
}
