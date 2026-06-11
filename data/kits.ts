import type { Kit } from '../types';

// ---------------------------------------------------------------------------
// Per-team kit colours (home + away), researched per group and normalised to
// the Kit model. We render our own SVG jersey from these — only colours and a
// pattern category are stored (no copyrighted artwork, logos or sponsors).
//
// Obvious research errors were corrected against each team's well-known kit
// identity (e.g. Mexico/Ecuador/Czechia home shirts are solid, not patterned).
// ---------------------------------------------------------------------------

export const KIT_OVERRIDES: Record<string, { home: Kit; away: Kit }> = {
  // ----- Group A -----
  mexico: {
    home: { body: '#0c7c45', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
    away: { body: '#ffffff', accent: '#0c7c45', ink: '#0c7c45', label: 'White' },
  },
  'south-africa': {
    home: { body: '#f4c20d', accent: '#0a7d3b', ink: '#0a3d1f', label: 'Gold' },
    away: { body: '#0a7d3b', accent: '#f4c20d', ink: '#ffffff', label: 'Green' },
  },
  'south-korea': {
    home: { body: '#c8102e', accent: '#0a3161', ink: '#ffffff', label: 'Red' },
    away: { body: '#0a1a3f', accent: '#c8102e', ink: '#ffffff', label: 'Navy' },
  },
  czechia: {
    home: { body: '#d7141a', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#11457e', ink: '#11457e', label: 'White' },
  },

  // ----- Group B -----
  canada: {
    home: { body: '#d52b1e', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#d52b1e', ink: '#d52b1e', label: 'White' },
  },
  'bosnia-and-herzegovina': {
    home: { body: '#002395', accent: '#ffec00', ink: '#ffffff', label: 'Blue' },
    away: { body: '#ffffff', accent: '#002395', ink: '#002395', label: 'White' },
  },
  qatar: {
    home: { body: '#8a1538', accent: '#ffffff', ink: '#ffffff', label: 'Maroon' },
    away: { body: '#ffffff', accent: '#8a1538', ink: '#8a1538', label: 'White' },
  },
  switzerland: {
    home: { body: '#da291c', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#da291c', ink: '#da291c', label: 'White' },
  },

  // ----- Group C -----
  brazil: {
    home: { body: '#ffdf00', accent: '#009b3a', ink: '#009b3a', label: 'Yellow' },
    away: { body: '#002776', accent: '#ffdf00', ink: '#ffffff', label: 'Blue' },
  },
  morocco: {
    home: { body: '#c1272d', accent: '#006233', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#c1272d', ink: '#006233', label: 'White' },
  },
  haiti: {
    home: { body: '#00209f', accent: '#d21034', ink: '#ffffff', label: 'Blue' },
    away: { body: '#d21034', accent: '#00209f', ink: '#ffffff', label: 'Red' },
  },
  scotland: {
    home: { body: '#0a378c', accent: '#ffffff', ink: '#ffffff', label: 'Navy' },
    away: { body: '#ffffff', accent: '#0a378c', ink: '#0a378c', label: 'White' },
  },

  // ----- Group D -----
  usa: {
    home: { body: '#ffffff', accent: '#1d3461', ink: '#1d3461', label: 'White' },
    away: { body: '#15224b', accent: '#bf0a30', ink: '#ffffff', label: 'Navy' },
  },
  paraguay: {
    home: { body: '#da121a', accent: '#ffffff', ink: '#ffffff', pattern: 'stripes', label: 'Red & white stripes' },
    away: { body: '#0038a8', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
  },
  australia: {
    home: { body: '#fedd00', accent: '#00843d', ink: '#00421f', label: 'Gold' },
    away: { body: '#00843d', accent: '#fedd00', ink: '#ffffff', label: 'Green' },
  },
  turkiye: {
    home: { body: '#e30a17', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#e30a17', ink: '#e30a17', label: 'White' },
  },

  // ----- Group E -----
  germany: {
    home: { body: '#ffffff', accent: '#1a1a1a', ink: '#1a1a1a', label: 'White' },
    away: { body: '#16161a', accent: '#dd0000', ink: '#ffffff', label: 'Black' },
  },
  curacao: {
    home: { body: '#0a3bb0', accent: '#f9d616', ink: '#ffffff', label: 'Blue' },
    away: { body: '#ffffff', accent: '#0a3bb0', ink: '#0a3bb0', label: 'White' },
  },
  'ivory-coast': {
    home: { body: '#ff8200', accent: '#ffffff', ink: '#ffffff', label: 'Orange' },
    away: { body: '#ffffff', accent: '#ff8200', ink: '#ff8200', label: 'White' },
  },
  ecuador: {
    home: { body: '#ffd100', accent: '#0033a0', ink: '#0033a0', label: 'Yellow' },
    away: { body: '#0a1f63', accent: '#ffd100', ink: '#ffffff', label: 'Navy' },
  },

  // ----- Group F -----
  netherlands: {
    home: { body: '#ee7203', accent: '#ffffff', ink: '#ffffff', label: 'Orange' },
    away: { body: '#21468b', accent: '#ee7203', ink: '#ffffff', label: 'Blue' },
  },
  japan: {
    home: { body: '#1b2a6b', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
    away: { body: '#ffffff', accent: '#1b2a6b', ink: '#1b2a6b', label: 'White' },
  },
  sweden: {
    home: { body: '#fecc00', accent: '#005293', ink: '#003a6b', label: 'Yellow' },
    away: { body: '#005293', accent: '#fecc00', ink: '#fecc00', label: 'Navy' },
  },
  tunisia: {
    home: { body: '#e70013', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#e70013', ink: '#e70013', label: 'White' },
  },

  // ----- Group G -----
  belgium: {
    home: { body: '#e30613', accent: '#1a1a1a', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#e30613', ink: '#1a1a1a', label: 'White' },
  },
  egypt: {
    home: { body: '#ce1126', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#1a1a1a', ink: '#1a1a1a', label: 'White' },
  },
  iran: {
    home: { body: '#ffffff', accent: '#239f40', ink: '#239f40', label: 'White' },
    away: { body: '#c8102e', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
  },
  'new-zealand': {
    home: { body: '#ffffff', accent: '#1a1a1a', ink: '#1a1a1a', label: 'White' },
    away: { body: '#0a0a0a', accent: '#ffffff', ink: '#ffffff', label: 'Black' },
  },

  // ----- Group H -----
  spain: {
    home: { body: '#c60b1e', accent: '#ffc400', ink: '#ffffff', label: 'Red' },
    away: { body: '#0b1f4d', accent: '#ffc400', ink: '#ffffff', label: 'Navy' },
  },
  'cape-verde': {
    home: { body: '#003893', accent: '#cf2027', ink: '#ffffff', label: 'Blue' },
    away: { body: '#ffffff', accent: '#003893', ink: '#003893', label: 'White' },
  },
  'saudi-arabia': {
    home: { body: '#ffffff', accent: '#006c35', ink: '#006c35', label: 'White' },
    away: { body: '#006c35', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
  },
  uruguay: {
    home: { body: '#4f9fd6', accent: '#1a1a1a', ink: '#ffffff', label: 'Celeste' },
    away: { body: '#ffffff', accent: '#4f9fd6', ink: '#1a1a1a', label: 'White' },
  },

  // ----- Group I -----
  france: {
    home: { body: '#21366b', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
    away: { body: '#ffffff', accent: '#21366b', ink: '#c8102e', label: 'White' },
  },
  senegal: {
    home: { body: '#ffffff', accent: '#00853f', ink: '#00853f', label: 'White' },
    away: { body: '#00853f', accent: '#fdef42', ink: '#ffffff', label: 'Green' },
  },
  iraq: {
    home: { body: '#ffffff', accent: '#007a3d', ink: '#007a3d', label: 'White' },
    away: { body: '#007a3d', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
  },
  norway: {
    home: { body: '#c8102e', accent: '#00205b', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#00205b', ink: '#00205b', label: 'White' },
  },

  // ----- Group J -----
  argentina: {
    home: { body: '#75aadb', accent: '#ffffff', ink: '#0a0a0a', pattern: 'stripes', label: 'Sky-blue & white stripes' },
    away: { body: '#1b1f5e', accent: '#75aadb', ink: '#ffffff', label: 'Navy' },
  },
  algeria: {
    home: { body: '#ffffff', accent: '#006233', ink: '#006233', label: 'White' },
    away: { body: '#006233', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
  },
  austria: {
    home: { body: '#ed2939', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    away: { body: '#ffffff', accent: '#1a1a1a', ink: '#1a1a1a', label: 'White' },
  },
  jordan: {
    home: { body: '#ffffff', accent: '#ce1126', ink: '#ce1126', label: 'White' },
    away: { body: '#ce1126', accent: '#1a1a1a', ink: '#ffffff', label: 'Red' },
  },

  // ----- Group K -----
  portugal: {
    home: { body: '#7a1228', accent: '#1c6e3c', ink: '#ffffff', label: 'Dark red' },
    away: { body: '#ffffff', accent: '#7a1228', ink: '#7a1228', label: 'White' },
  },
  'dr-congo': {
    home: { body: '#0072ce', accent: '#f7d518', ink: '#ffffff', label: 'Sky blue' },
    away: { body: '#ce1021', accent: '#f7d518', ink: '#ffffff', label: 'Red' },
  },
  uzbekistan: {
    home: { body: '#ffffff', accent: '#0099b5', ink: '#0099b5', label: 'White' },
    away: { body: '#0099b5', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
  },
  colombia: {
    home: { body: '#ffcd00', accent: '#003087', ink: '#003087', label: 'Yellow' },
    away: { body: '#0b1f63', accent: '#ffcd00', ink: '#ffffff', label: 'Navy' },
  },

  // ----- Group L -----
  england: {
    home: { body: '#ffffff', accent: '#0a3161', ink: '#0a3161', label: 'White' },
    away: { body: '#c8102e', accent: '#0a1f3f', ink: '#ffffff', label: 'Red' },
  },
  croatia: {
    home: { body: '#d10000', accent: '#ffffff', ink: '#1a1a1a', pattern: 'stripes', label: 'Red & white checks' },
    away: { body: '#0b1f3f', accent: '#d10000', ink: '#ffffff', label: 'Navy' },
  },
  ghana: {
    home: { body: '#ffffff', accent: '#fcd116', ink: '#1a1a1a', label: 'White' },
    away: { body: '#0a0a0a', accent: '#fcd116', ink: '#ffffff', label: 'Black' },
  },
  panama: {
    home: { body: '#da121a', accent: '#00205b', ink: '#ffffff', label: 'Red' },
    away: { body: '#0b1f63', accent: '#da121a', ink: '#ffffff', label: 'Navy' },
  },
};
