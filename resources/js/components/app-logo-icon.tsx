import React from 'react';
import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 44 44" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      {/* Apertura de objetivo minimalista */}
      <circle cx="22" cy="22" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Palas del diafragma */}
      <path d="M22 0 L26 20 L18 20 Z" fill="currentColor" />
      <path d="M44 22 L24 26 L24 18 Z" fill="currentColor" />
      <path d="M22 44 L18 24 L26 24 Z" fill="currentColor" />
      <path d="M0 22 L20 18 L20 26 Z" fill="currentColor" />
    </svg>
  );
}
