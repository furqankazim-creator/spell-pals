import { RHYME_FAMILIES } from './extras';

/** Rhyme families by level: simple CVC rhymes first, then longer words for older children. */
export const RHYMES: { level: number; words: string[] }[] = [
  ...RHYME_FAMILIES.filter((f) => f.length >= 2).map((words) => ({ level: 1, words })),
  { level: 3, words: ['train', 'rain', 'plane', 'chain', 'brain'] },
  { level: 3, words: ['cake', 'lake', 'snake', 'bake', 'make'] },
  { level: 3, words: ['tree', 'bee', 'key', 'knee', 'three'] },
  { level: 3, words: ['boat', 'goat', 'coat', 'float'] },
  { level: 3, words: ['bear', 'chair', 'hair', 'pear', 'stair'] },
  { level: 3, words: ['snow', 'blow', 'glow', 'toe'] },
  { level: 3, words: ['light', 'night', 'kite', 'bite', 'right'] },
  { level: 3, words: ['bike', 'like', 'hike'] },
  { level: 3, words: ['fish', 'dish', 'wish'] },
  { level: 3, words: ['ball', 'tall', 'wall', 'fall', 'call'] },
  { level: 3, words: ['book', 'cook', 'look', 'hook'] },
  { level: 3, words: ['bell', 'shell', 'well', 'tell'] },
  { level: 3, words: ['duck', 'truck', 'luck'] },
  { level: 3, words: ['clown', 'town', 'crown', 'brown', 'down'] },
  { level: 3, words: ['moon', 'spoon', 'balloon', 'soon'] },
  { level: 4, words: ['flower', 'tower', 'power', 'shower'] },
  { level: 4, words: ['rocket', 'pocket', 'locket'] },
  { level: 4, words: ['candle', 'handle', 'sandal'] },
  { level: 4, words: ['kitten', 'mitten', 'written'] },
  { level: 4, words: ['dragon', 'wagon'] },
  { level: 4, words: ['spider', 'cider', 'wider'] },
  { level: 4, words: ['butter', 'flutter', 'gutter'] },
  { level: 4, words: ['monkey', 'donkey', 'chunky'] },
  { level: 5, words: ['station', 'nation', 'vacation', 'celebration'] },
  { level: 5, words: ['mountain', 'fountain'] },
  { level: 5, words: ['chicken', 'thicken'] },
  { level: 5, words: ['umbrella', 'cinderella'] },
  { level: 5, words: ['bicycle', 'tricycle'] },
  { level: 5, words: ['pancakes', 'milkshakes'] },
];

/** Families available to a child at this level (their level and below, but not trivial ones if older). */
export function familiesFor(level: number) {
  const avail = RHYMES.filter((f) => f.level <= level);
  const hard = avail.filter((f) => f.level >= Math.max(1, level - 1));
  return hard.length >= 4 ? hard : avail;
}
