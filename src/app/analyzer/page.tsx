'use client'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import {Button} from '@/components/ui/button'
import {Card} from '@/components/ui/card'
import {Textarea} from '@/components/ui/textarea'
import {Mic} from 'lucide-react'
import React, {useState} from 'react'
import {Toggle} from '@/components/ui/toggle'
import {AnalysisResults} from '@/components/analysis-results'
import {motion} from 'motion/react'
import FeedbackForm from '@/components/feedback'
import { toast, Toaster } from 'sonner'
import { useRouter } from 'next/navigation'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Globe } from 'lucide-react'
import { Navbar } from '@/components/navbar'

const spring_transition = {
    type: "spring",
    stiffness: 200, 
    damping: 30,    // Controls the resistance of the spring
    bounce: 0.5,   
}

const symptoms = {
    english: [
        'Fever',
        'Headache',
        'Fatigue',
        'Nausea',
        'Dizziness',
        'Cough',
        'Shortness of breath',
        'Chest pain',
        'Muscle aches',
        'Sore throat',
    ],
    hindi: [
        'बुखार',
        'सिरदर्द',
        'थकान',
        'मितली',
        'चक्कर आना',
        'खांसी',
        'सांस की तकलीफ',
        'छाती में दर्द',
        'मांसपेशियों में दर्द',
        'गले में खराश',
    ]
};

// Map to maintain relationship between English and Hindi symptoms
const symptomMap = {
    'Fever': 'बुखार',
    'Headache': 'सिरदर्द',
    'Fatigue': 'थकान',
    'Nausea': 'मितली',
    'Dizziness': 'चक्कर आना',
    'Cough': 'खांसी',
    'Shortness of breath': 'सांस की तकलीफ',
    'Chest pain': 'छाती में दर्द',
    'Muscle aches': 'मांसपेशियों में दर्द',
    'Sore throat': 'गले में खराश',
};

const translations = {
    english: {
        title: "Emergency Situation Analyzer",
        subtitle: "How are you feeling today?",
        disclaimer: "DISCLAIMER: Not a replacement for medical professionals.",
        placeholder: "Describe your medical condition or symptoms you are feeling",
        analyzeButton: "Analyze",
        analyzing: "Analyzing...",
        answering: "Answering questions...",
        mentalHealthPrompt: "Would you like to take a quick mental health checkup?",
        mentalHealthAction: "Yes, take me there",
        feedbackThank: "Thank you for your feedback!",
        followUpQuestions: {
            'Fever': 'Is your fever continuous for more than 24 hours?',
            'Headache': 'Is the headache severe and persistent?',
            'Chest pain': 'Is the pain radiating to your arm or jaw?',
            'Shortness of breath': 'Does it worsen when lying down?',
            'Cough': 'Have you been coughing for more than a week?'
        }
    },
    hindi: {
        title: "आपातकालीन स्थिति विश्लेषक",
        subtitle: "आज आप कैसा महसूस कर रहे हैं?",
        disclaimer: "अस्वीकरण: चिकित्सा पेशेवरों का विकल्प नहीं है।",
        placeholder: "अपनी चिकित्सा स्थिति या लक्षणों का वर्णन करें",
        analyzeButton: "विश्लेषण करें",
        analyzing: "विश्लेषण हो रहा है...",
        answering: "प्रश्नों के उत्तर दे रहे हैं...",
        mentalHealthPrompt: "क्या आप एक त्वरित मानसिक स्वास्थ्य जांच लेना चाहेंगे?",
        mentalHealthAction: "हां, मुझे वहां ले चलें",
        feedbackThank: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
        followUpQuestions: {
            'Fever': 'क्या आपको 24 घंटे से अधिक समय से लगातार बुखार है?',
            'Headache': 'क्या सिरदर्द गंभीर और लगातार है?',
            'Chest pain': 'क्या दर्द आपकी बांह या जबड़े तक फैल रहा है?',
            'Shortness of breath': 'क्या लेटने पर यह बदतर हो जाता है?',
            'Cough': 'क्या आपको एक सप्ताह से अधिक समय से खांसी है?'
        }
    }
};

let recognition: any = null

export default function Home() {
    const router = useRouter();
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
    const [description, setDescription] = useState(
        'I\'m having cold, cough and fever with a running nose.'
    )
    const [isListening, setIsListening] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [followUpAnswers, setFollowUpAnswers] = useState<{[key: string]: string}>({});
    const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);
    const [language, setLanguage] = useState<'english' | 'hindi'>('english');
    const t = translations[language]; 

    const followUpQuestions = t.followUpQuestions;

    const handleLanguageChange = (value: 'english' | 'hindi') => {
        if (value && value !== language) {
            setLanguage(value);
        }
    };

    const toggleSymptom = (symptom: string) => {
        const englishSymptom = language === 'hindi' 
            ? Object.keys(symptomMap).find(key => symptomMap[key as keyof typeof symptomMap] === symptom) || symptom
            : symptom;
            
        setSelectedSymptoms((prev) =>
            prev.includes(englishSymptom)
                ? prev.filter((s) => s !== englishSymptom)
                : [...prev, englishSymptom]
        )
    }

    const handleVoiceInput = () => {
        if ('webkitSpeechRecognition' in window) {
            // Initialize recognition only once
            if (!recognition) {
                recognition = new (window as any).webkitSpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true

                recognition.onstart = () => {
                    setIsListening(true)
                }

                recognition.onresult = (event: any) => {
                    const transcript = Array.from(event.results)
                        .map((result: any) => result[0])
                        .map((result) => result.transcript)
                        .join('')
                    setDescription(transcript)
                }

                recognition.onend = () => {
                    setIsListening(false)
                }
            }

            try {
                if (isListening) {
                    recognition.stop()
                } else {
                    recognition.start()
                }
            } catch (error) {
                console.error('Speech recognition error:', error)
                setIsListening(false)
            }
        } else {
            alert('Speech recognition is not supported in your browser.')
        }
    }

    const askFollowUpQuestions = async (symptoms: string[]) => {
        setIsAskingFollowUp(true);
        const answers: {[key: string]: string} = {};
        
        for (const symptom of symptoms) {
            if (followUpQuestions[symptom as keyof typeof followUpQuestions]) {
                await new Promise<void>((resolve) => {
                    const toastId = toast(
                        <div className="w-full">
                            <p className="mb-2">{followUpQuestions[symptom as keyof typeof followUpQuestions]}</p>
                            <div className="flex gap-2 justify-end mt-2">
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                        answers[symptom] = "No";
                                        toast.dismiss(toastId);
                                        resolve();
                                    }}
                                >
                                    No
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={() => {
                                        answers[symptom] = "Yes";
                                        toast.dismiss(toastId);
                                        resolve();
                                    }}
                                >
                                    Yes
                                </Button>
                            </div>
                        </div>,
                        {
                            duration: Infinity,
                            onDismiss: () => {
                                if (!answers[symptom]) {
                                    answers[symptom] = "No answer";
                                    resolve();
                                }
                            },
                        }
                    );
                });
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        setFollowUpAnswers(answers);
        setIsAskingFollowUp(false);
        return answers;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const answers = await askFollowUpQuestions(selectedSymptoms);
        
        const followUpInfo = Object.entries(answers)
            .map(([symptom, answer]) => `${symptom}: ${answer}`)
            .join('. ');
            
        const prompt = `Symptoms: ${selectedSymptoms.join(', ')}. 
            Description: ${description}. 
            Additional Information: ${followUpInfo},
            Language : ${language}`
            
            ;

        try {
            const response = await fetch('/api/cohere', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({prompt}),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            setAnalysisResult(data);
            
            setTimeout(() => {
                toast(t.mentalHealthPrompt, {
                    action: {
                        label: t.mentalHealthAction,
                        onClick: () => router.push('/mental-health-quiz')
                    },
                    duration: 8000,
                    className: "border relative overflow-hidden"
                });
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to analyze symptoms. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const handleFeedbackSubmit = async (feedback: any) => {
        try {
        // just for showing 
          setFeedbackSubmitted(true);
        } catch (error) {
          console.error('Error submitting feedback:', error);
        }
      };
    
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative">
            <Navbar 
                language={language} 
                onLanguageChange={handleLanguageChange} 
            />
            <Toaster 
                position="bottom-right" 
                className="max-sm:!top-6 max-sm:!bottom-auto max-sm:!right-4"
                closeButton
                richColors
            />
            <div className="max-w-2xl mx-auto px-4 py-8 mt-16"> 
                <h1 className="text-xl text-center font-mono font-bold mb-8 text-blue-600">
                    {t.title}
                </h1>
                <motion.div initial={{y: "100%", opacity: 0, filter: "blur(10px)"}}
                            animate={{y: 0, opacity: 1, filter: "blur(0px)"}} transition={spring_transition}>
                    <Card className="p-6 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                        <h2 className="text-2xl font-semibold mb-6 text-blue-600">
                            {t.subtitle}
                        </h2>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {symptoms[language].map((symptom, index) => (
                                <Toggle
                                    key={symptom}
                                    pressed={selectedSymptoms.includes(
                                        language === 'hindi' 
                                            ? Object.keys(symptomMap).find(key => symptomMap[key as keyof typeof symptomMap] === symptom) || symptom
                                            : symptom
                                    )}
                                    onPressedChange={() => toggleSymptom(symptom)}
                                    variant="outline"
                                    className="border-blue-200 hover:bg-blue-50 data-[state=on]:bg-blue-100"
                                >
                                    {symptom}
                                </Toggle>
                            ))}
                        </div>

                        <div className="relative">
                            <Textarea
                                placeholder={t.placeholder}
                                className="min-h-[150px] mb-4 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                maxLength={200}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <p className="text-xs my-5 w-[65%] md:w-full md:text-sm leading-3 text-gray-400">
                                {t.disclaimer}
                            </p>
                            <Button
                                size="icon"
                                variant={isListening ? 'destructive' : 'outline'}
                                className="absolute bottom-8 right-2"
                                onClick={handleVoiceInput}
                            >
                                <Mic className={isListening ? 'animate-pulse' : ''}/>
                            </Button>
                            <div className="text-sm text-muted-foreground text-right">
                                {description.length}/200 characters
                            </div>
                        </div>

                        <Button
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={
                                (selectedSymptoms.length === 0 && !description.trim()) ||
                                isLoading ||
                                isAskingFollowUp
                            }
                        >
                            {isAskingFollowUp ? t.answering : 
                             isLoading ? t.analyzing : t.analyzeButton}
                        </Button>
                    </Card>
                </motion.div>
                {analysisResult &&
                    <motion.div
                        initial={{y: "100%", opacity: 0, filter: "blur(10px)"}}
                        animate={{y: 0, opacity: 1, filter: "blur(0px)"}}
                        transition={spring_transition}
                    >
                        <AnalysisResults 
                            data={analysisResult} 
                            showDialog={false}
                            language={language}
                        />
                        {!feedbackSubmitted ? (
              <FeedbackForm onSubmit={handleFeedbackSubmit} />
            ) : (
              <p className="mt-4 text-green-600">
                <CheckIcon />{" "}Thank you for your feedback!</p>
            )}
                    </motion.div>}
            </div>
        </main>
    )
}
