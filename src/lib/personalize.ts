import type { Story } from '../data/stories';

const BUDDY: Record<string, string> = { '🦁': 'lion', '🐰': 'bunny', '🦊': 'fox', '🐼': 'panda', '🦉': 'owl', '🐨': 'koala', '🦄': 'unicorn', '🐙': 'octopus' };
export const buddyName = (avatar: string) => BUDDY[avatar] ?? 'friend';

/** Fill {name}, {buddy} and {avatar} in story text so stories can star the child and their chosen buddy. */
export function fill(text: string, name: string, avatar: string): string {
  return text.replace(/\{name\}/g, name).replace(/\{buddy\}/g, buddyName(avatar)).replace(/\{avatar\}/g, avatar);
}

/** A copy of the story with every {token} replaced for this child. */
export function personalize(s: Story, name: string, avatar: string): Story {
  const f = (t: string) => fill(t, name, avatar);
  return {
    ...s,
    title: f(s.title),
    emoji: f(s.emoji),
    pages: s.pages.map((p) => ({ text: f(p.text), pics: p.pics.map(f) })),
    questions: s.questions.map((q) => ({ ...q, q: f(q.q), options: q.options.map((o) => ({ emoji: f(o.emoji), label: f(o.label) })) })),
  };
}

/** Shuffle the answer buttons of each question (so the right answer is not always in the same place). */
export function shuffleAnswers(s: Story): Story {
  return {
    ...s,
    questions: s.questions.map((q) => {
      const order = q.options.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
    }),
  };
}
