'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from 'next/image'

const navItems = [
  { name: 'Analyzer', href: '/analyzer' },
  { name: 'Emergency', href: '/emergency' },
  { name: 'Saved Results', href: '/saved' },
  { name: 'Symptoms', href: '/symptom' },
  { name: 'Catalog', href: '/catalogue' },
  { name: 'Prescription', href: '/prescription' },
]

interface NavbarProps {
  language: 'english' | 'hindi'
  onLanguageChange: (value: 'english' | 'hindi') => void
}

export function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleLanguageChange = (value: string | undefined) => {
    if (!value || !onLanguageChange) return;
    if (value === 'english' || value === 'hindi') {
      onLanguageChange(value);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image 
                width={100} 
                height={100} 
                // src="./logo.png"
                src="/stock_1.jpg" 
                alt="logo" 
                className="h-8 w-8 transition-transform duration-200 group-hover:scale-110" 
              />
              <span className="font-bold text-2xl text-teal-700">
                CareInsight
              </span>
            </Link>
          </div>
          <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-teal-50 text-teal-700 border-2 border-teal-200'
                    : 'text-gray-700 border-2 border-transparent hover:border-teal-100 hover:bg-teal-50/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <ToggleGroup 
              type="single" 
              defaultValue={language}
              value={language} 
              onValueChange={handleLanguageChange}
              className="border rounded-md bg-white"
            >
              <ToggleGroupItem 
                value="english" 
                aria-label="English"
                className="data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 px-3 py-1"
              >
                🇬🇧 En
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="hindi" 
                aria-label="Hindi"
                className="data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 px-3 py-1"
              >
                🇮🇳 हि
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-teal-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-2 px-4 bg-white">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-teal-50 text-teal-700 border-2 border-teal-200'
                    : 'text-gray-700 border-2 border-transparent hover:border-teal-100 hover:bg-teal-50/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
