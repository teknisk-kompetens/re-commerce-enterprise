
import React from 'react'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
}

export default function Logo({ className = "h-8 w-auto", variant = 'dark' }: LogoProps) {
  const textColor = variant === 'dark' ? '#1F2937' : '#FFFFFF'
  
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="re:commerce - Plattformsinnovatörer för E-handel"
    >
      <text 
        x="10" 
        y="28" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="24" 
        fontWeight="600" 
        fill={textColor}
      >
        re:commerce
      </text>
      <circle cx="85" cy="20" r="2" fill="#1D4ED8" />
    </svg>
  )
}
