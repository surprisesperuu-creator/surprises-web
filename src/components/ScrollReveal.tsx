'use client';

import { ReactNode, type Ref } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-in-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  animation = 'fade-in-up',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin });

  const animationClass = {
    'fade-in-up': 'animate-fade-in-up',
    'fade-in': 'animate-fade-in',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
  }[animation];

  const delayClass = delay > 0 ? `delay-${Math.min(500, delay)}` : '';

  return (
    <div
      ref={ref as unknown as Ref<HTMLDivElement>}
      className={`${isVisible ? animationClass : ''} ${delayClass} ${className}`}
      style={{
        animationDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}
