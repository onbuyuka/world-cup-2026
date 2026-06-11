import React, { useState } from 'react';
import type { Kit, SquadPlayer } from '../types';

/** mylineups headshot URL for a player id. */
const photoUrl = (fmId: string): string =>
  `https://mylineups.app/builder-assets/players/fm-${fmId}.webp`;

interface Props {
  player: SquadPlayer;
  /** Home kit, used to colour the fallback number badge. */
  kit?: Kit;
  size?: number;
}

/**
 * Small circular player image (sourced from mylineups.app) with a graceful
 * fallback to a kit-coloured shirt-number badge when no photo is available or
 * the image fails to load.
 */
export const PlayerAvatar: React.FC<Props> = ({ player, kit, size = 40 }) => {
  const [failed, setFailed] = useState(false);
  const showPhoto = player.fmId && !failed;

  if (showPhoto) {
    return (
      <img
        src={photoUrl(player.fmId!)}
        alt={player.name}
        width={size}
        height={size}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full bg-ink-900 object-cover ring-1 ring-white/15"
        style={{ width: size, height: size }}
      />
    );
  }

  // Fallback: shirt-number badge in the team's kit colours.
  const body = kit?.body ?? '#1f2937';
  const ink = kit?.ink ?? '#e5e7eb';
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-display font-extrabold ring-1 ring-white/15"
      style={{
        width: size,
        height: size,
        backgroundColor: body,
        color: ink,
        fontSize: size * 0.4,
      }}
      aria-label={player.name}
    >
      {player.number ?? '–'}
    </span>
  );
};
