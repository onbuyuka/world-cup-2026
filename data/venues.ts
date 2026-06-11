import type { Venue } from '../types';

// 16 host venues. utcOffset reflects the offset in effect during the tournament
// (US/Canada on daylight time; Mexico stays on standard time = UTC-6).
export const VENUES: Record<string, Venue> = {
  azteca:    { id: 'azteca',    stadium: 'Estadio Azteca',         city: 'Mexico City',            country: 'Mexico', utcOffset: '-06:00' },
  akron:     { id: 'akron',     stadium: 'Estadio Akron',          city: 'Guadalajara',            country: 'Mexico', utcOffset: '-06:00' },
  bbva:      { id: 'bbva',      stadium: 'Estadio BBVA',           city: 'Monterrey',              country: 'Mexico', utcOffset: '-06:00' },
  att:       { id: 'att',       stadium: 'AT&T Stadium',           city: 'Dallas',                 country: 'USA',    utcOffset: '-05:00' },
  nrg:       { id: 'nrg',       stadium: 'NRG Stadium',            city: 'Houston',                country: 'USA',    utcOffset: '-05:00' },
  arrowhead: { id: 'arrowhead', stadium: 'Arrowhead Stadium',      city: 'Kansas City',            country: 'USA',    utcOffset: '-05:00' },
  mercedes:  { id: 'mercedes',  stadium: 'Mercedes-Benz Stadium',  city: 'Atlanta',                country: 'USA',    utcOffset: '-04:00' },
  hardrock:  { id: 'hardrock',  stadium: 'Hard Rock Stadium',      city: 'Miami',                  country: 'USA',    utcOffset: '-04:00' },
  gillette:  { id: 'gillette',  stadium: 'Gillette Stadium',       city: 'Boston',                 country: 'USA',    utcOffset: '-04:00' },
  lincoln:   { id: 'lincoln',   stadium: 'Lincoln Financial Field',city: 'Philadelphia',           country: 'USA',    utcOffset: '-04:00' },
  metlife:   { id: 'metlife',   stadium: 'MetLife Stadium',        city: 'New York / New Jersey',  country: 'USA',    utcOffset: '-04:00' },
  bmo:       { id: 'bmo',       stadium: 'BMO Field',              city: 'Toronto',                country: 'Canada', utcOffset: '-04:00' },
  lumen:     { id: 'lumen',     stadium: 'Lumen Field',            city: 'Seattle',                country: 'USA',    utcOffset: '-07:00' },
  levis:     { id: 'levis',     stadium: "Levi's Stadium",         city: 'San Francisco Bay Area', country: 'USA',    utcOffset: '-07:00' },
  sofi:      { id: 'sofi',      stadium: 'SoFi Stadium',           city: 'Los Angeles',            country: 'USA',    utcOffset: '-07:00' },
  bcplace:   { id: 'bcplace',   stadium: 'BC Place',               city: 'Vancouver',              country: 'Canada', utcOffset: '-07:00' },
};

export const venue = (id: string): Venue => VENUES[id];
