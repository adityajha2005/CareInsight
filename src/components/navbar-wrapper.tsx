'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'

export function NavbarWrapper() {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english')

  const handleLanguageChange = (newLanguage: 'english' | 'hindi') => {
    setLanguage(newLanguage)
    // Add any additional language change logic here
  }

  return (
    <Navbar
      language={language}
      onLanguageChange={handleLanguageChange}
    />
  )
}