import type { GameId } from './extras';

export interface World { id: string; name: string; emoji: string; desc: string; bg: string; grad: [string, string]; accent: string; dark: string; art: 'hills' | 'mountains' | 'beach'; pic: string; cardGrad: [string, string]; deco: string[]; }
export interface Stage { id: string; world: number; index: number; game: GameId; boss: boolean; label: string; route: string }

/** The adventure map: 3 worlds × 5 stages. The 5th stage of each world is a boss stage (8 rounds). */
export const WORLDS: World[] = [
  { id: 'letter', name: 'Letter Land', emoji: '🔤', desc: 'First sounds, letter pieces and rhymes', bg: '#DDF6D2', grad: ['#F0FCE8', '#CDEFBE'], accent: '#7CCB6B', dark: '#3E8F32', art: 'hills', pic: '🦋', cardGrad: ['#D9F5C9', '#86D46F'], deco: ['🌳', '🌷', '🍄', '🦋', '🌲'] },
  { id: 'vowel', name: 'Vowel Valley', emoji: '🅰️', desc: 'Find the missing vowel sounds', bg: '#E8E1FF', grad: ['#F5F1FF', '#D8CCFF'], accent: '#A78BFA', dark: '#5B3FD0', art: 'mountains', pic: '🦄', cardGrad: ['#E3DAFF', '#A98BFF'], deco: ['🏔️', '🌈', '☁️', '🦄', '🔮'] },
  { id: 'word', name: 'Word World', emoji: '🏰', desc: 'Spell, read and remember whole words', bg: '#FFF0C9', grad: ['#FFF8E1', '#FFE2A0'], accent: '#F5B73A', dark: '#B97A0A', art: 'beach', pic: '🏰', cardGrad: ['#FFE9B0', '#F7B53C'], deco: ['🏖️', '🌴', '🐚', '🦀', '🐳'] },
];

const PLAN: { game: GameId; label: string }[][] = [
  [{ game: 'pick', label: 'Pick the Letter' }, { game: 'rhyme', label: 'Rhyme Time' }, { game: 'sound', label: 'Sound Out' }, { game: 'pick', label: 'Pick the Letter' }, { game: 'rhyme', label: 'Rhyme Time' }],
  [{ game: 'vowel', label: 'Fill the Vowel' }, { game: 'match', label: 'Match the Picture' }, { game: 'vowel', label: 'Fill the Vowel' }, { game: 'memory', label: 'Memory Match' }, { game: 'vowel', label: 'Fill the Vowel' }],
  [{ game: 'spell', label: 'Spell the Word' }, { game: 'match', label: 'Match the Picture' }, { game: 'spell', label: 'Spell the Word' }, { game: 'memory', label: 'Memory Match' }, { game: 'spell', label: 'Spell the Word' }],
];

export const STAGES: Stage[] = PLAN.flatMap((stages, w) =>
  stages.map((s, i) => ({ id: `w${w + 1}s${i + 1}`, world: w, index: i, game: s.game, boss: i === 4, label: s.label, route: `/${s.game}` })),
);

export const BOSS_ROUNDS = 8;

/** Stage i is open when the one before it has at least one star (the first is always open). */
export function isUnlocked(i: number, stars: Record<string, number>): boolean {
  return i === 0 || (stars[STAGES[i - 1].id] ?? 0) >= 1;
}
/** Index of the stage the child should play next (first open stage without stars). */
export function currentStageIndex(stars: Record<string, number>): number {
  const i = STAGES.findIndex((s, idx) => isUnlocked(idx, stars) && !(stars[s.id] > 0));
  return i === -1 ? STAGES.length - 1 : i;
}
