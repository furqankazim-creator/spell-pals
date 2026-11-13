import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { pickWords, shuffle } from '../lib/game';
import { playSfx, cheerPair, cheerNoPair, cheerWin } from '../lib/audio';
import { useStore } from '../store/useStore';
import { STICKERS } from '../data/extras';
import { rulesFor } from '../data/levels';
import type { Word } from '../data/words';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import Celebration from '../components/Celebration';
import BigButton from '../components/BigButton';
import Pic from '../components/Pic';

interface Card { key: string; word: string; emoji?: string; text?: string }

/** Memory Match — flip cards, find the picture/word pairs. More pairs at higher levels. */
export default function MemoryMatchScreen() {
  const router = useRouter();
  const { stage } = useLocalSearchParams<{ stage?: string }>();
  const recordStage = useStore((s) => s.recordStage);
  const earnSticker = useStore((s) => s.earnSticker);
  const recordAttempt = useStore((s) => s.recordAttempt);
  const profile = useStore((s) => s.profile);
  const attempts = useStore((s) => s.attempts);
  const pairs = rulesFor(profile.level).memoryPairs;
  const cols = pairs >= 8 ? 4 : 3;
  const cards: Card[] = useMemo(() => {
    const words = pickWords(pairs, profile.level, profile.focusWords, attempts, (w) => w.word.length <= 8);
    const deck = words.flatMap((w: Word) => [
      { key: `${w.word}-pic`, word: w.word, emoji: w.emoji },
      { key: `${w.word}-word`, word: w.word, text: w.word.toUpperCase() },
    ]);
    return shuffle(deck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs, profile.level]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [tries, setTries] = useState(0);

  const flip = (i: number) => {
    if (flipped.includes(i) || matched.includes(cards[i].word) || flipped.length >= 2) return;
    playSfx('flip');
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setTries((t) => t + 1);
      const [a, b] = next;
      if (cards[a].word === cards[b].word) {
        const m = [...matched, cards[a].word];
        setMatched(m);
        recordAttempt({ word: cards[a].word, game: 'memory', tries: 1, correct: 1, at: new Date().toISOString() });
        if (m.length === pairs) cheerWin('You found all the pairs! You are a memory master!'); else cheerPair(cards[a].word);
        if (profile.rewardsOn) earnSticker(STICKERS[Math.floor(Math.random() * STICKERS.length)].id);
        if (m.length === pairs) {
          const t = tries + 1;
          if (stage) recordStage(stage, t <= pairs + 2 ? 3 : t <= pairs * 2 ? 2 : 1);
          setTimeout(() => setDone(true), 600);
        }
      } else {
        recordAttempt({ word: cards[a].word, game: 'memory', tries: 1, correct: 0, at: new Date().toISOString() });
        cheerNoPair();
      }
      setTimeout(() => setFlipped([]), 900);
    }
  };

  if (done) {
    return (
      <ScreenShell tabs={false} max={820}>
        <Celebration
          stickerEmoji="🧩" stickerLabel="Memory Master"
          stars={stage ? (tries <= pairs + 2 ? 3 : tries <= pairs * 2 ? 2 : 1) : undefined}
          doneLabel={stage ? 'Back to the map' : 'Back to Home'}
          onDone={() => router.replace(stage ? '/map' : '/')}
          onAgain={() => router.replace(stage ? ({ pathname: '/memory', params: { stage } } as never) : '/memory')}
        />
      </ScreenShell>
    );
  }
  const cardW = cols === 4 ? '22%' : '30%';
  return (
    <ScreenShell tabs={false} max={820}>
      <Text style={styles.title}>Memory Match</Text>
      <Text style={styles.sub}>Find the {pairs} pairs: a picture and its word. Tries: {tries}</Text>
      <View style={styles.grid}>
        {cards.map((c, i) => {
          const open = flipped.includes(i) || matched.includes(c.word);
          return (
            <Pressable key={c.key} onPress={() => flip(i)} style={[styles.card, { width: cardW }, open ? styles.open : null]} accessibilityRole="button">
              {open ? (c.emoji ? <Pic emoji={c.emoji} size={cols === 4 ? 56 : 84} /> : <Text style={[styles.face, cols === 4 || (c.text ?? '').length > 6 ? { fontSize: 15 } : null]}>{c.text}</Text>) : <Text style={styles.q}>?</Text>}
            </Pressable>
          );
        })}
      </View>
      <View style={{ height: 16 }} />
      <BigButton label="Quit game" onPress={() => router.replace(stage ? '/map' : '/')} color={colors.muted} />
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sub: { fontSize: 15, color: colors.muted, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  card: { aspectRatio: 0.9, backgroundColor: colors.violet, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: '#9A8CE6' },
  open: { backgroundColor: '#fff', borderBottomColor: '#E6ECF5' },
  face: { fontSize: 22, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, textAlign: 'center' },
  q: { fontSize: 36, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: '#fff' },
});
