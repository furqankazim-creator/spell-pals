import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ROUNDS, pickWords, shuffle, vowelIndex } from '../lib/game';
import { BOSS_ROUNDS } from '../data/mapStages';
import { speak, speakSounds, playSfx, cheerCorrect, cheerWrong, cheerHint, cheerWin } from '../lib/audio';
import { useStore } from '../store/useStore';
import { STICKERS } from '../data/extras';
import { WORDS, wordByName } from '../data/words';
import { levelInfo, rulesFor } from '../data/levels';
import { familiesFor } from '../data/rhymes';
import type { GameId } from '../data/extras';
import type { Word } from '../data/words';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import LetterTile from '../components/LetterTile';
import WordCard from '../components/WordCard';
import Celebration from '../components/Celebration';
import BigButton from '../components/BigButton';
import Pic from '../components/Pic';

const TITLES: Record<GameId, string> = {
  spell: 'Spell the Word', pick: 'Pick the Letter', sound: 'Sound Out',
  match: 'Match the Picture', vowel: 'Fill the Vowel', rhyme: 'Rhyme Time', memory: 'Memory Match',
};
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const ALPHABET = 'abcdefghijklmnoprstuw'.split('');
const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

interface Round { word: Word; mode: 'start' | 'end'; rhymeAnswers: string[]; rhymeTarget?: string }

/** One round engine for the letter games, scaled to the child's level. Memory Match has its own screen. */
export default function GameScreen({ game }: { game: GameId }) {
  const router = useRouter();
  const { word: forced, stage, boss } = useLocalSearchParams<{ word?: string; stage?: string; boss?: string }>();
  const TOTAL = boss === '1' ? BOSS_ROUNDS : ROUNDS;
  const recordStage = useStore((s) => s.recordStage);
  const sessionWrong = useRef(0);
  const profile = useStore((s) => s.profile);
  const attempts = useStore((s) => s.attempts);
  const storyWords = useStore((s) => s.storyWords);
  const recordAttempt = useStore((s) => s.recordAttempt);
  const recordSession = useStore((s) => s.recordSession);
  const earnSticker = useStore((s) => s.earnSticker);
  const addMinutes = useStore((s) => s.addMinutes);
  const rules = rulesFor(profile.level);
  const info = levelInfo(profile.level);

  // Build the rounds once per play: words at the child's level, with missed words coming back.
  const rounds: Round[] = useMemo(() => {
    const first = forced ? wordByName(forced) : undefined;
    if (game === 'rhyme') {
      return shuffle(familiesFor(profile.level)).slice(0, TOTAL).map((f) => {
        const target = rand(f.words);
        const w: Word = wordByName(target) ?? { word: target, emoji: '🎵', level: profile.level as Word['level'], sounds: [] };
        return { word: w, mode: 'start' as const, rhymeAnswers: f.words.filter((x) => x !== target), rhymeTarget: target };
      });
    }
    const only = game === 'sound' ? (w: Word) => w.word.length <= 7 : undefined;
    const rest = pickWords(TOTAL, profile.level, [...profile.focusWords, ...storyWords.slice(-3)], attempts, only);
    const list = first ? [first, ...rest.filter((w) => w.word !== first.word)].slice(0, TOTAL) : rest;
    return list.map((w) => ({
      word: w,
      mode: profile.level >= 3 && w.word.length > 3 && Math.random() < 0.35 ? ('end' as const) : ('start' as const),
      rhymeAnswers: [],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, game]);

  const [round, setRound] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);
  const [used, setUsed] = useState<number[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState(0);
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const startRef = useRef(Date.now());
  const cur = rounds[round];
  const word: Word = cur.word;
  const targetLetter = cur.mode === 'end' ? word.word[word.word.length - 1] : word.word[0];

  const letters = useMemo(() => {
    const base = word.word.split('');
    const extra = shuffle(ALPHABET.filter((c) => !base.includes(c))).slice(0, rules.decoyLetters);
    return shuffle([...base, ...extra]);
  }, [word, rules.decoyLetters]);

  const choices = useMemo(() => {
    if (game === 'pick') {
      const pool = ALPHABET.filter((c) => c !== targetLetter);
      return shuffle([targetLetter, ...shuffle(pool).slice(0, rules.pickChoices - 1)]);
    }
    if (game === 'vowel') return VOWELS;
    if (game === 'rhyme') {
      const correct = rand(cur.rhymeAnswers);
      const fam = [...cur.rhymeAnswers, cur.rhymeTarget ?? ''];
      const others = shuffle(WORDS.filter((w) => !fam.includes(w.word) && Math.abs(w.word.length - word.word.length) <= 2).map((w) => w.word)).slice(0, rules.rhymeDistractors);
      return shuffle([correct, ...others]);
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, word, round]);

  const matchChoices = useMemo(() => {
    if (game !== 'match') return [];
    const near = WORDS.filter((w) => w.word !== word.word && Math.abs(w.level - word.level) <= 1);
    return shuffle([word, ...shuffle(near).slice(0, rules.matchChoices - 1)]);
  }, [game, word, rules.matchChoices]);

  useEffect(() => {
    setSlots([]); setUsed([]); setPicked(null); setWrong(0); setFeedback('');
    const w = word.word;
    const intro: Record<GameId, string> = {
      spell: `Spell the word ${w}. Tap the letters in order!`,
      sound: `Let us sound out ${w}. Tap the letters in order!`,
      pick: cur.mode === 'end' ? `What letter does ${w} end with?` : `What letter does ${w} start with?`,
      vowel: `Which vowel is missing in ${w}?`,
      rhyme: `Which word rhymes with ${w}?`,
      match: `Find the picture for the word ${w}.`,
      memory: '',
    };
    speak(intro[game], { delay: 250 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, game, word]);

  const isCorrectChoice = (c: string) => {
    if (game === 'pick') return c === targetLetter;
    if (game === 'vowel') return c === word.word[vowelIndex(word.word)];
    if (game === 'rhyme') return cur.rhymeAnswers.includes(c);
    return c === word.word;
  };

  const finishRound = (correct: boolean) => {
    recordAttempt({ word: word.word, game, tries: tries + 1, correct: correct ? 1 : 0, at: new Date().toISOString() });
    if (correct) {
      setFeedback('🎉 Well done!');
      if (round + 1 >= TOTAL) cheerWin(`Amazing, ${profile.name}! You finished the game and earned a sticker!`);
      else cheerCorrect(profile.name);
      if (profile.rewardsOn) earnSticker(STICKERS[Math.floor(Math.random() * STICKERS.length)].id);
      setTimeout(() => {
        if (round + 1 >= TOTAL) {
          if (stage) recordStage(stage, sessionWrong.current === 0 ? 3 : sessionWrong.current <= 3 ? 2 : 1);
          recordSession({ id: `${Date.now()}`, game, durationSeconds: Math.round((Date.now() - startRef.current) / 1000), at: new Date().toISOString() });
          addMinutes(1);
          setDone(true);
        } else { setRound(round + 1); setTries(0); }
      }, 1100);
    } else {
      setTries((t) => t + 1);
      setWrong((n) => n + 1);
      sessionWrong.current += 1;
      setPicked(null);
      if ((game === 'spell' || game === 'sound') && tries + 1 >= rules.hintAfter) {
        setFeedback(`Hint: it starts with “${word.word[0].toUpperCase()}”`);
        cheerHint(word.word[0].toUpperCase());
      } else {
        setFeedback('Try again — you can do it!');
        cheerWrong(profile.name);
      }
      if (game === 'spell' || game === 'sound') setTimeout(() => { setSlots([]); setUsed([]); }, 1200);
    }
  };

  const tapLetter = (l: string, idx: number) => {
    if (used.includes(idx) || slots.length >= word.word.length) return;
    if (slots.length + 1 < word.word.length) playSfx('tap');
    const next = [...slots, l];
    setSlots(next); setUsed([...used, idx]);
    if (next.length === word.word.length) finishRound(next.join('') === word.word);
  };

  const tapChoice = (c: string) => {
    setPicked(c);
    finishRound(isCorrectChoice(c));
  };

  if (done) {
    return (
      <ScreenShell tabs={false} max={820}>
        <Celebration
          stickerEmoji="⭐" stickerLabel="Super Star"
          stars={stage ? (sessionWrong.current === 0 ? 3 : sessionWrong.current <= 3 ? 2 : 1) : undefined}
          doneLabel={stage ? 'Back to the map' : 'Back to Home'}
          onDone={() => router.replace(stage ? '/map' : '/')}
          onAgain={() => { sessionWrong.current = 0; setRound(0); setTries(0); setDone(false); }}
        />
      </ScreenShell>
    );
  }

  const long = word.word.length > 7;
  const slotW = long ? 34 : 56;
  const tileSize = long ? 52 : 64;
  const blanked = (() => { const i = vowelIndex(word.word); return `${word.word.slice(0, i)}_${word.word.slice(i + 1)}`; })();
  const smallPics = matchChoices.length > 4;

  return (
    <ScreenShell tabs={false} max={820} onBack={() => router.replace(stage ? '/map' : '/')} backLabel="← Back">
      <Text style={styles.title}>{TITLES[game]}</Text>
      <Text style={styles.round}>{info.emoji} Level {profile.level} · Round {round + 1} of {TOTAL}{boss === '1' ? ' · Boss stage!' : ''}</Text>
      <View style={styles.bar}><View style={[styles.fill, { width: `${(round / TOTAL) * 100}%` }]} /></View>

      {game === 'match' ? (
        <View>
          <Text style={styles.prompt}>Find the picture for:</Text>
          <Text style={styles.bigWord}>{word.word.toUpperCase()}</Text>
          <View style={styles.grid}>
            {matchChoices.map((c) => (
              <Pressable key={c.word} onPress={() => tapChoice(c.word)} style={[styles.picChoice, smallPics ? styles.picSmall : null]}>
                <Pic emoji={c.emoji} size={smallPics ? 96 : 124} />
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <WordCard word={word} hideWord={game === 'spell' || game === 'sound'} />
      )}

      {game !== 'match' ? (
        <View style={styles.hearRow}>
          <BigButton label="Hear it" icon="volume-high" onPress={() => speak(word.word)} color={colors.violet} />
          {game === 'sound' ? <BigButton label="Hear the sounds" icon="volume-high" onPress={() => speakSounds(word.sounds)} color={colors.teal} /> : null}
        </View>
      ) : null}

      {game === 'spell' || game === 'sound' ? (
        <View>
          <View style={styles.slots}>
            {word.word.split('').map((_, i) => (
              <View key={i} style={[styles.slot, { width: slotW }]}><Text style={[styles.slotText, long ? { fontSize: 22 } : null]}>{slots[i]?.toUpperCase() ?? ''}</Text></View>
            ))}
          </View>
          <View style={styles.tiles}>
            {letters.map((l, i) => (
              <LetterTile key={i} letter={l} size={tileSize} disabled={used.includes(i)} onPress={() => tapLetter(l, i)} />
            ))}
          </View>
          <Pressable onPress={() => { setSlots([]); setUsed([]); }}><Text style={styles.clear}>Clear ↺</Text></Pressable>
        </View>
      ) : null}

      {game === 'pick' || game === 'vowel' || game === 'rhyme' ? (
        <View>
          <Text style={styles.prompt}>
            {game === 'pick' ? `What letter does “${word.word}” ${cur.mode === 'end' ? 'end' : 'start'} with?` : game === 'vowel' ? `Fill the missing vowel: ${blanked.toUpperCase()}` : `Which word rhymes with “${word.word}”?`}
          </Text>
          <View style={styles.tiles}>
            {choices.map((c) => (
              <LetterTile key={c} letter={c} wide={game === 'rhyme'} filled={picked === c} onPress={() => tapChoice(c)} />
            ))}
          </View>
        </View>
      ) : null}

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      {wrong > 0 ? <Text style={styles.wrong}>Wrong tries: {wrong}</Text> : null}
      <View style={{ height: 16 }} />
      <BigButton label="Quit game" onPress={() => router.replace(stage ? '/map' : '/')} color={colors.muted} />
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  round: { fontSize: 15, color: colors.muted, marginBottom: 6 },
  bar: { height: 10, borderRadius: 5, backgroundColor: '#fff', overflow: 'hidden', marginBottom: 16 },
  fill: { height: 10, backgroundColor: colors.amber },
  prompt: { fontSize: 20, fontWeight: '800', color: colors.ink, textAlign: 'center', marginVertical: 12 },
  bigWord: { fontSize: 40, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', letterSpacing: 6, color: colors.ink, textAlign: 'center', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  picChoice: { width: 156, height: 156, backgroundColor: '#fff', borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  picSmall: { width: 120, height: 120 },
  hearRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 12, flexWrap: 'wrap' },
  slots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 12, flexWrap: 'wrap' },
  slot: { height: 64, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.violetText, backgroundColor: '#FFFBF0', alignItems: 'center', justifyContent: 'center' },
  slotText: { fontSize: 32, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 8 },
  clear: { textAlign: 'center', color: colors.muted, fontWeight: '800', marginTop: 10, fontSize: 16 },
  feedback: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.good, textAlign: 'center', marginTop: 16 },
  wrong: { fontSize: 14, color: colors.bad, textAlign: 'center', marginTop: 6 },
});
