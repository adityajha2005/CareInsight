'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Contact {
  name: string
  number: string
  description: string
}

const emergencyContacts: Contact[] = [
  {
    name: 'Emergency Services',
    number: '100',
    description:
      'For immediate assistance from police, fire, or medical services.',
  },
  {
    name: 'Mental Health Helpline',
    number: '1800-599-0019',
    description:
      'Provides 24/7 mental health support and crisis intervention services.',
  },
  {
    name: 'Childline India',
    number: '1098',
    description:
      'Offers emergency assistance and support for children in need.',
  },
  {
    name: 'Women Helpline',
    number: '181',
    description:
      'Assists women in distress with legal, medical, and counselling services.',
  },
  {
    name: 'Elderly Helpline',
    number: '14567',
    description:
      'Provides support for senior citizens, including abuse prevention and health services.',
  },
  {
    name: 'AIDS Helpline',
    number: '1097',
    description:
      'Offers confidential HIV/AIDS information and support.',
  },
  {
    name: 'Cyber Crime Helpline',
    number: '1930',
    description:
      'Provides assistance for reporting and resolving cyber crimes.',
  },
  {
    name: 'Railway Helpline',
    number: '139',
    description:
      'For inquiries and emergency assistance on Indian Railways.',
  },
  {
    name: 'Ambulance Services',
    number: '108',
    description:
      'Offers emergency ambulance services across India.',
  },
  {
    name: 'Disaster Management Helpline',
    number: '1070',
    description:
      'Provides support during natural disasters and calamities.',
  },
  {
    name: 'Senior Citizen Helpline',
    number: '1800-180-1253',
    description:
      'Dedicated support helpline for senior citizens.',
  },
]

export default function EmergencyContacts() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = emergencyContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number.includes(searchTerm) ||
      contact.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <Accordion type="single" collapsible className="w-full">
        {filteredContacts.map((contact, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left">
              <div>
                <h2 className="text-lg font-semibold">{contact.name}</h2>
                <p className="text-sm text-gray-500">{contact.number}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700 mb-4">{contact.description}</p>
              <Button
                onClick={() => (window.location.href = `tel:${contact.number}`)}
                className="w-full sm:w-auto"
              >
                Call {contact.number}
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {filteredContacts.length === 0 && (
        <p className="text-center text-gray-500">No contacts found.</p>
      )}
    </div>
  )
}
