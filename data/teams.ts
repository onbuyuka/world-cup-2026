import type { Team } from '../types';
import { KIT_OVERRIDES } from './kits';
import { SQUADS } from './squads';
import { RECENT_FORM } from './recentForm';

// ---------------------------------------------------------------------------
// All 48 qualified teams for the 2026 FIFA World Cup.
// Group + draw position from the Final Draw (5 Dec 2025).
// fifaRank = FIFA Men's World Ranking (pre-tournament, June 2026).
// Kit colours are used to render SVG jerseys (no copyrighted imagery).
// squad / recentForm are populated for verified teams and extended over time.
// ---------------------------------------------------------------------------

export const TEAMS: Team[] = [
  // ----- GROUP A -----------------------------------------------------------
  {
    id: 'mexico', name: 'Mexico', code: 'MEX', flag: '🇲🇽', group: 'A', groupPos: 1,
    confederation: 'CONCACAF', fifaRank: 14, host: true, coach: 'Javier Aguirre',
    mylineupsSlug: 'mexico', note: 'Co-host · opens the tournament',
    kits: {
      home: { body: '#0c7c45', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
      away: { body: '#ffffff', accent: '#0c7c45', ink: '#0c7c45', label: 'White' },
    },
  },
  {
    id: 'south-africa', name: 'South Africa', code: 'RSA', flag: '🇿🇦', group: 'A', groupPos: 2,
    confederation: 'CAF', fifaRank: 60, coach: 'Hugo Broos',
    mylineupsSlug: 'south-africa',
    kits: {
      home: { body: '#f4c20d', accent: '#0a7d3b', ink: '#0a7d3b', label: 'Gold' },
      away: { body: '#0a7d3b', accent: '#f4c20d', ink: '#ffffff', label: 'Green' },
    },
  },
  {
    id: 'south-korea', name: 'South Korea', code: 'KOR', flag: '🇰🇷', group: 'A', groupPos: 3,
    confederation: 'AFC', fifaRank: 25, coach: 'Hong Myung-bo',
    mylineupsSlug: 'south-korea',
    kits: {
      home: { body: '#c8102e', accent: '#0a3161', ink: '#ffffff', label: 'Red' },
      away: { body: '#0a1a3f', accent: '#c8102e', ink: '#ffffff', label: 'Navy' },
    },
  },
  {
    id: 'czechia', name: 'Czech Republic', code: 'CZE', flag: '🇨🇿', group: 'A', groupPos: 4,
    confederation: 'UEFA', fifaRank: 40, coach: 'Ivan Hašek',
    mylineupsSlug: 'czechia',
    kits: {
      home: { body: '#d7141a', accent: '#11457e', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#11457e', ink: '#11457e', label: 'White' },
    },
  },

  // ----- GROUP B -----------------------------------------------------------
  {
    id: 'canada', name: 'Canada', code: 'CAN', flag: '🇨🇦', group: 'B', groupPos: 1,
    confederation: 'CONCACAF', fifaRank: 30, host: true, coach: 'Jesse Marsch',
    mylineupsSlug: 'canada', note: 'Co-host',
    kits: {
      home: { body: '#d52b1e', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#d52b1e', ink: '#d52b1e', label: 'White' },
    },
  },
  {
    id: 'bosnia-and-herzegovina', name: 'Bosnia and Herzegovina', code: 'BIH', flag: '🇧🇦', group: 'B', groupPos: 2,
    confederation: 'UEFA', fifaRank: 64, coach: 'Sergej Barbarez',
    mylineupsSlug: 'bosnia-and-herzegovina',
    kits: {
      home: { body: '#002395', accent: '#ffec00', ink: '#ffffff', label: 'Blue' },
      away: { body: '#ffffff', accent: '#002395', ink: '#002395', label: 'White' },
    },
  },
  {
    id: 'qatar', name: 'Qatar', code: 'QAT', flag: '🇶🇦', group: 'B', groupPos: 3,
    confederation: 'AFC', fifaRank: 56, coach: 'Julen Lopetegui',
    mylineupsSlug: 'qatar',
    kits: {
      home: { body: '#8a1538', accent: '#ffffff', ink: '#ffffff', label: 'Maroon' },
      away: { body: '#ffffff', accent: '#8a1538', ink: '#8a1538', label: 'White' },
    },
  },
  {
    id: 'switzerland', name: 'Switzerland', code: 'SUI', flag: '🇨🇭', group: 'B', groupPos: 4,
    confederation: 'UEFA', fifaRank: 19, coach: 'Murat Yakin',
    mylineupsSlug: 'switzerland',
    kits: {
      home: { body: '#da291c', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#da291c', ink: '#da291c', label: 'White' },
    },
  },

  // ----- GROUP C -----------------------------------------------------------
  {
    id: 'brazil', name: 'Brazil', code: 'BRA', flag: '🇧🇷', group: 'C', groupPos: 1,
    confederation: 'CONMEBOL', fifaRank: 6, coach: 'Carlo Ancelotti',
    mylineupsSlug: 'brazil', note: '5-time world champions',
    kits: {
      home: { body: '#ffdf00', accent: '#009b3a', ink: '#009b3a', label: 'Yellow' },
      away: { body: '#002776', accent: '#ffdf00', ink: '#ffffff', label: 'Blue' },
    },
  },
  {
    id: 'morocco', name: 'Morocco', code: 'MAR', flag: '🇲🇦', group: 'C', groupPos: 2,
    confederation: 'CAF', fifaRank: 7, coach: 'Walid Regragui',
    mylineupsSlug: 'morocco', note: '2022 semi-finalists',
    kits: {
      home: { body: '#c1272d', accent: '#006233', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#c1272d', ink: '#006233', label: 'White' },
    },
  },
  {
    id: 'haiti', name: 'Haiti', code: 'HAI', flag: '🇭🇹', group: 'C', groupPos: 3,
    confederation: 'CONCACAF', fifaRank: 83, coach: 'Sébastien Migné',
    mylineupsSlug: 'haiti', note: 'First WC since 1974',
    kits: {
      home: { body: '#00209f', accent: '#d21034', ink: '#ffffff', label: 'Blue' },
      away: { body: '#d21034', accent: '#00209f', ink: '#ffffff', label: 'Red' },
    },
  },
  {
    id: 'scotland', name: 'Scotland', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', groupPos: 4,
    confederation: 'UEFA', fifaRank: 42, coach: 'Steve Clarke',
    mylineupsSlug: 'scotland', note: 'First WC since 1998',
    kits: {
      home: { body: '#0a378c', accent: '#ffffff', ink: '#ffffff', label: 'Navy' },
      away: { body: '#ffffff', accent: '#0a378c', ink: '#0a378c', label: 'White' },
    },
  },

  // ----- GROUP D -----------------------------------------------------------
  {
    id: 'usa', name: 'United States', code: 'USA', flag: '🇺🇸', group: 'D', groupPos: 1,
    confederation: 'CONCACAF', fifaRank: 17, host: true, coach: 'Mauricio Pochettino',
    mylineupsSlug: 'usa', note: 'Co-host',
    kits: {
      home: { body: '#ffffff', accent: '#1d3461', ink: '#1d3461', label: 'White' },
      away: { body: '#1d2d5c', accent: '#bf0a30', ink: '#ffffff', label: 'Navy' },
    },
  },
  {
    id: 'paraguay', name: 'Paraguay', code: 'PAR', flag: '🇵🇾', group: 'D', groupPos: 2,
    confederation: 'CONMEBOL', fifaRank: 41, coach: 'Gustavo Alfaro',
    mylineupsSlug: 'paraguay',
    kits: {
      home: { body: '#da121a', accent: '#0038a8', ink: '#ffffff', pattern: 'stripes', label: 'Red & white stripes' },
      away: { body: '#0038a8', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
    },
  },
  {
    id: 'australia', name: 'Australia', code: 'AUS', flag: '🇦🇺', group: 'D', groupPos: 3,
    confederation: 'AFC', fifaRank: 26, coach: 'Tony Popovic',
    mylineupsSlug: 'australia',
    kits: {
      home: { body: '#fedd00', accent: '#00843d', ink: '#00843d', label: 'Gold' },
      away: { body: '#00843d', accent: '#fedd00', ink: '#ffffff', label: 'Green' },
    },
  },
  {
    id: 'turkiye', name: 'Türkiye', code: 'TUR', flag: '🇹🇷', group: 'D', groupPos: 4,
    confederation: 'UEFA', fifaRank: 22, coach: 'Vincenzo Montella',
    mylineupsSlug: 'turkiye', note: 'First WC since 2002',
    kits: {
      home: { body: '#e30a17', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#e30a17', ink: '#e30a17', label: 'White' },
    },
  },

  // ----- GROUP E -----------------------------------------------------------
  {
    id: 'germany', name: 'Germany', code: 'GER', flag: '🇩🇪', group: 'E', groupPos: 1,
    confederation: 'UEFA', fifaRank: 10, coach: 'Julian Nagelsmann',
    mylineupsSlug: 'germany', note: '4-time world champions',
    kits: {
      home: { body: '#ffffff', accent: '#1a1a1a', ink: '#1a1a1a', label: 'White' },
      away: { body: '#16161a', accent: '#dd0000', ink: '#ffffff', label: 'Black' },
    },
  },
  {
    id: 'curacao', name: 'Curaçao', code: 'CUW', flag: '🇨🇼', group: 'E', groupPos: 2,
    confederation: 'CONCACAF', fifaRank: 82, coach: 'Dick Advocaat',
    mylineupsSlug: 'curacao', note: 'Debut · smallest nation ever to qualify',
    kits: {
      home: { body: '#002b7f', accent: '#f9d616', ink: '#ffffff', label: 'Blue' },
      away: { body: '#ffffff', accent: '#002b7f', ink: '#002b7f', label: 'White' },
    },
  },
  {
    id: 'ivory-coast', name: 'Ivory Coast', code: 'CIV', flag: '🇨🇮', group: 'E', groupPos: 3,
    confederation: 'CAF', fifaRank: 33, coach: 'Emerse Faé',
    mylineupsSlug: 'ivory-coast',
    kits: {
      home: { body: '#ff8200', accent: '#009639', ink: '#ffffff', label: 'Orange' },
      away: { body: '#ffffff', accent: '#ff8200', ink: '#009639', label: 'White' },
    },
  },
  {
    id: 'ecuador', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', group: 'E', groupPos: 4,
    confederation: 'CONMEBOL', fifaRank: 23, coach: 'Sebastián Beccacece',
    mylineupsSlug: 'ecuador',
    kits: {
      home: { body: '#ffd100', accent: '#0033a0', ink: '#0033a0', label: 'Yellow' },
      away: { body: '#0a1f63', accent: '#ffd100', ink: '#ffffff', label: 'Navy' },
    },
  },

  // ----- GROUP F -----------------------------------------------------------
  {
    id: 'netherlands', name: 'Netherlands', code: 'NED', flag: '🇳🇱', group: 'F', groupPos: 1,
    confederation: 'UEFA', fifaRank: 8, coach: 'Ronald Koeman',
    mylineupsSlug: 'netherlands',
    kits: {
      home: { body: '#f36c21', accent: '#ffffff', ink: '#ffffff', label: 'Orange' },
      away: { body: '#21468b', accent: '#f36c21', ink: '#ffffff', label: 'Blue' },
    },
  },
  {
    id: 'japan', name: 'Japan', code: 'JPN', flag: '🇯🇵', group: 'F', groupPos: 2,
    confederation: 'AFC', fifaRank: 18, coach: 'Hajime Moriyasu',
    mylineupsSlug: 'japan',
    kits: {
      home: { body: '#0d1b6b', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
      away: { body: '#ffffff', accent: '#0d1b6b', ink: '#0d1b6b', label: 'White' },
    },
  },
  {
    id: 'sweden', name: 'Sweden', code: 'SWE', flag: '🇸🇪', group: 'F', groupPos: 3,
    confederation: 'UEFA', fifaRank: 38, coach: 'Graham Potter',
    mylineupsSlug: 'sweden',
    kits: {
      home: { body: '#fecc00', accent: '#005293', ink: '#005293', label: 'Yellow' },
      away: { body: '#005293', accent: '#fecc00', ink: '#ffffff', label: 'Navy' },
    },
  },
  {
    id: 'tunisia', name: 'Tunisia', code: 'TUN', flag: '🇹🇳', group: 'F', groupPos: 4,
    confederation: 'CAF', fifaRank: 45, coach: 'Sami Trabelsi',
    mylineupsSlug: 'tunisia',
    kits: {
      home: { body: '#e70013', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#e70013', ink: '#e70013', label: 'White' },
    },
  },

  // ----- GROUP G -----------------------------------------------------------
  {
    id: 'belgium', name: 'Belgium', code: 'BEL', flag: '🇧🇪', group: 'G', groupPos: 1,
    confederation: 'UEFA', fifaRank: 9, coach: 'Rudi Garcia',
    mylineupsSlug: 'belgium',
    kits: {
      home: { body: '#e30613', accent: '#1a1a1a', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#e30613', ink: '#1a1a1a', label: 'White' },
    },
  },
  {
    id: 'egypt', name: 'Egypt', code: 'EGY', flag: '🇪🇬', group: 'G', groupPos: 2,
    confederation: 'CAF', fifaRank: 29, coach: 'Hossam Hassan',
    mylineupsSlug: 'egypt',
    kits: {
      home: { body: '#ce1126', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#1a1a1a', ink: '#1a1a1a', label: 'White' },
    },
  },
  {
    id: 'iran', name: 'Iran', code: 'IRN', flag: '🇮🇷', group: 'G', groupPos: 3,
    confederation: 'AFC', fifaRank: 20, coach: 'Amir Ghalenoei',
    mylineupsSlug: 'iran',
    kits: {
      home: { body: '#ffffff', accent: '#239f40', ink: '#239f40', label: 'White' },
      away: { body: '#c8102e', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    },
  },
  {
    id: 'new-zealand', name: 'New Zealand', code: 'NZL', flag: '🇳🇿', group: 'G', groupPos: 4,
    confederation: 'OFC', fifaRank: 85, coach: 'Darren Bazeley',
    mylineupsSlug: 'new-zealand', note: 'Lowest-ranked qualifier',
    kits: {
      home: { body: '#ffffff', accent: '#1a1a1a', ink: '#1a1a1a', label: 'White' },
      away: { body: '#0a0a0a', accent: '#ffffff', ink: '#ffffff', label: 'Black' },
    },
  },

  // ----- GROUP H -----------------------------------------------------------
  {
    id: 'spain', name: 'Spain', code: 'ESP', flag: '🇪🇸', group: 'H', groupPos: 1,
    confederation: 'UEFA', fifaRank: 2, coach: 'Luis de la Fuente',
    mylineupsSlug: 'spain', note: 'Euro 2024 champions',
    kits: {
      home: { body: '#c60b1e', accent: '#ffc400', ink: '#ffffff', label: 'Red' },
      away: { body: '#0b1f4d', accent: '#ffc400', ink: '#ffffff', label: 'Navy' },
    },
  },
  {
    id: 'cape-verde', name: 'Cape Verde', code: 'CPV', flag: '🇨🇻', group: 'H', groupPos: 2,
    confederation: 'CAF', fifaRank: 67, coach: 'Pedro Leitão Brito (Bubista)',
    mylineupsSlug: 'cape-verde', note: 'Debut',
    kits: {
      home: { body: '#003893', accent: '#cf2027', ink: '#ffffff', label: 'Blue' },
      away: { body: '#ffffff', accent: '#003893', ink: '#003893', label: 'White' },
    },
  },
  {
    id: 'saudi-arabia', name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', group: 'H', groupPos: 3,
    confederation: 'AFC', fifaRank: 61, coach: 'Hervé Renard',
    mylineupsSlug: 'saudi-arabia',
    kits: {
      home: { body: '#ffffff', accent: '#006c35', ink: '#006c35', label: 'White' },
      away: { body: '#006c35', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
    },
  },
  {
    id: 'uruguay', name: 'Uruguay', code: 'URU', flag: '🇺🇾', group: 'H', groupPos: 4,
    confederation: 'CONMEBOL', fifaRank: 16, coach: 'Marcelo Bielsa',
    mylineupsSlug: 'uruguay',
    kits: {
      home: { body: '#4f9fd6', accent: '#1a1a1a', ink: '#ffffff', label: 'Celeste' },
      away: { body: '#ffffff', accent: '#4f9fd6', ink: '#1a1a1a', label: 'White' },
    },
  },

  // ----- GROUP I -----------------------------------------------------------
  {
    id: 'france', name: 'France', code: 'FRA', flag: '🇫🇷', group: 'I', groupPos: 1,
    confederation: 'UEFA', fifaRank: 3, coach: 'Didier Deschamps',
    mylineupsSlug: 'france', note: '2018 champions, 2022 finalists',
    kits: {
      home: { body: '#21366b', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
      away: { body: '#ffffff', accent: '#21366b', ink: '#c8102e', label: 'White' },
    },
  },
  {
    id: 'senegal', name: 'Senegal', code: 'SEN', flag: '🇸🇳', group: 'I', groupPos: 2,
    confederation: 'CAF', fifaRank: 15, coach: 'Pape Thiaw',
    mylineupsSlug: 'senegal',
    kits: {
      home: { body: '#ffffff', accent: '#00853f', ink: '#00853f', label: 'White' },
      away: { body: '#00853f', accent: '#fdef42', ink: '#ffffff', label: 'Green' },
    },
  },
  {
    id: 'iraq', name: 'Iraq', code: 'IRQ', flag: '🇮🇶', group: 'I', groupPos: 3,
    confederation: 'AFC', fifaRank: 57, coach: 'Graham Arnold',
    mylineupsSlug: 'iraq', note: 'First WC since 1986',
    kits: {
      home: { body: '#ffffff', accent: '#007a3d', ink: '#007a3d', label: 'White' },
      away: { body: '#007a3d', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
    },
  },
  {
    id: 'norway', name: 'Norway', code: 'NOR', flag: '🇳🇴', group: 'I', groupPos: 4,
    confederation: 'UEFA', fifaRank: 31, coach: 'Ståle Solbakken',
    mylineupsSlug: 'norway', note: 'First WC since 1998',
    kits: {
      home: { body: '#c8102e', accent: '#00205b', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#00205b', ink: '#00205b', label: 'White' },
    },
  },

  // ----- GROUP J -----------------------------------------------------------
  {
    id: 'argentina', name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'J', groupPos: 1,
    confederation: 'CONMEBOL', fifaRank: 1, coach: 'Lionel Scaloni',
    mylineupsSlug: 'argentina', note: 'Defending champions', dataVerified: true,
    kits: {
      home: { body: '#75aadb', accent: '#ffffff', ink: '#0a0a0a', pattern: 'stripes', label: 'Sky-blue & white stripes' },
      away: { body: '#1b1f5e', accent: '#75aadb', ink: '#ffffff', label: 'Navy' },
    },
    recentForm: [
      { date: '2026-06-10', opponent: 'Iceland', opponentFlag: '🇮🇸', score: '3-0', result: 'W', competition: 'Friendly', home: true },
      { date: '2026-06-06', opponent: 'Honduras', opponentFlag: '🇭🇳', score: '2-0', result: 'W', competition: 'Friendly', home: true },
      { date: '2026-03-31', opponent: 'Zambia', opponentFlag: '🇿🇲', score: '5-0', result: 'W', competition: 'Friendly', home: true },
      { date: '2026-03-27', opponent: 'Mauritania', opponentFlag: '🇲🇷', score: '2-1', result: 'W', competition: 'Friendly', home: true },
    ],
    squad: [
      { number: 1, position: 'GK', name: 'Juan Musso', club: 'Atlético Madrid (ESP)', fmId: '389050' },
      { number: 12, position: 'GK', name: 'Gerónimo Rulli', club: 'Marseille (FRA)', fmId: '245555' },
      { number: 23, position: 'GK', name: 'Emiliano Martínez', club: 'Aston Villa (ENG)', fmId: '268375' },
      { number: 3, position: 'DF', name: 'Nicolás Tagliafico', club: 'Lyon (FRA)', fmId: '195750' },
      { number: 4, position: 'DF', name: 'Gonzalo Montiel', club: 'River Plate (ARG)', fmId: '687008' },
      { number: 6, position: 'DF', name: 'Lisandro Martínez', club: 'Manchester United (ENG)', fmId: '847983' },
      { number: 8, position: 'DF', name: 'Valentín Barco', club: 'Strasbourg (FRA)', fmId: '1272440' },
      { number: 13, position: 'DF', name: 'Cristian Romero', club: 'Tottenham Hotspur (ENG)', fmId: '789066' },
      { number: 19, position: 'DF', name: 'Nicolás Otamendi', club: 'Benfica (POR)', fmId: '174321' },
      { number: 25, position: 'DF', name: 'Facundo Medina', club: 'Marseille (FRA)', fmId: '812652' },
      { number: 26, position: 'DF', name: 'Nahuel Molina', club: 'Atlético Madrid (ESP)', fmId: '726345' },
      { number: 5, position: 'MF', name: 'Leandro Paredes', club: 'Boca Juniors (ARG)', fmId: '237606' },
      { number: 7, position: 'MF', name: 'Rodrigo De Paul', club: 'Inter Miami (USA)', fmId: '324578' },
      { number: 11, position: 'MF', name: 'Giovani Lo Celso', club: 'Real Betis (ESP)', fmId: '604126' },
      { number: 14, position: 'MF', name: 'Exequiel Palacios', club: 'Bayer Leverkusen (GER)', fmId: '693599' },
      { number: 16, position: 'MF', name: 'Thiago Almada', club: 'Atlético Madrid (ESP)', fmId: '955271' },
      { number: 18, position: 'MF', name: 'Nico Paz', club: 'Como (ITA)', fmId: '1347574' },
      { number: 20, position: 'MF', name: 'Alexis Mac Allister', club: 'Liverpool (ENG)', fmId: '831489' },
      { number: 24, position: 'MF', name: 'Enzo Fernández', club: 'Chelsea (ENG)', fmId: '1137705' },
      { number: 9, position: 'FW', name: 'Julián Álvarez', club: 'Atlético Madrid (ESP)', fmId: '974753' },
      { number: 10, position: 'FW', name: 'Lionel Messi', club: 'Inter Miami (USA)', captain: true, fmId: '30981' },
      { number: 15, position: 'FW', name: 'Nicolás González', club: 'Atlético Madrid (ESP)', fmId: '841672' },
      { number: 17, position: 'FW', name: 'Giuliano Simeone', club: 'Atlético Madrid (ESP)', fmId: '1226147' },
      { number: 21, position: 'FW', name: 'José Manuel López', club: 'Palmeiras (BRA)', fmId: '1216079' },
      { number: 22, position: 'FW', name: 'Lautaro Martínez', club: 'Internazionale (ITA)', fmId: '690230' },
    ],
  },
  {
    id: 'algeria', name: 'Algeria', code: 'ALG', flag: '🇩🇿', group: 'J', groupPos: 2,
    confederation: 'CAF', fifaRank: 28, coach: 'Vladimir Petković',
    mylineupsSlug: 'algeria',
    kits: {
      home: { body: '#ffffff', accent: '#006233', ink: '#006233', label: 'White' },
      away: { body: '#006233', accent: '#ffffff', ink: '#ffffff', label: 'Green' },
    },
  },
  {
    id: 'austria', name: 'Austria', code: 'AUT', flag: '🇦🇹', group: 'J', groupPos: 3,
    confederation: 'UEFA', fifaRank: 24, coach: 'Ralf Rangnick',
    mylineupsSlug: 'austria',
    kits: {
      home: { body: '#ed2939', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#ed2939', ink: '#ed2939', label: 'White' },
    },
  },
  {
    id: 'jordan', name: 'Jordan', code: 'JOR', flag: '🇯🇴', group: 'J', groupPos: 4,
    confederation: 'AFC', fifaRank: 63, coach: 'Jamal Sellami',
    mylineupsSlug: 'jordan', note: 'Debut',
    kits: {
      home: { body: '#ffffff', accent: '#ce1126', ink: '#ce1126', label: 'White' },
      away: { body: '#ce1126', accent: '#1a1a1a', ink: '#ffffff', label: 'Red' },
    },
  },

  // ----- GROUP K -----------------------------------------------------------
  {
    id: 'portugal', name: 'Portugal', code: 'POR', flag: '🇵🇹', group: 'K', groupPos: 1,
    confederation: 'UEFA', fifaRank: 5, coach: 'Roberto Martínez',
    mylineupsSlug: 'portugal',
    kits: {
      home: { body: '#a3142e', accent: '#006600', ink: '#ffffff', label: 'Red' },
      away: { body: '#ffffff', accent: '#a3142e', ink: '#006600', label: 'White' },
    },
  },
  {
    id: 'dr-congo', name: 'DR Congo', code: 'COD', flag: '🇨🇩', group: 'K', groupPos: 2,
    confederation: 'CAF', fifaRank: 46, coach: 'Sébastien Desabre',
    mylineupsSlug: 'dr-congo', note: 'First WC since 1974 (as Zaire)',
    kits: {
      home: { body: '#007fff', accent: '#f7d518', ink: '#ffffff', label: 'Sky blue' },
      away: { body: '#ce1021', accent: '#f7d518', ink: '#ffffff', label: 'Red' },
    },
  },
  {
    id: 'uzbekistan', name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', group: 'K', groupPos: 3,
    confederation: 'AFC', fifaRank: 50, coach: 'Timur Kapadze',
    mylineupsSlug: 'uzbekistan', note: 'Debut',
    kits: {
      home: { body: '#ffffff', accent: '#0099b5', ink: '#0099b5', label: 'White' },
      away: { body: '#0099b5', accent: '#ffffff', ink: '#ffffff', label: 'Blue' },
    },
  },
  {
    id: 'colombia', name: 'Colombia', code: 'COL', flag: '🇨🇴', group: 'K', groupPos: 4,
    confederation: 'CONMEBOL', fifaRank: 13, coach: 'Néstor Lorenzo',
    mylineupsSlug: 'colombia',
    kits: {
      home: { body: '#ffcd00', accent: '#003087', ink: '#003087', label: 'Yellow' },
      away: { body: '#0b1f63', accent: '#ffcd00', ink: '#ffffff', label: 'Navy' },
    },
  },

  // ----- GROUP L -----------------------------------------------------------
  {
    id: 'england', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', groupPos: 1,
    confederation: 'UEFA', fifaRank: 4, coach: 'Thomas Tuchel',
    mylineupsSlug: 'england',
    kits: {
      home: { body: '#ffffff', accent: '#0a3161', ink: '#0a3161', label: 'White' },
      away: { body: '#c8102e', accent: '#ffffff', ink: '#ffffff', label: 'Red' },
    },
  },
  {
    id: 'croatia', name: 'Croatia', code: 'CRO', flag: '🇭🇷', group: 'L', groupPos: 2,
    confederation: 'UEFA', fifaRank: 11, coach: 'Zlatko Dalić',
    mylineupsSlug: 'croatia', note: '2018 finalists, 2022 third place',
    kits: {
      home: { body: '#d10000', accent: '#ffffff', ink: '#ffffff', pattern: 'stripes', label: 'Red & white check' },
      away: { body: '#0b1f63', accent: '#ffffff', ink: '#ffffff', label: 'Navy' },
    },
  },
  {
    id: 'ghana', name: 'Ghana', code: 'GHA', flag: '🇬🇭', group: 'L', groupPos: 3,
    confederation: 'CAF', fifaRank: 73, coach: 'Otto Addo',
    mylineupsSlug: 'ghana',
    kits: {
      home: { body: '#ffffff', accent: '#ce1126', ink: '#006b3f', label: 'White' },
      away: { body: '#0a0a0a', accent: '#fcd116', ink: '#ffffff', label: 'Black' },
    },
  },
  {
    id: 'panama', name: 'Panama', code: 'PAN', flag: '🇵🇦', group: 'L', groupPos: 4,
    confederation: 'CONCACAF', fifaRank: 34, coach: 'Thomas Christiansen',
    mylineupsSlug: 'panama',
    kits: {
      home: { body: '#da121a', accent: '#005293', ink: '#ffffff', label: 'Red' },
      away: { body: '#0b1f63', accent: '#da121a', ink: '#ffffff', label: 'Navy' },
    },
  },
];

// --- Derived lookups --------------------------------------------------------

// Apply researched kit colours (data/kits.ts) over the inline defaults so kit
// data lives in one authoritative place.
for (const t of TEAMS) {
  const override = KIT_OVERRIDES[t.id];
  if (override) t.kits = override;
  // Apply researched squads (data/squads.ts); Argentina stays defined inline.
  const squad = SQUADS[t.id];
  if (squad && (!t.squad || t.squad.length === 0)) {
    t.squad = squad;
    t.dataVerified = true;
  }
  // Apply recent form (data/recentForm.ts); Argentina stays defined inline.
  const form = RECENT_FORM[t.id];
  if (form && (!t.recentForm || t.recentForm.length === 0)) {
    t.recentForm = form;
  }
}

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);

export const getTeam = (id: string | undefined): Team | undefined =>
  id ? TEAMS_BY_ID[id] : undefined;

export const mylineupsUrl = (t: Team): string =>
  `https://mylineups.app/world-cup-2026/teams/${t.mylineupsSlug}`;
