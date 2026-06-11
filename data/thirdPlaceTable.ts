import type { GroupId } from '../types';

// ---------------------------------------------------------------------------
// FIFA World Cup 2026 — Annex C: Round-of-32 allocation of the eight best
// third-placed teams.
//
// Eight group winners face a third-placed team. In the column order used by
// FIFA's official table, those winners are groups A, B, D, E, G, I, K, L —
// i.e. matches 79, 85, 81, 74, 82, 77, 87, 80 respectively.
//
// For each of the 495 possible sets of eight qualifying third-placed groups
// (12 choose 8), the regulations fix exactly which group's third-placed team
// goes to which winner slot. Each entry below is an 8-letter code read
// positionally against SLOT_MATCH_ORDER; the multiset of letters is the eight
// qualifying groups, so the lookup key is simply the sorted code.
//
// Source: FIFA World Cup 2026 Regulations, Annex C (495 combinations), as
// published on the 2026 FIFA World Cup knockout-stage article.
// ---------------------------------------------------------------------------

/** Winner-slot match ids in the table's column order (winners A,B,D,E,G,I,K,L). */
export const SLOT_MATCH_ORDER: readonly number[] = [79, 85, 81, 74, 82, 77, 87, 80];

/** Allowed third-placed groups per slot (same column order as SLOT_MATCH_ORDER). */
export const SLOT_ALLOWED: readonly GroupId[][] = [
  ['C', 'E', 'F', 'H', 'I'], // 79 — Winner A
  ['E', 'F', 'G', 'I', 'J'], // 85 — Winner B
  ['B', 'E', 'F', 'I', 'J'], // 81 — Winner D
  ['A', 'B', 'C', 'D', 'F'], // 74 — Winner E
  ['A', 'E', 'H', 'I', 'J'], // 82 — Winner G
  ['C', 'D', 'F', 'G', 'H'], // 77 — Winner I
  ['D', 'E', 'I', 'J', 'L'], // 87 — Winner K
  ['E', 'H', 'I', 'J', 'K'], // 80 — Winner L
];

export const THIRD_PLACE_ASSIGNMENTS: readonly string[] = [
  /*   1 */ 'EJIFHGLK', 'HGIDJFLK', 'EJIDHGLK', 'EJIDHFLK', 'EGIDJFLK',
  /*   6 */ 'EGJDHFLK', 'EGIDHFLK', 'EGJDHFLI', 'EGJDHFIK', 'HGICJFLK',
  /*  11 */ 'EJICHGLK', 'EJICHFLK', 'EGICJFLK', 'EGJCHFLK', 'EGICHFLK',
  /*  16 */ 'EGJCHFLI', 'EGJCHFIK', 'HGICJDLK', 'CJIDHFLK', 'CGIDJFLK',
  /*  21 */ 'CGJDHFLK', 'CGIDHFLK', 'CGJDHFLI', 'CGJDHFIK', 'EJICHDLK',
  /*  26 */ 'EGICJDLK', 'EGJCHDLK', 'EGICHDLK', 'EGJCHDLI', 'EGJCHDIK',
  /*  31 */ 'CJEDIFLK', 'CJEDHFLK', 'CEIDHFLK', 'CJEDHFLI', 'CJEDHFIK',
  /*  36 */ 'CGEDJFLK', 'CGEDIFLK', 'CGEDJFLI', 'CGEDJFIK', 'CGEDHFLK',
  /*  41 */ 'CGJDHFLE', 'CGJDHFEK', 'CGEDHFLI', 'CGEDHFIK', 'CGJDHFEI',
  /*  46 */ 'HJBFIGLK', 'EJIBHGLK', 'EJBFIHLK', 'EJBFIGLK', 'EJBFHGLK',
  /*  51 */ 'EGBFIHLK', 'EJBFHGLI', 'EJBFHGIK', 'HJBDIGLK', 'HJBDIFLK',
  /*  56 */ 'IGBDJFLK', 'HGBDJFLK', 'HGBDIFLK', 'HGBDJFLI', 'HGBDJFIK',
  /*  61 */ 'EJBDIHLK', 'EJBDIGLK', 'EJBDHGLK', 'EGBDIHLK', 'EJBDHGLI',
  /*  66 */ 'EJBDHGIK', 'EJBDIFLK', 'EJBDHFLK', 'EIBDHFLK', 'EJBDHFLI',
  /*  71 */ 'EJBDHFIK', 'EGBDJFLK', 'EGBDIFLK', 'EGBDJFLI', 'EGBDJFIK',
  /*  76 */ 'EGBDHFLK', 'HGBDJFLE', 'HGBDJFEK', 'EGBDHFLI', 'EGBDHFIK',
  /*  81 */ 'HGBDJFEI', 'HJBCIGLK', 'HJBCIFLK', 'IGBCJFLK', 'HGBCJFLK',
  /*  86 */ 'HGBCIFLK', 'HGBCJFLI', 'HGBCJFIK', 'EJBCIHLK', 'EJBCIGLK',
  /*  91 */ 'EJBCHGLK', 'EGBCIHLK', 'EJBCHGLI', 'EJBCHGIK', 'EJBCIFLK',
  /*  96 */ 'EJBCHFLK', 'EIBCHFLK', 'EJBCHFLI', 'EJBCHFIK', 'EGBCJFLK',
  /* 101 */ 'EGBCIFLK', 'EGBCJFLI', 'EGBCJFIK', 'EGBCHFLK', 'HGBCJFLE',
  /* 106 */ 'HGBCJFEK', 'EGBCHFLI', 'EGBCHFIK', 'HGBCJFEI', 'HJBCIDLK',
  /* 111 */ 'IGBCJDLK', 'HGBCJDLK', 'HGBCIDLK', 'HGBCJDLI', 'HGBCJDIK',
  /* 116 */ 'CJBDIFLK', 'CJBDHFLK', 'CIBDHFLK', 'CJBDHFLI', 'CJBDHFIK',
  /* 121 */ 'CGBDJFLK', 'CGBDIFLK', 'CGBDJFLI', 'CGBDJFIK', 'CGBDHFLK',
  /* 126 */ 'CGBDHFLJ', 'HGBCJFDK', 'CGBDHFLI', 'CGBDHFIK', 'HGBCJFDI',
  /* 131 */ 'EJBCIDLK', 'EJBCHDLK', 'EIBCHDLK', 'EJBCHDLI', 'EJBCHDIK',
  /* 136 */ 'EGBCJDLK', 'EGBCIDLK', 'EGBCJDLI', 'EGBCJDIK', 'EGBCHDLK',
  /* 141 */ 'HGBCJDLE', 'HGBCJDEK', 'EGBCHDLI', 'EGBCHDIK', 'HGBCJDEI',
  /* 146 */ 'CJBDEFLK', 'CEBDIFLK', 'CJBDEFLI', 'CJBDEFIK', 'CEBDHFLK',
  /* 151 */ 'CJBDHFLE', 'CJBDHFEK', 'CEBDHFLI', 'CEBDHFIK', 'CJBDHFEI',
  /* 156 */ 'CGBDEFLK', 'CGBDJFLE', 'CGBDJFEK', 'CGBDEFLI', 'CGBDEFIK',
  /* 161 */ 'CGBDJFEI', 'CGBDHFLE', 'CGBDHFEK', 'HGBCJFDE', 'CGBDHFEI',
  /* 166 */ 'HJIFAGLK', 'EJIAHGLK', 'EJIFAHLK', 'EJIFAGLK', 'EGJFAHLK',
  /* 171 */ 'EGIFAHLK', 'EGJFAHLI', 'EGJFAHIK', 'HJIDAGLK', 'HJIDAFLK',
  /* 176 */ 'IGJDAFLK', 'HGJDAFLK', 'HGIDAFLK', 'HGJDAFLI', 'HGJDAFIK',
  /* 181 */ 'EJIDAHLK', 'EJIDAGLK', 'EGJDAHLK', 'EGIDAHLK', 'EGJDAHLI',
  /* 186 */ 'EGJDAHIK', 'EJIDAFLK', 'HJEDAFLK', 'HEIDAFLK', 'HJEDAFLI',
  /* 191 */ 'HJEDAFIK', 'EGJDAFLK', 'EGIDAFLK', 'EGJDAFLI', 'EGJDAFIK',
  /* 196 */ 'HGEDAFLK', 'HGJDAFLE', 'HGJDAFEK', 'HGEDAFLI', 'HGEDAFIK',
  /* 201 */ 'HGJDAFEI', 'HJICAGLK', 'HJICAFLK', 'IGJCAFLK', 'HGJCAFLK',
  /* 206 */ 'HGICAFLK', 'HGJCAFLI', 'HGJCAFIK', 'EJICAHLK', 'EJICAGLK',
  /* 211 */ 'EGJCAHLK', 'EGICAHLK', 'EGJCAHLI', 'EGJCAHIK', 'EJICAFLK',
  /* 216 */ 'HJECAFLK', 'HEICAFLK', 'HJECAFLI', 'HJECAFIK', 'EGJCAFLK',
  /* 221 */ 'EGICAFLK', 'EGJCAFLI', 'EGJCAFIK', 'HGECAFLK', 'HGJCAFLE',
  /* 226 */ 'HGJCAFEK', 'HGECAFLI', 'HGECAFIK', 'HGJCAFEI', 'HJICADLK',
  /* 231 */ 'IGJCADLK', 'HGJCADLK', 'HGICADLK', 'HGJCADLI', 'HGJCADIK',
  /* 236 */ 'CJIDAFLK', 'HJFCADLK', 'HFICADLK', 'HJFCADLI', 'HJFCADIK',
  /* 241 */ 'CGJDAFLK', 'CGIDAFLK', 'CGJDAFLI', 'CGJDAFIK', 'HGFCADLK',
  /* 246 */ 'CGJDAFLH', 'HGJCAFDK', 'HGFCADLI', 'HGFCADIK', 'HGJCAFDI',
  /* 251 */ 'EJICADLK', 'HJECADLK', 'HEICADLK', 'HJECADLI', 'HJECADIK',
  /* 256 */ 'EGJCADLK', 'EGICADLK', 'EGJCADLI', 'EGJCADIK', 'HGECADLK',
  /* 261 */ 'HGJCADLE', 'HGJCADEK', 'HGECADLI', 'HGECADIK', 'HGJCADEI',
  /* 266 */ 'CJEDAFLK', 'CEIDAFLK', 'CJEDAFLI', 'CJEDAFIK', 'HEFCADLK',
  /* 271 */ 'HJFCADLE', 'HJECAFDK', 'HEFCADLI', 'HEFCADIK', 'HJECAFDI',
  /* 276 */ 'CGEDAFLK', 'CGJDAFLE', 'CGJDAFEK', 'CGEDAFLI', 'CGEDAFIK',
  /* 281 */ 'CGJDAFEI', 'HGFCADLE', 'HGECAFDK', 'HGJCAFDE', 'HGECAFDI',
  /* 286 */ 'HJBAIGLK', 'HJBAIFLK', 'IJBFAGLK', 'HJBFAGLK', 'HGBAIFLK',
  /* 291 */ 'HJBFAGLI', 'HJBFAGIK', 'EJBAIHLK', 'EJBAIGLK', 'EJBAHGLK',
  /* 296 */ 'EGBAIHLK', 'EJBAHGLI', 'EJBAHGIK', 'EJBAIFLK', 'EJBFAHLK',
  /* 301 */ 'EIBFAHLK', 'EJBFAHLI', 'EJBFAHIK', 'EJBFAGLK', 'EGBAIFLK',
  /* 306 */ 'EJBFAGLI', 'EJBFAGIK', 'EGBFAHLK', 'HJBFAGLE', 'HJBFAGEK',
  /* 311 */ 'EGBFAHLI', 'EGBFAHIK', 'HJBFAGEI', 'IJBDAHLK', 'IJBDAGLK',
  /* 316 */ 'HJBDAGLK', 'IGBDAHLK', 'HJBDAGLI', 'HJBDAGIK', 'IJBDAFLK',
  /* 321 */ 'HJBDAFLK', 'HIBDAFLK', 'HJBDAFLI', 'HJBDAFIK', 'FJBDAGLK',
  /* 326 */ 'IGBDAFLK', 'FJBDAGLI', 'FJBDAGIK', 'HGBDAFLK', 'HGBDAFLJ',
  /* 331 */ 'HGBDAFJK', 'HGBDAFLI', 'HGBDAFIK', 'HGBDAFIJ', 'EJBAIDLK',
  /* 336 */ 'EJBDAHLK', 'EIBDAHLK', 'EJBDAHLI', 'EJBDAHIK', 'EJBDAGLK',
  /* 341 */ 'EGBAIDLK', 'EJBDAGLI', 'EJBDAGIK', 'EGBDAHLK', 'HJBDAGLE',
  /* 346 */ 'HJBDAGEK', 'EGBDAHLI', 'EGBDAHIK', 'HJBDAGEI', 'EJBDAFLK',
  /* 351 */ 'EIBDAFLK', 'EJBDAFLI', 'EJBDAFIK', 'HEBDAFLK', 'HJBDAFLE',
  /* 356 */ 'HJBDAFEK', 'HEBDAFLI', 'HEBDAFIK', 'HJBDAFEI', 'EGBDAFLK',
  /* 361 */ 'EGBDAFLJ', 'EGBDAFJK', 'EGBDAFLI', 'EGBDAFIK', 'EGBDAFIJ',
  /* 366 */ 'HGBDAFLE', 'HGBDAFEK', 'HGBDAFEJ', 'HGBDAFEI', 'IJBCAHLK',
  /* 371 */ 'IJBCAGLK', 'HJBCAGLK', 'IGBCAHLK', 'HJBCAGLI', 'HJBCAGIK',
  /* 376 */ 'IJBCAFLK', 'HJBCAFLK', 'HIBCAFLK', 'HJBCAFLI', 'HJBCAFIK',
  /* 381 */ 'CJBFAGLK', 'IGBCAFLK', 'CJBFAGLI', 'CJBFAGIK', 'HGBCAFLK',
  /* 386 */ 'HGBCAFLJ', 'HGBCAFJK', 'HGBCAFLI', 'HGBCAFIK', 'HGBCAFIJ',
  /* 391 */ 'EJBAICLK', 'EJBCAHLK', 'EIBCAHLK', 'EJBCAHLI', 'EJBCAHIK',
  /* 396 */ 'EJBCAGLK', 'EGBAICLK', 'EJBCAGLI', 'EJBCAGIK', 'EGBCAHLK',
  /* 401 */ 'HJBCAGLE', 'HJBCAGEK', 'EGBCAHLI', 'EGBCAHIK', 'HJBCAGEI',
  /* 406 */ 'EJBCAFLK', 'EIBCAFLK', 'EJBCAFLI', 'EJBCAFIK', 'HEBCAFLK',
  /* 411 */ 'HJBCAFLE', 'HJBCAFEK', 'HEBCAFLI', 'HEBCAFIK', 'HJBCAFEI',
  /* 416 */ 'EGBCAFLK', 'EGBCAFLJ', 'EGBCAFJK', 'EGBCAFLI', 'EGBCAFIK',
  /* 421 */ 'EGBCAFIJ', 'HGBCAFLE', 'HGBCAFEK', 'HGBCAFEJ', 'HGBCAFEI',
  /* 426 */ 'IJBCADLK', 'HJBCADLK', 'HIBCADLK', 'HJBCADLI', 'HJBCADIK',
  /* 431 */ 'CJBDAGLK', 'IGBCADLK', 'CJBDAGLI', 'CJBDAGIK', 'HGBCADLK',
  /* 436 */ 'HGBCADLJ', 'HGBCADJK', 'HGBCADLI', 'HGBCADIK', 'HGBCADIJ',
  /* 441 */ 'CJBDAFLK', 'CIBDAFLK', 'CJBDAFLI', 'CJBDAFIK', 'HFBCADLK',
  /* 446 */ 'CJBDAFLH', 'HJBCAFDK', 'HFBCADLI', 'HFBCADIK', 'HJBCAFDI',
  /* 451 */ 'CGBDAFLK', 'CGBDAFLJ', 'CGBDAFJK', 'CGBDAFLI', 'CGBDAFIK',
  /* 456 */ 'CGBDAFIJ', 'CGBDAFLH', 'HGBCAFDK', 'HGBCAFDJ', 'HGBCAFDI',
  /* 461 */ 'EJBCADLK', 'EIBCADLK', 'EJBCADLI', 'EJBCADIK', 'HEBCADLK',
  /* 466 */ 'HJBCADLE', 'HJBCADEK', 'HEBCADLI', 'HEBCADIK', 'HJBCADEI',
  /* 471 */ 'EGBCADLK', 'EGBCADLJ', 'EGBCADJK', 'EGBCADLI', 'EGBCADIK',
  /* 476 */ 'EGBCADIJ', 'HGBCADLE', 'HGBCADEK', 'HGBCADEJ', 'HGBCADEI',
  /* 481 */ 'CEBDAFLK', 'CJBDAFLE', 'CJBDAFEK', 'CEBDAFLI', 'CEBDAFIK',
  /* 486 */ 'CJBDAFEI', 'HFBCADLE', 'HEBCAFDK', 'HJBCAFDE', 'HEBCAFDI',
  /* 491 */ 'CGBDAFLE', 'CGBDAFEK', 'CGBDAFEJ', 'CGBDAFEI', 'HGBCAFDE',
];

const sortKey = (s: string): string => s.split('').sort().join('');

/** sorted-qualifiers key -> assignment code. Built once at module load. */
const TABLE: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const code of THIRD_PLACE_ASSIGNMENTS) m.set(sortKey(code), code);
  return m;
})();

/**
 * Look up FIFA's exact Round-of-32 slotting for a set of eight qualifying
 * third-placed groups. Returns a map of match id -> group whose third-placed
 * team plays there, or null if the input isn't a known 8-group combination.
 */
export function lookupThirdPlaceTable(
  qualifiers: GroupId[],
): Record<number, GroupId> | null {
  if (qualifiers.length !== 8) return null;
  const key = [...qualifiers].sort().join('');
  const code = TABLE.get(key);
  if (!code || code.length !== 8) return null;
  const result: Record<number, GroupId> = {};
  for (let i = 0; i < 8; i += 1) {
    result[SLOT_MATCH_ORDER[i]] = code[i] as GroupId;
  }
  return result;
}

export const THIRD_PLACE_TABLE_SIZE = THIRD_PLACE_ASSIGNMENTS.length;
