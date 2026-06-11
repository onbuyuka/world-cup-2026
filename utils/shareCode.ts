import type { BracketState, GroupId, GroupStanding } from '../types';
import { GROUP_IDS, GROUPS_BY_ID } from '../data/groups';
import { KO_MATCHES, createInitialState, resolveBracket } from './bracket';

// Compact, URL-safe encoding of a bracket prediction so it can be shared in a
// link (and that same link is used to score the prediction against live
// results). Layout (version 1):
//   byte 0      : version (1)
//   bytes 1..12 : per-group permutation index (0..23) of the draw order
//   bytes 13..14: 12-bit bitmask of which groups' 3rd-placed team advances
//   bytes 15..  : 32 knockout picks, 2 bits each (0 none, 1 home, 2 away),
//                 packed 4 per byte, in ascending match-id order
// ~23 bytes -> ~31 url-safe chars.

const VERSION = 1;

// Knockout match ids in ascending (also dependency) order.
const KO_IDS = KO_MATCHES.map((m) => m.id).sort((a, b) => a - b);

// --- permutations of [0,1,2,3] <-> index 0..23 (Lehmer code) ---------------
const FACT = [6, 2, 1, 1];

function permToIndex(p: number[]): number {
  const avail = [0, 1, 2, 3];
  let idx = 0;
  for (let i = 0; i < 4; i++) {
    const pos = avail.indexOf(p[i]);
    idx += pos * FACT[i];
    avail.splice(pos, 1);
  }
  return idx;
}

function indexToPerm(idx: number): number[] {
  const avail = [0, 1, 2, 3];
  const out: number[] = [];
  let n = idx;
  for (let i = 0; i < 4; i++) {
    const pos = Math.floor(n / FACT[i]);
    n %= FACT[i];
    out.push(avail[pos]);
    avail.splice(pos, 1);
  }
  return out;
}

// --- base64url over a byte array -------------------------------------------
function bytesToB64url(bytes: number[]): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b & 0xff);
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(code: string): number[] {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const bin =
    typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const out: number[] = [];
  for (let i = 0; i < bin.length; i++) out.push(bin.charCodeAt(i));
  return out;
}

/** Encode a prediction (group orders, thirds, knockout winners) to a code. */
export function encodeBracket(state: BracketState): string {
  const bytes: number[] = [VERSION];

  // groups: permutation of each group's draw order
  for (const g of GROUP_IDS) {
    const draw = GROUPS_BY_ID[g].teamIds;
    const perm = state.groups[g].map((id) => draw.indexOf(id));
    bytes.push(perm.every((x) => x >= 0) ? permToIndex(perm) : 0);
  }

  // thirds bitmask (12 bits)
  let mask = 0;
  GROUP_IDS.forEach((g, i) => {
    if (state.thirdPlaceQualifiers.includes(g)) mask |= 1 << i;
  });
  bytes.push(mask & 0xff, (mask >> 8) & 0x0f);

  // knockout winners as home/away codes, derived from the resolved bracket
  const resolved = resolveBracket(state);
  const codes = KO_IDS.map((id) => {
    const rm = resolved.matches[id];
    const w = rm?.winner ?? null;
    if (!w || !rm) return 0;
    if (w === rm.home) return 1;
    if (w === rm.away) return 2;
    return 0;
  });
  for (let i = 0; i < codes.length; i += 4) {
    bytes.push(
      (codes[i] || 0) |
        ((codes[i + 1] || 0) << 2) |
        ((codes[i + 2] || 0) << 4) |
        ((codes[i + 3] || 0) << 6),
    );
  }

  return bytesToB64url(bytes);
}

/** Decode a code back into a full bracket prediction, or null if invalid. */
export function decodeBracket(code: string): BracketState | null {
  try {
    const bytes = b64urlToBytes(code);
    if (bytes.length < 15 || bytes[0] !== VERSION) return null;

    const state = createInitialState();

    // groups
    GROUP_IDS.forEach((g, i) => {
      const draw = GROUPS_BY_ID[g].teamIds;
      const perm = indexToPerm(bytes[1 + i] % 24);
      state.groups[g] = perm.map((p) => draw[p]) as GroupStanding;
    });

    // thirds
    const mask = bytes[13] | (bytes[14] << 8);
    const thirds: GroupId[] = [];
    GROUP_IDS.forEach((g, i) => {
      if (mask & (1 << i)) thirds.push(g);
    });
    state.thirdPlaceQualifiers = thirds.slice(0, 8);

    // knockout winners: unpack 2-bit codes, apply progressively so each round's
    // home/away is resolved from earlier picks before we read it.
    const codes: number[] = [];
    for (let i = 15; i < bytes.length; i++) {
      codes.push(bytes[i] & 3, (bytes[i] >> 2) & 3, (bytes[i] >> 4) & 3, (bytes[i] >> 6) & 3);
    }
    state.winners = {};
    KO_IDS.forEach((id, i) => {
      const c = codes[i] ?? 0;
      if (c === 0) return;
      const rm = resolveBracket(state).matches[id];
      const team = c === 1 ? rm?.home : rm?.away;
      if (team) state.winners[id] = team;
    });

    return state;
  } catch {
    return null;
  }
}

/** Build a full share URL for the current origin + base path. */
export function shareUrl(state: BracketState): string {
  const code = encodeBracket(state);
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/?p=${code}`;
}

/** Read a `?p=` code from the current hash, if present. */
export function readShareCodeFromHash(): string | null {
  const hash = window.location.hash || '';
  const qi = hash.indexOf('?');
  if (qi < 0) return null;
  const params = new URLSearchParams(hash.slice(qi + 1));
  return params.get('p');
}
