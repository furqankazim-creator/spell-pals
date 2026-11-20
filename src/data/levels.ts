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

export interface RoundStageInfo {
  tier: 'warmup' | 'core' | 'challenge' | 'boss';
  label: string;
  badge: string;
  color: string;
  bg: string;
  xpBonus: number;
}

/** Describes the complexity tier and story connection for a specific round */
export function roundStageInfo(roundIndex: number, totalRounds: number): RoundStageInfo {
  if (roundIndex >= totalRounds - 1) {
    return { tier: 'boss', label: 'Star Boss Challenge', badge: '👑 Final Boss Round', color: '#D97706', bg: '#FEF3C7', xpBonus: 25 };
  }
  const ratio = roundIndex / totalRounds;
  if (ratio < 0.34) {
    return { tier: 'warmup', label: 'Warm-up Focus', badge: '🌱 Warm-up Round', color: '#059669', bg: '#D1FAE5', xpBonus: 10 };
  }
  if (ratio < 0.70) {
    return { tier: 'core', label: 'Core Practice', badge: '⭐ Core Challenge', color: '#2563EB', bg: '#DBEAFE', xpBonus: 15 };
  }
  return { tier: 'challenge', label: 'Power Mastery', badge: '🔥 Power Round', color: '#7C3AED', bg: '#EDE9FE', xpBonus: 20 };
}

/** Dynamic round-by-round rules that scale complexity as rounds advance */
export function rulesForRound(level: number, roundIndex: number, totalRounds: number): Rules {
  const base = rulesFor(level);
  const info = roundStageInfo(roundIndex, totalRounds);

  if (info.tier === 'warmup') {
    return {
      pickChoices: Math.max(2, base.pickChoices - 1),
      matchChoices: Math.max(3, base.matchChoices - 1),
      rhymeDistractors: Math.max(1, base.rhymeDistractors - 1),
      memoryPairs: base.memoryPairs,
      decoyLetters: 0,
      hintAfter: 1,
    };
  }

  if (info.tier === 'core') {
    return {
      ...base,
      decoyLetters: Math.min(1, base.decoyLetters),
      hintAfter: Math.min(2, base.hintAfter),
    };
  }

  return {
    ...base,
    pickChoices: base.pickChoices,
    matchChoices: base.matchChoices,
    rhymeDistractors: base.rhymeDistractors,
    decoyLetters: base.decoyLetters,
    hintAfter: base.hintAfter,
  };
}

export type { Word };
