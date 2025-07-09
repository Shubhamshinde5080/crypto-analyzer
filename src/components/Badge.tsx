'use client';
import React from 'react';

type Tone = 'success' | 'error' | 'neutral';

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  const toneClass =
    tone === 'success' ? 'badge-success' : tone === 'error' ? 'badge-error' : 'badge-neutral';
  return <span className={`${toneClass} ${className}`}>{children}</span>;
}
