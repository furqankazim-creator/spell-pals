// Checks words + stories for mistakes. Run: npx tsx scripts/verify-content.ts
import * as fs from 'fs';
import { STORIES } from '../src/data/stories';
import { WORDS } from '../src/data/words';

const imgSrc = fs.readFileSync('src/data/emojiImages.ts', 'utf8');
const hasImage = (e: string) => imgSrc.includes(`'${e.replace(/️/g, '')}':`);
const problems: string[] = [];
const wordSet = new Set(WORDS.map((w) => w.word));

if (new Set(WORDS.map((w) => w.word)).size !== WORDS.length) problems.push('duplicate words');
WORDS.forEach((w) => {
  if (!/^[a-z]+$/.test(w.word)) problems.push(`bad word format: ${w.word}`);
  if (w.sounds.length !== w.word.length && w.level >= 4) problems.push(`sound count: ${w.word}`);
  if (!hasImage(w.emoji)) problems.push(`no picture for word ${w.word} ${w.emoji}`);
});
const ids = new Set<string>();
STORIES.forEach((s) => {
  if (ids.has(s.id)) problems.push(`duplicate story id ${s.id}`); ids.add(s.id);
  if (!s.pages.length || !s.questions.length) problems.push(`${s.id}: no pages or questions`);
  if (!s.pages.every((p) => p.text.length > 0)) problems.push(`${s.id}: empty page`);
  s.keywords.forEach((k) => { if (!wordSet.has(k)) problems.push(`${s.id}: keyword "${k}" is not a word in the word list`); });
  s.pages.forEach((p, i) => p.pics.forEach((e) => { if (e.startsWith('{')) return; if (!hasImage(e)) problems.push(`${s.id} p${i + 1}: no picture for ${e}`); }));
  s.questions.forEach((q, i) => {
    if (q.answer < 0 || q.answer >= q.options.length) problems.push(`${s.id} q${i + 1}: answer index out of range`);
    if (q.options.length < 2) problems.push(`${s.id} q${i + 1}: too few options`);
    q.options.forEach((o) => { if (!o.label) problems.push(`${s.id} q${i + 1}: empty label`); if (!o.emoji.startsWith('{') && !hasImage(o.emoji)) problems.push(`${s.id} q${i + 1}: no picture for ${o.emoji}`); });
  });
});
const perLevel = [1, 2, 3, 4, 5].map((l) => `L${l}: ${WORDS.filter((w) => w.level === l).length} words / ${STORIES.filter((s) => s.level === l).length} stories`);
console.log(perLevel.join('  |  '));
console.log(problems.length ? `PROBLEMS (${problems.length}):\n- ${problems.join('\n- ')}` : 'All content checks passed.');
process.exit(problems.length ? 1 : 0);
