'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ContactDialog } from '@/components/ui/ContactDialog';
import posthog from 'posthog-js';

interface ContactButtonProps {
  label: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function ContactButton({
  label,
  variant = 'default',
  size = 'lg',
  className,
}: ContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn('h-auto', className)}
        onClick={() => {
          posthog.capture('contact_cta_opened');
          setIsOpen(true);
        }}
      >
        {label}
      </Button>
      <ContactDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}