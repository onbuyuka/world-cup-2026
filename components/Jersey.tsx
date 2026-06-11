import React, { useId } from 'react';
import type { Kit } from '../types';

// A colour-accurate SVG jersey rendered from a kit's colours + pattern type.
// We draw our own shirt (no copyrighted imagery): a body, two short sleeves,
// a collar and an optional pattern overlay clipped to the body.

const BODY =
  'M35 20 L43 20 Q50 27 57 20 L65 20 L74 28 L70 40 L64 37 L64 90 L36 90 L36 37 L30 40 L26 28 Z';
const LEFT_SLEEVE = 'M35 20 L26 28 L30 40 L20 45 L14 31 L24 22 Z';
const RIGHT_SLEEVE = 'M65 20 L74 28 L70 40 L80 45 L86 31 L76 22 Z';

interface Props {
  kit: Kit;
  size?: number;
  className?: string;
  title?: string;
  /** Show a shirt number on the body (default 10); pass false to hide. */
  number?: number | false;
}

/** Renders a national-team kit as a colour-accurate SVG jersey. */
export const Jersey: React.FC<Props> = ({
  kit,
  size = 72,
  className,
  title,
  number = 10,
}) => {
  const raw = useId().replace(/[:]/g, '');
  const clipId = `body-${raw}`;
  const gradId = `grad-${raw}`;

  const body = kit.body;
  const accent = kit.accent ?? kit.body;
  const sleeve = kit.sleeve ?? kit.body;
  const ink = kit.ink ?? '#0b0b0b';
  const pattern = kit.pattern ?? 'plain';

  const overlay: React.ReactNode[] = [];
  if (pattern === 'stripes') {
    for (let i = 0; i < 8; i += 1) {
      if (i % 2 === 1) {
        overlay.push(<rect key={i} x={26 + i * 6} y={18} width={6} height={74} fill={accent} />);
      }
    }
  } else if (pattern === 'thinstripes') {
    for (let i = 0; i < 24; i += 1) {
      if (i % 2 === 1) {
        overlay.push(<rect key={i} x={26 + i * 2} y={18} width={1} height={74} fill={accent} />);
      }
    }
  } else if (pattern === 'hoops') {
    for (let i = 0; i < 8; i += 1) {
      if (i % 2 === 1) {
        overlay.push(<rect key={i} x={26} y={20 + i * 9} width={48} height={9} fill={accent} />);
      }
    }
  } else if (pattern === 'sash') {
    overlay.push(
      <rect key="s" x={-12} y={42} width={110} height={13} fill={accent}
        transform="rotate(-34 50 50)" />,
    );
  } else if (pattern === 'halves') {
    overlay.push(<rect key="h" x={50} y={18} width={28} height={74} fill={accent} />);
  } else if (pattern === 'centreband') {
    overlay.push(<rect key="c" x={44} y={18} width={12} height={74} fill={accent} />);
  } else if (pattern === 'shoulders') {
    overlay.push(<rect key="sh" x={26} y={20} width={48} height={9} fill={accent} />);
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title ?? `${kit.label} kit`}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={clipId}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* sleeves */}
      <path d={LEFT_SLEEVE} fill={sleeve} stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      <path d={RIGHT_SLEEVE} fill={sleeve} stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      {/* cuffs */}
      <path d="M20 45 L14 31 L17 29 L23 43 Z" fill={accent} />
      <path d="M80 45 L86 31 L83 29 L77 43 Z" fill={accent} />

      {/* body base */}
      <path d={BODY} fill={body} />
      {/* pattern */}
      {overlay.length > 0 && <g clipPath={`url(#${clipId})`}>{overlay}</g>}
      {/* shading */}
      <path d={BODY} fill={`url(#${gradId})`} />

      {/* collar */}
      <path d="M43 20 Q50 27 57 20 L55 24 Q50 29 45 24 Z" fill={accent} />

      {/* number */}
      {number !== false && (
        <text
          x={50}
          y={66}
          textAnchor="middle"
          fontSize="24"
          fontWeight="800"
          fontFamily="Archivo, Inter, sans-serif"
          fill={ink}
          opacity={0.9}
        >
          {number}
        </text>
      )}

      {/* outline */}
      <path d={BODY} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
    </svg>
  );
};
