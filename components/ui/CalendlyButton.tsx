'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendlyButtonProps {
  url: string;
  label: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

function loadCalendlyScript(url: string) {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url });
    return;
  }
  const link = document.createElement('link');
  link.href = 'https://assets.calendly.com/assets/external/widget.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.onload = () => window.Calendly?.initPopupWidget({ url });
  document.head.appendChild(script);
}

export function CalendlyButton({
  url,
  label,
  variant = 'default',
  size = 'lg',
  className,
}: CalendlyButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('h-auto', className)}
      onClick={() => loadCalendlyScript(url)}
    >
      {label}
    </Button>
  );
}
