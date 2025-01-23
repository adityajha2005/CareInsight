'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from 'next/image'
import { SignInButton } from '@clerk/nextjs'

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.navbar-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="font-bold text-2xl text-teal-700">
              🚀CareInsight
            </span>
          </Link>
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
          <SignInButton>
            <Button 
              variant="outline"
              className="bg-white/50 hover:bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-300 transition-colors duration-200"
            >
              Sign In
            </Button>
          </SignInButton>
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

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border overflow-hidden navbar-dropdown">
          <div className="py-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-700 hover:bg-gray-50'
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