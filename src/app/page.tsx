'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation"
import { useCounter } from '@/hooks/useCounter'
import { ChatBot } from '@/components/ChatBot'
import { useState } from 'react'

// Add new interfaces
interface HealthNews {
  id: number
  title: string
  description: string
  category: 'AI' | 'Research' | 'Wellness' | 'Medical'
  date: string
  image: string
  readTime: string
}

const newsCategories = ['All', 'AI', 'Research', 'Wellness', 'Medical']

const latestNews: HealthNews[] = [
  {
    id: 1,
    title: 'AI Breakthrough in Early Disease Detection',
    description: 'New AI algorithm shows 95% accuracy in detecting early signs of chronic diseases.',
    category: 'AI',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Revolutionary Mental Health Treatment',
    description: 'Researchers discover new approach to treating anxiety and depression.',
    category: 'Research',
    date: '2024-01-14',
    image: 'https://vinbrain.net/public/uploads/1blog/ai-tam-ly/222.jpg',
    readTime: '4 min'
  },
  {
    id: 3,
    title: 'Wellness Trends for 2024',
    description: 'Top health and wellness trends that will dominate the upcoming year.',
    category: 'Wellness',
    date: '2024-01-13',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    readTime: '6 min'
  }
]

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

const uniqueFeatures = [
  {
    title: 'AI-Powered Diagnosis',
    description: 'Advanced machine learning algorithms analyze symptoms and medical history for accurate preliminary diagnosis',
    icon: '🤖',
  },
  {
    title: 'Real-time Health Monitoring',
    description: 'Continuous tracking of vital signs and health metrics with instant alerts for anomalies',
    icon: '📊',
  },
  {
    title: 'Personalized Care Plans',
    description: 'Custom healthcare recommendations based on individual health data and lifestyle factors',
    icon: '🎯',
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
  { number: '99.9%', label: 'Diagnosis Accuracy', icon: '🎯', duration: 2000 },
  { number: '24/7', label: 'AI Assistance', icon: '🤖', duration: 0 },
  { number: '100k+', label: 'Daily Analysis', icon: '📊', duration: 2500 },
  { number: '500+', label: 'Medical Protocols', icon: '🏥', duration: 2000 },
]

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All')

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const filteredNews = selectedCategory === 'All' 
    ? latestNews 
    : latestNews.filter(news => news.category === selectedCategory)

  return (
    <main className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-teal-50 via-cyan-50 to-transparent -z-10" />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8"
          >
            <div className="inline-block rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-2 mb-6 border border-teal-100">
              <span className="text-sm font-semibold text-teal-800">🌟 Next-Gen Healthcare AI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Revolutionary{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Healthcare
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Experience healthcare evolution with our cutting-edge AI technology. Get instant medical insights, personalized care plans, and 24/7 support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
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

      {/* New USP Section */}
      <section className="py-12 lg:py-16 bg-white border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {uniqueFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-teal-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const numericValue = formatStat(stat.number);
              const count = useCounter(numericValue, stat.duration);
              
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-teal-100 hover:shadow-xl transition-all"
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

      {/* AI Features Showcase */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-teal-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Powered by{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI technology processes millions of medical data points to provide accurate diagnosis and personalized care recommendations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-3xl border border-teal-100 shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-teal-700 mb-4">Natural Language Processing</h3>
              <p className="text-gray-600">Advanced AI that understands medical terminology and natural conversation, making healthcare communication seamless.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-3xl border border-teal-100 shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-teal-700 mb-4">Predictive Analytics</h3>
              <p className="text-gray-600">AI-driven health predictions and early warning systems to prevent potential health issues before they occur.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* News Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
              Latest Health{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Insights
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Stay informed with the latest breakthroughs in healthcare and wellness
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 lg:mb-12 px-2">
              {newsCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-white border border-teal-100 text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="wait">
              {filteredNews.map((news) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="group cursor-pointer h-full"
                >
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-teal-100 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-teal-700">{news.category}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                        <span>{news.date}</span>
                        <span>{news.readTime} read</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-teal-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-gray-600">
                        {news.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-teal-200 hover:bg-teal-50 text-teal-700"
              onClick={() => handleNavigation('/news')}
            >
              View All News
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-teal-50/30 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          <div className="bg-gradient-to-br from-white to-teal-50 rounded-3xl p-6 lg:p-12 shadow-xl border border-teal-100">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
              Experience the Future of{' '}
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Healthcare
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8">Join thousands of users who trust our AI-powered healthcare platform</p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 text-lg px-6 py-7 rounded-full shadow-lg hover:shadow-xl"
              onClick={() => handleNavigation('/get-started')}
            >
              Start Your Health Journey
            </Button>
          </div>
        </motion.div>
      </section>
      <ChatBot />
    </main>
  )
}
