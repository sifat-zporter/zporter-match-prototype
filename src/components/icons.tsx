
import type { SVGProps } from 'react';

export function FootballPitchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Pitch Outline */}
      <rect x="5" y="5" width="290" height="140" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Center Line */}
      <line x1="150" y1="5" x2="150" y2="145" stroke="currentColor" strokeWidth="2" />
      
      {/* Center Circle */}
      <circle cx="150" cy="75" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Center Spot */}
      <circle cx="150" cy="75" r="2" fill="currentColor" />
      
      {/* Home Penalty Area */}
      <rect x="5" y="30" width="40" height="90" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="5" y="45" width="20" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="25" cy="75" r="2" fill="currentColor" />
      <path d="M 45 57 A 15 15 0 0 1 45 93" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Away Penalty Area */}
      <rect x="255" y="30" width="40" height="90" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="275" y="45" width="20" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="275" cy="75" r="2" fill="currentColor" />
      <path d="M 255 57 A 15 15 0 0 0 255 93" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ZporterLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function ZaiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="M17 9.5l-5 2.5-5-2.5" />
      <path d="M12 14.5v-5" />
    </svg>
  );
}
