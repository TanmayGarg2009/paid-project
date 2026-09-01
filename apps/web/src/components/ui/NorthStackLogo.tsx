'use client';

import React from 'react';
import Image from 'next/image';

interface NorthStackLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  className?: string;
  useImageMark?: boolean;
}

export function NorthStackLogo({
  size = 'md',
  showText = true,
  className = '',
  useImageMark = true,
}: NorthStackLogoProps) {
  const pixelSize = typeof size === 'number' 
    ? size 
    : size === 'sm' 
    ? 32 
    : size === 'md' 
    ? 40 
    : size === 'lg' 
    ? 48 
    : 64;

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Visual Mark */}
      <div 
        className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-accent/20"
        style={{ width: pixelSize, height: pixelSize }}
      >
        {useImageMark ? (
          <Image
            src="/logo.jpg"
            alt="NorthStack Digitals Logo"
            width={pixelSize}
            height={pixelSize}
            className="w-full h-full object-cover rounded-xl border border-accent/30"
            priority
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1"
          >
            <defs>
              <linearGradient id="nsGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="nsGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="nsStar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            {/* Bottom Stack Layer */}
            <path
              d="M50 78 L20 62 L50 46 L80 62 Z"
              fill="url(#nsGrad2)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            <path
              d="M20 62 L20 72 L50 88 L50 78 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            <path
              d="M80 62 L80 72 L50 88 L50 78 Z"
              fill="#0369a1"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />

            {/* Middle Stack Layer */}
            <path
              d="M50 56 L24 43 L50 30 L76 43 Z"
              fill="url(#nsGrad1)"
              stroke="#7dd3fc"
              strokeWidth="2.5"
            />
            <path
              d="M24 43 L24 51 L50 64 L50 56 Z"
              fill="#0284c7"
              stroke="#7dd3fc"
              strokeWidth="2.5"
            />
            <path
              d="M76 43 L76 51 L50 64 L50 56 Z"
              fill="#0369a1"
              stroke="#7dd3fc"
              strokeWidth="2.5"
            />

            {/* Top Apex North Star */}
            <path
              d="M50 10 L54 26 L70 30 L54 34 L50 50 L46 34 L30 30 L46 26 Z"
              fill="url(#nsStar)"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-base sm:text-lg font-black tracking-wider leading-none text-foreground">
            NORTHSTACK
          </span>
          <span className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase leading-none mt-1">
            DIGITALS
          </span>
        </div>
      )}
    </div>
  );
}
