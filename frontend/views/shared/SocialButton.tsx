'use client'

import React from 'react'

interface SocialButtonProps {
  href: string
  icon: React.ReactNode
  color?: string
  hoverBg?: string
  ariaLabel?: string
}

export default function SocialButton({ 
  href, 
  icon, 
  color = '#D56989', 
  hoverBg = '#D56989',
  ariaLabel 
}: SocialButtonProps) {
  return (
    <>
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="uiverse-social-btn flex items-center justify-center bg-white"
        style={{
          width: '42px',
          height: '42px',
          color: color,
          '--hover-bg': hoverBg,
        } as React.CSSProperties}
      >
        <span className="icon-wrapper">
          {icon}
        </span>
      </a>
      <style>{`
        .uiverse-social-btn {
          outline: none;
          border: none;
          border-radius: 12px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: all 0.2s ease-in-out;
          text-decoration: none;
        }

        .uiverse-social-btn:hover {
          cursor: pointer;
          transform: scale(1.1);
          background-color: var(--hover-bg);
          box-shadow: 0 8px 20px rgba(213, 105, 137, 0.3);
        }

        .uiverse-social-btn .icon-wrapper {
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .uiverse-social-btn .icon-wrapper svg {
          width: 20px;
          height: 20px;
        }

        .uiverse-social-btn:hover .icon-wrapper {
          color: white;
        }
        
        .uiverse-social-btn .icon-wrapper svg {
          stroke: currentColor;
        }
        .uiverse-social-btn .icon-wrapper svg[fill="currentColor"] {
          fill: currentColor;
          stroke: none;
        }
      `}</style>
    </>
  )
}