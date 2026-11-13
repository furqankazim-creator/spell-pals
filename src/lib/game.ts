import { WORDS, wordByName } from '../data/words';
import type { Word } from '../data/words';

export const ROUNDS = 6;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Word of the day: same day-number rule, but drawn from the child's own level. */
export function wordOfTheDay(level = 1, date = new Date()): Word {
  const dayNum = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  const pool = WORDS.filter((w) => w.level === level);
  return (pool.length ? pool : WORDS)[dayNum % (pool.length || WORDS.length)];
}

export function vowelIndex(word: string): number {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  for (let i = 1; i < word.length - 1; i++) if (vowels.includes(word[i])) return i;
  return Math.floor(word.length / 2);
}

export interface AttemptLike { word: string; correct: number; tries: number }

/** Words the child recently got wrong (most recent first, unique). */
export function weakWords(attempts: AttemptLike[], limit = 12): string[] {
  const out: string[] = [];
  for (let i = attempts.length - 1; i >= 0 && out.length < limit; i--) {
    const a = attempts[i];
    if (a.correct === 0 && !out.includes(a.word)) out.push(a.word);
  }
  return out;
}

/**
 * Pick n words for a round set. Mix: the grown-up's Star Words, words the child recently got wrong
 * (so mistakes are practised again), a little review from the level below, then fresh words at the child's level.
 */
export function pickWords(n: number, level = 1, focus: string[] = [], attempts: AttemptLike[] = [], only?: (w: Word) => boolean): Word[] {
  const ok = (w: Word) => (only ? only(w) : true);
  const out: Word[] = [];
  const add = (w?: Word) => { if (w && ok(w) && !out.includes(w) && out.length < n) out.push(w); };
  focus.map(wordByName).forEach(add);
  const weakMax = Math.max(1, Math.ceil(n * 0.34));
  let weakCount = 0;
  for (const name of weakWords(attempts)) {
    const w = wordByName(name);
    if (w && Math.abs(w.level - level) <= 1 && weakCount < weakMax && ok(w) && !out.includes(w)) { add(w); weakCount++; }
  }
  if (level > 1) shuffle(WORDS.filter((w) => w.level === level - 1 && ok(w))).slice(0, 1).forEach(add);
  shuffle(WORDS.filter((w) => w.level === level && ok(w))).forEach(add);
  if (out.length < n) shuffle(WORDS.filter((w) => ok(w) && Math.abs(w.level - level) <= 1)).forEach(add);
  return shuffle(out.slice(0, n));
}

export function rhymeChoices(word: string, families: string[][]): string[] {
  const fam = families.find((f) => f.includes(word)) ?? [word];
  return shuffle(fam.filter((w) => w !== word)).slice(0, 2);
}
