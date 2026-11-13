import * as Speech from 'expo-speech';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

let soundOn = true;
export function setSoundOn(on: boolean) { soundOn = on; if (!on) Speech.stop(); }

/** Device text-to-speech — no recorded voice is bundled. */
export function speak(text: string, opts: { slow?: boolean; pitch?: number; delay?: number } = {}) {
  if (!soundOn) return;
  const go = () => { Speech.stop(); Speech.speak(text, { rate: opts.slow ? 0.6 : 0.88, pitch: opts.pitch ?? 1.1 }); };
  if (opts.delay) setTimeout(go, opts.delay); else go();
}

export function speakSounds(sounds: string[]) {
  if (!soundOn) return;
  Speech.stop();
  sounds.forEach((s) => Speech.speak(s, { rate: 0.6 }));
}

export function stopSpeaking() { Speech.stop(); }

// ---- Sound effects (small WAV files made by scripts/make-sounds.js; work offline) ----
const SFX = {
  correct: require('../../assets/sounds/correct.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
  tap: require('../../assets/sounds/tap.wav'),
  flip: require('../../assets/sounds/flip.wav'),
  win: require('../../assets/sounds/win.wav'),
};
export type Sfx = keyof typeof SFX;

const players: Partial<Record<Sfx, AudioPlayer>> = {};
export function playSfx(name: Sfx) {
  if (!soundOn) return;
  try {
    let p = players[name];
    if (!p) { p = createAudioPlayer(SFX[name]); p.volume = 0.8; players[name] = p; }
    p.seekTo(0);
    p.play();
  } catch { /* sound unavailable: the spoken voice still guides the child */ }
}
export const playChime = () => playSfx('correct');

// ---- Spoken encouragement, so the child always hears whether they were right or wrong ----
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

const RIGHT = ['Great job!', 'You got it!', 'Well done!', 'Awesome!', 'Yes! That is right!', 'Fantastic!', 'Super! You did it!', 'Hooray! Correct!', 'Brilliant!'];
const WRONG = ['Oops! Try again.', 'Not quite. Try again!', 'Almost! You can do it!', 'Uh oh. Let us try again.', 'That is not it. Have another go!', 'Good try! Try once more.'];
const PRAISE_NAME = (n: string) => [`Great job, ${n}!`, `Well done, ${n}!`, `You are so clever, ${n}!`, `Yes ${n}! That is right!`];
const TRY_NAME = (n: string) => [`Nice try, ${n}. Try again!`, `Almost, ${n}! One more time.`, `Do not give up, ${n}! You can do it!`];

export function cheerCorrect(name?: string) {
  playSfx('correct');
  speak(pick(name ? [...RIGHT, ...PRAISE_NAME(name)] : RIGHT), { delay: 500 });
}
export function cheerWrong(name?: string) {
  playSfx('wrong');
  speak(pick(name ? [...WRONG, ...TRY_NAME(name)] : WRONG), { delay: 550 });
}
export function cheerHint(letter: string) {
  playSfx('wrong');
  speak(`Here is a hint. The word starts with ${letter}.`, { delay: 550 });
}
export function cheerWin(text: string) {
  playSfx('win');
  speak(text, { delay: 900 });
}
export function cheerPair(word: string) {
  playSfx('correct');
  speak(`A match! ${word}!`, { delay: 500 });
}
export function cheerNoPair() {
  playSfx('wrong');
  speak(pick(['Not a match. Try again!', 'Oops, those are different. Keep looking!']), { delay: 500 });
}
export function greet(name: string) {
  speak(`Hi ${name}! Let us spell some words. Pick a game!`, { delay: 300 });
}

/**
 * Read a page aloud and report which word is being spoken (for highlighting).
 * Uses real word-boundary events where the device provides them (iOS / web) and a timed estimate elsewhere.
 * Returns a function that stops the reading.
 */
export function readAloud(words: string[], onWord: (index: number) => void, onDone: () => void): () => void {
  if (!soundOn) { onDone(); return () => {}; }
  Speech.stop();
  const starts: number[] = [];
  let pos = 0;
  words.forEach((w) => { starts.push(pos); pos += w.length + 1; });
  let cancelled = false;
  let boundary = false;
  let finished = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const rate = 0.8;
  let t = 300;
  words.forEach((w, i) => {
    timers.push(setTimeout(() => { if (!cancelled && !boundary) onWord(i); }, t));
    t += (260 + w.replace(/[^a-zA-Z]/g, '').length * 75 + (/[.!?]$/.test(w) ? 380 : /[,;:]$/.test(w) ? 200 : 0)) * (0.85 / rate);
  });
  const finish = () => { if (finished || cancelled) return; finished = true; timers.forEach(clearTimeout); onDone(); };
  Speech.speak(words.join(' '), {
    rate, pitch: 1.1,
    onBoundary: (e: { charIndex: number }) => {
      if (cancelled) return;
      boundary = true;
      let idx = 0;
      for (let i = 0; i < starts.length; i++) if (starts[i] <= e.charIndex) idx = i;
      onWord(idx);
    },
    onDone: finish,
    onError: finish,
  });
  return () => { cancelled = true; timers.forEach(clearTimeout); Speech.stop(); };
}

/** Play a recorded narration file for a page, highlighting words in step with the recording. Returns a stop function. */
export function playNarration(source: number, words: string[], onWord: (index: number) => void, onDone: () => void): () => void {
  if (!soundOn) { onDone(); return () => {}; }
  Speech.stop();
  let stopped = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const player = createAudioPlayer(source);
  const finish = () => { if (stopped) return; stopped = true; timers.forEach(clearTimeout); try { player.remove(); } catch { /* ignore */ } onDone(); };
  player.addListener('playbackStatusUpdate', (st: { didJustFinish?: boolean }) => { if (st.didJustFinish) finish(); });
  player.play();
  // spread the highlight over the recording length (known shortly after it starts)
  timers.push(setTimeout(() => {
    if (stopped) return;
    const total = (player.duration || words.length * 0.45) * 1000;
    const weights = words.map((w) => 1 + w.replace(/[^a-zA-Z]/g, '').length * 0.4 + (/[.!?,]$/.test(w) ? 1.2 : 0));
    const sum = weights.reduce((a, b) => a + b, 0);
    let at = 0;
    words.forEach((_, i) => { const t = (at / sum) * total; timers.push(setTimeout(() => { if (!stopped) onWord(i); }, t)); at += weights[i]; });
  }, 350));
  return () => { stopped = true; timers.forEach(clearTimeout); try { player.pause(); player.remove(); } catch { /* ignore */ } };
}
