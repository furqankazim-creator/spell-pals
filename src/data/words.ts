import wordsJson from '../../content/words.json';

export interface Word { word: string; emoji: string; level: 1 | 2 | 3 | 4 | 5; sounds: string[] }

export const WORDS: Word[] = wordsJson as Word[];

export const VOWELS = ['a', 'e', 'i', 'o', 'u'] as const;

export const WORDS_BY_LEVEL = {
  1: WORDS.filter((w) => w.level === 1),
  2: WORDS.filter((w) => w.level === 2),
  3: WORDS.filter((w) => w.level === 3),
  4: WORDS.filter((w) => w.level === 4),
  5: WORDS.filter((w) => w.level === 5),
} as const;

export function wordByName(name: string): Word | undefined {
  return WORDS.find((w) => w.word === name);
}
