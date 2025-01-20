'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation"
import { useCounter } from '@/hooks/useCounter'
import { ChatBot } from '@/components/ChatBot'

const features = [
  {
    title: 'Health Analysis',
    description: 'Get comprehensive insights about your physical and mental well-being through AI-powered analysis',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  },
  {
    title: 'Medical Support',
    description: 'Connect with healthcare professionals and access resources for all your health needs 24/7',
    image: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800',
  },
  {
    title: 'Wellness Tracking',
    description: 'Monitor your overall health journey with detailed analytics across multiple health parameters',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  },
]

const formatStat = (stat: string) => {
  if (stat.endsWith('k+')) {
    return parseInt(stat.replace('k+', '')) * 1000;
  }
  if (stat.endsWith('%')) {
    return parseInt(stat.replace('%', ''));
  }
  return parseInt(stat) || 0;
};

const stats = [
  { number: '98%', label: 'Patient Satisfaction', icon: '⭐', duration: 2000 },
  { number: '24/7', label: 'Medical Support', icon: '🏥', duration: 0 },
  { number: '50k+', label: 'Active Patients', icon: '👥', duration: 2500 },
  { number: '200+', label: 'Medical Experts', icon: '👨‍⚕️', duration: 2000 },
]

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-teal-50 to-transparent -z-10" />
      <section className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block rounded-full bg-teal-50 px-4 py-2 mb-6 border border-teal-100">
              <span className="text-sm font-semibold text-teal-800">🎯 Precision Healthcare</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold">
              Your Complete{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Healthcare
              </span>{' '}
              Companion
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Experience precision healthcare with AI-driven insights and expert medical support for your well-being journey.
            </p>
            <div className="flex gap-4 items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl"
                onClick={() => handleNavigation('/analyzer')}
              >
                Get Started Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 border-teal-200 hover:bg-teal-50 text-teal-700"
                onClick={() => handleNavigation('/about')}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />
            <div className="relative z-10 rounded-3xl overflow-hidden border border-teal-100 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"
                alt="Mental Health Support"
                width={600}
                height={400}
                className="hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const numericValue = formatStat(stat.number);
              const count = useCounter(numericValue, stat.duration);
              
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-4xl font-bold text-teal-700 mb-2">
                    {stat.duration === 0 ? stat.number : 
                      stat.number.includes('k+') ? `${Math.floor(count/1000)}k+` :
                      stat.number.includes('%') ? `${count}%` :
                      `${count}+`
                    }
                  </div>
                  <div className="text-teal-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-6">
              Advanced{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Healthcare
              </span>{' '}
              Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Precision medicine and comprehensive care at your fingertips
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-teal-100">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-4 text-teal-700">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-teal-50/30 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <div className="bg-gradient-to-b from-white to-teal-50 rounded-3xl p-12 shadow-lg border border-teal-100">
            <h2 className="text-4xl font-bold mb-8">
              Begin Your{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Health Journey
              </span>
            </h2>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl"
              onClick={() => handleNavigation('/mental-health-quiz')}
            >
              Start Free Assessment
            </Button>
          </div>
        </motion.div>
      </section>
      <ChatBot />
    </main>
  )
}
