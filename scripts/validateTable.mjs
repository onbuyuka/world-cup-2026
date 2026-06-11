// Standalone validator for the FIFA Annex C third-place table.
// Run: node scripts/validateTable.mjs   (from the project root)
//
// It reads data/thirdPlaceTable.ts as text, extracts the 8-letter assignment
// codes, and checks:
//   - exactly 495 codes
//   - each is 8 distinct letters from A-L
//   - each letter is allowed in its slot (Annex C constraints)
//   - the sorted-qualifiers keys are all unique (=> all 495 combos covered)
// Any failure is reported with the 1-based row number so it can be fixed.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, '..', 'data', 'thirdPlaceTable.ts');
const text = readFileSync(file, 'utf8');

// Only the assignment codes appear as single-quoted 8-letter A-L tokens.
const codes = [...text.matchAll(/'([A-L]{8})'/g)].map((m) => m[1]);

const SLOT_ALLOWED = [
  ['C', 'E', 'F', 'H', 'I'], // 79 Winner A
  ['E', 'F', 'G', 'I', 'J'], // 85 Winner B
  ['B', 'E', 'F', 'I', 'J'], // 81 Winner D
  ['A', 'B', 'C', 'D', 'F'], // 74 Winner E
  ['A', 'E', 'H', 'I', 'J'], // 82 Winner G
  ['C', 'D', 'F', 'G', 'H'], // 77 Winner I
  ['D', 'E', 'I', 'J', 'L'], // 87 Winner K
  ['E', 'H', 'I', 'J', 'K'], // 80 Winner L
].map((s) => new Set(s));

const errors = [];
const keys = new Map(); // sortedKey -> first row that produced it

codes.forEach((code, idx) => {
  const row = idx + 1;
  const letters = code.split('');

  // distinct letters
  if (new Set(letters).size !== 8) {
    errors.push(`row ${row} (${code}): not 8 distinct groups`);
  }
  // per-slot allowed constraint
  letters.forEach((ch, pos) => {
    if (!SLOT_ALLOWED[pos].has(ch)) {
      errors.push(`row ${row} (${code}): '${ch}' not allowed in slot ${pos} (winner ${'ABDEGIKL'[pos]})`);
    }
  });
  // uniqueness of the qualifier set
  const key = [...letters].sort().join('');
  if (keys.has(key)) {
    errors.push(`row ${row} (${code}): duplicate combination ${key} (first seen row ${keys.get(key)})`);
  } else {
    keys.set(key, row);
  }
});

console.log(`Codes found: ${codes.length} (expected 495)`);
console.log(`Unique combinations: ${keys.size} (expected 495)`);

if (codes.length !== 495) {
  errors.unshift(`expected 495 codes, found ${codes.length}`);
}

if (errors.length === 0) {
  console.log('✅ Annex C table is valid: 495 unique combinations, all constraints satisfied.');
  process.exit(0);
} else {
  console.error(`❌ ${errors.length} problem(s):`);
  for (const e of errors.slice(0, 60)) console.error('  - ' + e);
  if (errors.length > 60) console.error(`  …and ${errors.length - 60} more`);
  process.exit(1);
}
