'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, XCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl w-96 mb-2 border border-teal-100"
              layout
            >
              <div className="p-4 border-b border-teal-100 flex justify-between items-center bg-gradient-to-r from-teal-600 to-cyan-600 rounded-t-lg">
                <h3 className="text-white font-semibold text-lg">Healthcare Assistant</h3>
                <XCircle 
                  className="text-white cursor-pointer hover:text-teal-200 transition-colors" 
                  onClick={() => setIsOpen(false)} 
                />
              </div>
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-2xl p-3 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                          : 'bg-white text-gray-800 shadow-md border border-gray-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100">
                      <div className="flex gap-2">
                        <div className="animate-bounce">●</div>
                        <div className="animate-bounce delay-100">●</div>
                        <div className="animate-bounce delay-200">●</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-teal-100 bg-white rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={isLoading}
                    className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 shadow-lg"
            >
              💬
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
