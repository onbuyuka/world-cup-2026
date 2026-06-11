import React, { useState } from 'react';
import type { Team } from '../types';

// ISO 3166-1 alpha-2 codes (plus GB subdivisions) for flag images.
// Windows/Chromium don't render emoji country flags, so we use SVG flags
// from flagcdn.com and fall back to the emoji if an image fails to load.
const ISO: Record<string, string> = {
  mexico: 'mx', 'south-africa': 'za', 'south-korea': 'kr', czechia: 'cz',
  canada: 'ca', 'bosnia-and-herzegovina': 'ba', qatar: 'qa', switzerland: 'ch',
  brazil: 'br', morocco: 'ma', haiti: 'ht', scotland: 'gb-sct',
  usa: 'us', paraguay: 'py', australia: 'au', turkiye: 'tr',
  germany: 'de', curacao: 'cw', 'ivory-coast': 'ci', ecuador: 'ec',
  netherlands: 'nl', japan: 'jp', sweden: 'se', tunisia: 'tn',
  belgium: 'be', egypt: 'eg', iran: 'ir', 'new-zealand': 'nz',
  spain: 'es', 'cape-verde': 'cv', 'saudi-arabia': 'sa', uruguay: 'uy',
  france: 'fr', senegal: 'sn', iraq: 'iq', norway: 'no',
  argentina: 'ar', algeria: 'dz', austria: 'at', jordan: 'jo',
  portugal: 'pt', 'dr-congo': 'cd', uzbekistan: 'uz', colombia: 'co',
  england: 'gb-eng', croatia: 'hr', ghana: 'gh', panama: 'pa',
};

interface Props {
  team: Team;
  /** Flag height in px (width follows a 3:2 ratio). */
  size?: number;
  className?: string;
}

export const Flag: React.FC<Props> = ({ team, size = 16, className }) => {
  const [failed, setFailed] = useState(false);
  const code = ISO[team.id];
  const h = size;
  const w = Math.round(size * 1.5);

  if (!code || failed) {
    return (
      <span className={className} style={{ fontSize: size }} aria-label={`${team.name} flag`}>
        {team.flag}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={`${team.name} flag`}
      width={w}
      height={h}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`inline-block shrink-0 rounded-[2px] object-cover align-middle ring-1 ring-black/20 ${className ?? ''}`}
      style={{ width: w, height: h }}
    />
  );
};
