import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Treatment {
  name: string;
  effectiveness: number;
  sideEffects: string[];
}

interface IllnessData {
  name: string;
  description: string;
  treatments: Treatment[];
  outlook: string;
  duration: string;
  aggravatingFactors: string[];
}

const IllnessDataPage: React.FC<IllnessData> = ({ name, description, treatments, outlook, duration, aggravatingFactors }) => {
  return (
    <div className="container mx-auto p-4 bg-gray-900 text-cyan-300 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyan-400 glow">{name}</h1>
        <p className="mb-6 text-lg text-cyan-200">{description}</p>
      </div>
      
      <Tabs defaultValue="treatments" className="neon-border p-4 rounded-lg">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="treatments" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-300">Treatments</TabsTrigger>
          <TabsTrigger value="effectiveness" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-300">Effectiveness</TabsTrigger>
          <TabsTrigger value="side-effects" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-300">Side Effects</TabsTrigger>
          <TabsTrigger value="outlook" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-300">Outlook</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-300">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="treatments">
          {treatments.map((treatment, index) => (
            <Card key={index} className="mb-4 bg-gray-800 border-cyan-500 border">
              <CardHeader>
                <CardTitle className="text-cyan-400">{treatment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyan-200">Effectiveness: {treatment.effectiveness}%</CardDescription>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="effectiveness">
          {treatments.map((treatment, index) => (
            <Card key={index} className="mb-4 bg-gray-800 border-cyan-500 border">
              <CardHeader>
                <CardTitle className="text-cyan-400">{treatment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-cyan-600 h-2.5 rounded-full glow-bar" style={{ width: `${treatment.effectiveness}%` }}></div>
                </div>
                <p className="mt-2 text-cyan-200">{treatment.effectiveness}% Effective</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="side-effects">
          {treatments.map((treatment, index) => (
            <Card key={index} className="mb-4 bg-gray-800 border-cyan-500 border">
              <CardHeader>
                <CardTitle className="text-cyan-400">{treatment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-cyan-200">
                  {treatment.sideEffects.map((effect, effectIndex) => (
                    <li key={effectIndex}>{effect}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="outlook">
          <Card className="mb-4 bg-gray-800 border-cyan-500 border">
            <CardHeader>
              <CardTitle className="text-cyan-400">Prognosis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-200">{outlook}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <Card className="mb-4 bg-gray-800 border-cyan-500 border">
            <CardHeader>
              <CardTitle className="text-cyan-400">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-200 mb-2"><strong>Duration:</strong> {duration}</p>
              <p className="text-cyan-200 mb-2"><strong>Aggravating Factors:</strong></p>
              <ul className="list-disc pl-5 text-cyan-200">
                {aggravatingFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IllnessDataPage;

