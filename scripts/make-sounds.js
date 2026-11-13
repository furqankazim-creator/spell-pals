// Generates the small feedback sound effects (WAV) used by src/lib/audio.ts. Run: node scripts/make-sounds.js
const fs = require('fs');
const SR = 22050;
function tone(notes) { // notes: [freq, seconds, vol, type]
  const out = [];
  for (const [f, d, v = 0.5, type = 'sine'] of notes) {
    const n = Math.floor(SR * d);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const env = Math.min(1, i / (SR * 0.01)) * Math.pow(1 - i / n, 1.6);
      let s = Math.sin(2 * Math.PI * f * t);
      if (type === 'soft') s = 0.7 * s + 0.3 * Math.sin(4 * Math.PI * f * t);
      out.push(f === 0 ? 0 : s * env * v);
    }
  }
  return out;
}
function wav(samples, name) {
  const b = Buffer.alloc(44 + samples.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + samples.length * 2, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => b.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32000, 44 + i * 2));
  fs.writeFileSync(`assets/sounds/${name}.wav`, b);
}
// happy rising chime (C5 E5 G5 C6)
wav(tone([[523, 0.12, 0.5, 'soft'], [659, 0.12, 0.5, 'soft'], [784, 0.12, 0.5, 'soft'], [1047, 0.35, 0.55, 'soft']]), 'correct');
// gentle "uh-oh" — two soft descending notes (not harsh)
wav(tone([[330, 0.18, 0.4, 'soft'], [262, 0.3, 0.4, 'soft']]), 'wrong');
// quick pop for tapping a letter
wav(tone([[740, 0.06, 0.4]]), 'tap');
// card flip
wav(tone([[520, 0.05, 0.3], [680, 0.06, 0.3]]), 'flip');
// finish fanfare
wav(tone([[523, 0.14, 0.5, 'soft'], [523, 0.14, 0.5, 'soft'], [659, 0.14, 0.5, 'soft'], [784, 0.2, 0.5, 'soft'], [659, 0.12, 0.5, 'soft'], [784, 0.12, 0.5, 'soft'], [1047, 0.5, 0.6, 'soft']]), 'win');
