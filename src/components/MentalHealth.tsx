import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Phone, Heart, Brain, AlertCircle } from 'lucide-react';

const quizQuestions = [
  {
    question: 'How often have you felt nervous or on edge in the past two weeks?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    question: 'How often have you had trouble relaxing?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    question: 'How often have you been easily annoyed or irritable?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    question: 'How often have you felt down, depressed, or hopeless?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    question: 'How often have you had little interest or pleasure in doing things?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    question: 'How often have you had trouble falling or staying asleep?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    question: 'How often have you felt tired or had little energy?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
  {
    question: 'How often have you had trouble concentrating?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
  },
];

const EmergencyContacts = () => (
  <div className="mt-6 grid gap-4">
    <h3 className="text-xl font-semibold">Emergency Contacts</h3>
    <div className="grid gap-3">
      <a href="tel:988" className="flex items-center gap-2 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
        <Phone className="text-red-600" />
        <div>
          <p className="font-medium">988 Suicide & Crisis Lifeline</p>
          <p className="text-sm text-gray-600">Available 24/7</p>
        </div>
      </a>
      <a href="tel:1-800-662-4357" className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        <Phone className="text-blue-600" />
        <div>
          <p className="font-medium">SAMHSA's National Helpline</p>
          <p className="text-sm text-gray-600">1-800-662-4357</p>
        </div>
      </a>
    </div>
  </div>
);

const WellnessResources = () => (
  <div className="mt-6">
    <h3 className="text-xl font-semibold mb-4">Recommended Resources</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-green-50 rounded-lg">
        <Heart className="text-green-600 mb-2" />
        <h4 className="font-medium">Meditation Apps</h4>
        <p className="text-sm text-gray-600">Try Headspace or Calm for guided meditation</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <Brain className="text-purple-600 mb-2" />
        <h4 className="font-medium">Mental Wellness</h4>
        <p className="text-sm text-gray-600">Practice mindfulness and journaling</p>
      </div>
    </div>
  </div>
);

export function MentalHealthQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [insights, setInsights] = useState<{
    severity: string;
    message: string;
    suggestions: string[];
    showEmergencyContacts: boolean;
  } | null>(null);

  const handleAnswer = (value: number) => {
    setAnswers((prev) => [...prev, value]);

    if (currentQuestionIndex === quizQuestions.length - 1) {
      calculateInsights([...answers, value]);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateInsights = (finalAnswers: number[]) => {
    const totalScore = finalAnswers.reduce((sum, value) => sum + value, 0);
    const maxPossibleScore = quizQuestions.length * 3;
    
    let result = {
      severity: '',
      message: '',
      suggestions: [] as string[],
      showEmergencyContacts: false
    };

    if (totalScore <= maxPossibleScore * 0.25) {
      result = {
        severity: 'minimal',
        message: 'Great news! Your responses suggest minimal signs of anxiety and depression.',
        suggestions: [
          'Continue your healthy lifestyle practices',
          'Regular exercise and good sleep habits',
          'Maintain social connections',
        ],
        showEmergencyContacts: false
      };
    } else if (totalScore <= maxPossibleScore * 0.5) {
      result = {
        severity: 'mild',
        message: 'Your responses indicate mild symptoms of anxiety and depression.',
        suggestions: [
          'Try meditation or mindfulness exercises',
          'Establish a regular exercise routine',
          'Consider talking to friends or family about your feelings',
        ],
        showEmergencyContacts: false
      };
    } else {
      result = {
        severity: 'severe',
        message: 'Your responses indicate significant symptoms that deserve attention.',
        suggestions: [
          'Reach out to a mental health professional',
          'Connect with a counselor or therapist',
          'Consider talking to your primary care physician',
          'Share your feelings with trusted friends or family',
        ],
        showEmergencyContacts: true
      };
    }

    setInsights(result);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {!insights ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-8">
            {quizQuestions[currentQuestionIndex].question}
          </h2>

          <div className="grid gap-4">
            {quizQuestions[currentQuestionIndex].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-4 text-lg hover:bg-primary hover:text-white transition-all duration-200"
                onClick={() => handleAnswer(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="insights p-6 bg-primary/5 rounded-lg"
        >
          <div className={`p-4 rounded-lg mb-6 ${
            insights.severity === 'minimal' ? 'bg-green-50' :
            insights.severity === 'mild' ? 'bg-yellow-50' : 'bg-red-50'
          }`}>
            <h2 className="text-2xl font-bold mb-2">Your Mental Health Insights</h2>
            <p className="text-lg leading-relaxed">{insights.message}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
            <div className="grid gap-3">
              {insights.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p>{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {insights.severity !== 'minimal' && <WellnessResources />}
          {insights.showEmergencyContacts && <EmergencyContacts />}

          <Button 
            className="mt-8 w-full"
            onClick={() => {
              setInsights(null);
              setCurrentQuestionIndex(0);
              setAnswers([]);
            }}
          >
            Take Quiz Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
