import type { Word } from './words';

export type Level = 1 | 2 | 3 | 4 | 5;

export const LEVELS: { level: Level; name: string; emoji: string; ages: string; desc: string }[] = [
  { level: 1, name: 'Seedling', emoji: '🌱', ages: 'Age 4', desc: 'Short 3-letter words (cat, sun, bus)' },
  { level: 2, name: 'Sprout', emoji: '🌿', ages: 'Age 5', desc: '4–5 letter words with blends (frog, clock)' },
  { level: 3, name: 'Star Speller', emoji: '⭐', ages: 'Age 6', desc: 'Everyday words and food, animals, places (apple, castle)' },
  { level: 4, name: 'Word Wizard', emoji: '🧙', ages: 'Age 7', desc: '6–7 letter words (rabbit, rocket, penguin)' },
  { level: 5, name: 'Spelling Champion', emoji: '🏆', ages: 'Age 8–9', desc: 'Long words (elephant, strawberry, helicopter)' },
];

export const levelInfo = (l: number) => LEVELS[Math.min(5, Math.max(1, l)) - 1];

/** Starting level for a child's age (4–9). */
export function ageToLevel(age: number): Level {
  if (age <= 4) return 1;
  if (age === 5) return 2;
  if (age === 6) return 3;
  if (age === 7) return 4;
  return 5;
}

/** How hard each game is at each level. */
export interface Rules { pickChoices: number; matchChoices: number; rhymeDistractors: number; memoryPairs: number; decoyLetters: number; hintAfter: number }
export function rulesFor(level: number): Rules {
  switch (level) {
    case 1: return { pickChoices: 2, matchChoices: 3, rhymeDistractors: 1, memoryPairs: 3, decoyLetters: 0, hintAfter: 1 };
    case 2: return { pickChoices: 3, matchChoices: 4, rhymeDistractors: 2, memoryPairs: 4, decoyLetters: 0, hintAfter: 2 };
    case 3: return { pickChoices: 4, matchChoices: 4, rhymeDistractors: 2, memoryPairs: 6, decoyLetters: 0, hintAfter: 2 };
    case 4: return { pickChoices: 4, matchChoices: 6, rhymeDistractors: 3, memoryPairs: 8, decoyLetters: 2, hintAfter: 2 };
    default: return { pickChoices: 6, matchChoices: 8, rhymeDistractors: 4, memoryPairs: 10, decoyLetters: 3, hintAfter: 3 };
  }
}
export type { Word };
