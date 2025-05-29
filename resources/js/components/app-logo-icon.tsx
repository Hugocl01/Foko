import React from 'react';
import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 44 44"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Apertura de objetivo minimalista */}
            <circle
                cx="22"
                cy="22"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
            />
            {/* Palas del diafragma */}
            <path d="M22 2 L26 22 L18 22 Z" fill="currentColor" />
            <path d="M42 22 L22 26 L22 18 Z" fill="currentColor" />
            <path d="M22 42 L18 22 L26 22 Z" fill="currentColor" />
            <path d="M2 22 L22 18 L22 26 Z" fill="currentColor" />
        </svg>
    );
}
