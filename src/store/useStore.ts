import { create } from 'zustand';
import { loadJSON, saveJSON } from '../lib/storage';
import type { GameId } from '../data/extras';
import { ageToLevel, levelInfo } from '../data/levels';

export interface Attempt { word: string; game: GameId; tries: number; correct: number; at: string }
export interface Session { id: string; game: GameId; durationSeconds: number; at: string }
export interface Profile { name: string; age: number; avatar: string; pin: string; soundOn: boolean; rewardsOn: boolean; bedtimeMode: boolean; dailyGoal: number; focusWords: string[]; level: number; autoLevel: boolean; levelSince: number; onboarded: boolean }

export const DEFAULT_PROFILE: Profile = {
  name: 'Hadi', age: 5, avatar: '🐼', pin: '1234',
  soundOn: true, rewardsOn: true, bedtimeMode: false, dailyGoal: 10, focusWords: [],
  level: ageToLevel(5), autoLevel: true, levelSince: 0, onboarded: false,
};

interface State {
  loaded: boolean;
  profile: Profile;
  stickers: string[]; // earned sticker ids
  attempts: Attempt[];
  sessions: Session[];
  minutesToday: number;
  mapStars: Record<string, number>;
  recordStage: (id: string, stars: number) => void;
  storiesRead: Record<string, { stars: number; at: string }>;
  storyWords: string[];
  recordStory: (id: string, stars: number) => void;
  addStoryWord: (w: string) => void;
  levelNotice: string | null;
  clearLevelNotice: () => void;
  setProfile: (p: Partial<Profile>) => void;
  earnSticker: (id: string) => void;
  recordAttempt: (a: Attempt) => void;
  recordSession: (s: Session) => void;
  addMinutes: (m: number) => void;
  resetChild: () => void;
  load: () => Promise<void>;
}

function persist(s: State) {
  saveJSON('profile', s.profile);
  saveJSON('stickers', s.stickers);
  saveJSON('attempts', s.attempts);
  saveJSON('sessions', s.sessions);
  saveJSON('storiesRead', s.storiesRead);
  saveJSON('mapStars', s.mapStars);
  saveJSON('storyWords', s.storyWords);
}

export const useStore = create<State>((set, get) => ({
  loaded: false,
  profile: DEFAULT_PROFILE,
  stickers: [],
  attempts: [],
  sessions: [],
  minutesToday: 0,
  mapStars: {},
  recordStage: (id, stars) => {
    set((s) => ({ mapStars: { ...s.mapStars, [id]: Math.max(stars, s.mapStars[id] ?? 0) } }));
    persist(get());
  },
  storiesRead: {},
  storyWords: [],
  recordStory: (id, stars) => {
    set((s) => {
      const prev = s.storiesRead[id];
      return { storiesRead: { ...s.storiesRead, [id]: { stars: Math.max(stars, prev?.stars ?? 0), at: new Date().toISOString() } } };
    });
    persist(get());
  },
  addStoryWord: (w) => {
    set((s) => (s.storyWords.includes(w) ? s : { storyWords: [...s.storyWords, w].slice(-12) }));
    persist(get());
  },
  levelNotice: null,
  clearLevelNotice: () => set({ levelNotice: null }),
  setProfile: (p) => {
    set((s) => {
      const next = { ...s.profile, ...p };
      // choosing a new age moves the child to that age's starting level
      if (p.age !== undefined && p.level === undefined) { next.level = ageToLevel(p.age); next.levelSince = s.attempts.length; }
      return { profile: next };
    });
    persist(get());
  },
  earnSticker: (id) => {
    set((s) => ({ stickers: s.stickers.includes(id) ? s.stickers : [...s.stickers, id] }));
    persist(get());
  },
  recordAttempt: (a) => {
    set((s) => {
      const attempts = [...s.attempts, a];
      const p = s.profile;
      if (!p.autoLevel) return { attempts };
      const recent = attempts.slice(Math.max(p.levelSince, attempts.length - 8));
      if (recent.length < 8) return { attempts };
      const acc = recent.reduce((n, t) => n + t.correct, 0) / recent.length;
      const base = ageToLevel(p.age);
      const lo = Math.max(1, base - 1), hi = Math.min(5, base + 1);
      let level = p.level;
      if (acc >= 0.8 && level < hi) level++;
      else if (acc <= 0.4 && level > lo) level--;
      if (level === p.level) return { attempts };
      const info = levelInfo(level);
      return {
        attempts,
        profile: { ...p, level, levelSince: attempts.length },
        levelNotice: level > p.level ? `Level up! You are now ${info.emoji} ${info.name}!` : `Let us practise some easier words: ${info.emoji} ${info.name}.`,
      };
    });
    persist(get());
  },
  recordSession: (s) => { set((st) => ({ sessions: [...st.sessions, s] })); persist(get()); },
  addMinutes: (m) => set((s) => ({ minutesToday: s.minutesToday + m })),
  resetChild: () => {
    set({ profile: DEFAULT_PROFILE, stickers: [], attempts: [], sessions: [], minutesToday: 0, levelNotice: null, storiesRead: {}, storyWords: [], mapStars: {} });
    persist(get());
  },
  load: async () => {
    const saved = await loadJSON<Partial<Profile>>('profile', DEFAULT_PROFILE);
    const profile: Profile = { ...DEFAULT_PROFILE, ...saved, onboarded: saved.onboarded ?? false, level: saved.level ?? ageToLevel(saved.age ?? 5) };
    const stickers = await loadJSON<string[]>('stickers', []);
    const attempts = await loadJSON<Attempt[]>('attempts', []);
    const sessions = await loadJSON<Session[]>('sessions', []);
    const storiesRead = await loadJSON<Record<string, { stars: number; at: string }>>('storiesRead', {});
    const storyWords = await loadJSON<string[]>('storyWords', []);
    const mapStars = await loadJSON<Record<string, number>>('mapStars', {});
    set({ profile, stickers, attempts, sessions, storiesRead, storyWords, mapStars, loaded: true });
  },
}));

/** Weekly summary for the Grown-ups dashboard (last 7 days, local data only). */
export function weeklySummary(sessions: Session[], attempts: Attempt[]) {
  const days: { label: string; minutes: number; played: boolean }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const mins = sessions.filter((s) => s.at.startsWith(key)).reduce((a, s) => a + s.durationSeconds, 0) / 60;
    days.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), minutes: Math.round(mins), played: mins > 0 });
  }
  const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60);
  const correct = attempts.reduce((a, t) => a + t.correct, 0);
  const total = attempts.reduce((a, t) => a + t.tries, 0);
  const streak = (() => { let n = 0; for (let i = days.length - 1; i >= 0; i--) { if (days[i].played) n++; else break; } return n; })();
  return { days, totalMinutes, accuracy: total ? Math.round((correct / total) * 100) : 0, streak, sessionsPlayed: sessions.length };
}
