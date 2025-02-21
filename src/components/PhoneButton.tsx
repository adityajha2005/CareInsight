import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhoneButtonProps {
  number: string;
}

export const PhoneButton = ({ number }: PhoneButtonProps) => {
  const cleanNumber = number.replace(/[^\d+]/g, '');
  
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-gray-600">{number}</span>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="ml-2 hover:bg-teal-50"
      >
        <a
          href={`tel:${cleanNumber}`}
          className="inline-flex items-center gap-2 text-teal-600"
        >
          <Phone className="h-4 w-4" />
          <span className="sr-only">Call {number}</span>
        </a>
      </Button>
    </div>
  );
}; 