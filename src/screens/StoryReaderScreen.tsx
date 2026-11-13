import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { STORIES, storiesForLevel } from '../data/stories';
import type { Option } from '../data/stories';
import { wordByName } from '../data/words';
import { STICKERS } from '../data/extras';
import { speak, readAloud, playNarration, cheerCorrect, cheerWrong, cheerWin, playSfx } from '../lib/audio';
import { NARRATION } from '../data/narration';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';
import { useLayout } from '../lib/useLayout';
import { personalize, shuffleAnswers } from '../lib/personalize';
import ScreenShell from '../components/ScreenShell';
import BigButton from '../components/BigButton';
import Pic from '../components/Pic';

const clean = (w: string) => w.replace(/[^a-zA-Z']/g, '').toLowerCase();

/** Story reader: picture scene + read-to-me with word highlighting + tap-a-word, then questions, then stars. */
export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { wide } = useLayout();
  const profile = useStore((s) => s.profile);
  const base = STORIES.find((s) => s.id === id) ?? STORIES[0];
  const story = useMemo(() => shuffleAnswers(personalize(base, profile.name, profile.avatar)), [base, profile.name, profile.avatar]);
  const recordStory = useStore((s) => s.recordStory);
  const addStoryWord = useStore((s) => s.addStoryWord);
  const earnSticker = useStore((s) => s.earnSticker);
  const storiesRead = useStore((s) => s.storiesRead);

  const [phase, setPhase] = useState<'read' | 'quiz' | 'done'>('read');
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(-1);
  const [reading, setReading] = useState(false);
  const [qi, setQi] = useState(0);
  const [wrongSet, setWrongSet] = useState<number[]>([]);
  const [wrongTotal, setWrongTotal] = useState(0);
  const [rightPick, setRightPick] = useState<number | null>(null);
  const stopRef = useRef<() => void>(() => {});

  const stopReading = () => { stopRef.current(); stopRef.current = () => {}; setReading(false); setActive(-1); };
  useEffect(() => () => stopRef.current(), []);

  const pg = story.pages[page];
  const words = pg.text.split(' ');
  const last = page === story.pages.length - 1;
  const textSize = story.level <= 2 ? 30 : story.level === 3 ? 26 : 22;

  const readThisPage = () => {
    if (reading) { stopReading(); return; }
    setReading(true);
    const end = () => { setReading(false); setActive(-1); };
    const recorded = base.id.startsWith('me-') ? undefined : NARRATION[`${base.id}-${page + 1}`];
    stopRef.current = recorded ? playNarration(recorded, words, setActive, end) : readAloud(words, setActive, end);
  };
  const tapWord = (w: string) => {
    stopReading();
    const c = clean(w);
    speak(c, { slow: true });
    if (wordByName(c)) addStoryWord(c);
  };
  const goPage = (n: number) => { stopReading(); setPage(n); };
  const startQuiz = () => {
    stopReading();
    setPhase('quiz'); setQi(0); setWrongSet([]); setWrongTotal(0); setRightPick(null);
    speak(story.questions[0].q, { delay: 400 });
  };

  const q = story.questions[qi];
  const pick = (i: number) => {
    if (rightPick !== null || wrongSet.includes(i)) return;
    if (i === q.answer) {
      setRightPick(i);
      cheerCorrect(profile.name);
      setTimeout(() => {
        setRightPick(null); setWrongSet([]);
        if (qi + 1 >= story.questions.length) { setPhase('done'); }
        else { setQi(qi + 1); speak(story.questions[qi + 1].q, { delay: 200 }); }
      }, 1300);
    } else {
      setWrongSet((w) => [...w, i]);
      setWrongTotal((n) => n + 1);
      const kw = story.keywords[qi % story.keywords.length];
      if (wordByName(kw)) addStoryWord(kw);
      cheerWrong(profile.name);
    }
  };

  const stars = wrongTotal === 0 ? 3 : wrongTotal <= 2 ? 2 : 1;
  useEffect(() => {
    if (phase !== 'done') return;
    recordStory(story.id, stars);
    const count = Object.keys({ ...storiesRead, [story.id]: 1 }).length;
    if (profile.rewardsOn) {
      earnSticker('book');
      if (count >= 5 && STICKERS.some((s) => s.id === 'reader')) earnSticker('reader');
    }
    cheerWin(`You finished ${story.title}! You earned ${stars} ${stars === 1 ? 'star' : 'stars'}. Well done, ${profile.name}!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const spellKeyword = () => {
    const kws = story.keywords.filter((k) => wordByName(k));
    router.push({ pathname: '/spell', params: { word: kws[Math.floor(Math.random() * kws.length)] ?? story.keywords[0] } } as never);
  };
  const nextStory = () => {
    const pool = storiesForLevel(story.level);
    const i = pool.findIndex((s) => s.id === story.id);
    const nxt = pool[(i + 1) % pool.length];
    setPhase('read'); setPage(0);
    router.replace({ pathname: '/story', params: { id: nxt.id } } as never);
  };

  // ───────────────────────── QUESTIONS ─────────────────────────
  if (phase === 'quiz') {
    return (
      <ScreenShell max={820}>
        <Text style={styles.title}>{story.emoji} {story.title}</Text>
        <Text style={styles.page}>Question {qi + 1} of {story.questions.length}</Text>
        <View style={styles.qCard}>
          <Text style={styles.qText}>{q.q}</Text>
          <View style={{ height: 8 }} />
          <BigButton label="Hear the question" icon="volume-high" onPress={() => speak(q.q)} color={colors.violet} />
        </View>
        <View style={styles.opts}>
          {q.options.map((o: Option, i: number) => {
            const wrong = wrongSet.includes(i);
            const right = rightPick === i;
            return (
              <Pressable
                key={i}
                onPress={() => pick(i)}
                style={[styles.opt, wrong ? styles.optWrong : null, right ? styles.optRight : null]}
                accessibilityRole="button"
              >
                <Pic emoji={o.emoji} size={wide ? 96 : 80} />
                <Text style={styles.optLabel}>{o.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {wrongSet.length ? <Text style={styles.tryAgain}>Try again — you can do it!</Text> : null}
        {rightPick !== null ? <Text style={styles.good}>🎉 That is right!</Text> : null}
      </ScreenShell>
    );
  }

  // ───────────────────────── FINISHED ─────────────────────────
  if (phase === 'done') {
    return (
      <ScreenShell max={820}>
        <View style={styles.doneWrap}>
          <Pic emoji={story.emoji} size={140} />
          <Text style={styles.doneTitle}>You finished {story.title}!</Text>
          <View style={styles.starRow}>
            {[1, 2, 3].map((n) => (<View key={n} style={{ opacity: n <= stars ? 1 : 0.25 }}><Pic emoji="⭐" size={wide ? 84 : 70} /></View>))}
          </View>
          <Text style={styles.doneSub}>{stars === 3 ? 'Perfect! You got every answer right the first time.' : stars === 2 ? 'Great reading! Read again to get all 3 stars.' : 'Good try! Read the story again to learn more.'}</Text>
          <BigButton label="Spell a word from this story" icon="pencil" onPress={spellKeyword} color={colors.amber} />
          <BigButton label="Read the next story" onPress={nextStory} color={colors.violet} />
          <BigButton label="Read this story again" onPress={() => { setPhase('read'); setPage(0); }} color="#fff" />
          <BigButton label="All stories" onPress={() => router.replace('/stories')} color="#fff" />
        </View>
      </ScreenShell>
    );
  }

  // ───────────────────────── READING ─────────────────────────
  const picSize = pg.pics.length === 1 ? (wide ? 200 : 160) : pg.pics.length === 2 ? (wide ? 150 : 120) : (wide ? 120 : 92);
  return (
    <ScreenShell max={820}>
      <Text style={styles.title}>{story.emoji} {story.title}</Text>
      <View style={styles.dots}>
        {story.pages.map((_, i) => (<View key={i} style={[styles.dot, i === page ? styles.dotOn : i < page ? styles.dotDone : null]} />))}
      </View>
      <Text style={styles.page}>Page {page + 1} of {story.pages.length}</Text>

      <View style={styles.scene}>
        {pg.pics.map((e, i) => (<Pic key={i} emoji={e} size={picSize} />))}
      </View>

      <View style={styles.card}>
        <Text style={[styles.text, { fontSize: textSize, lineHeight: textSize * 1.55 }]}>
          {words.map((w, i) => (
            <Text key={i} onPress={() => tapWord(w)} style={[styles.word, active === i ? styles.wordOn : null]}>{w}{' '}</Text>
          ))}
        </Text>
      </View>

      <View style={styles.row}>
        <BigButton label={reading ? 'Stop' : 'Read to me'} icon="volume-high" onPress={readThisPage} color={reading ? colors.coral : colors.violet} />
      </View>
      <Text style={styles.hint}>Tap any word to hear it.</Text>

      <View style={styles.row}>
        {page > 0 ? <BigButton label="← Back" onPress={() => goPage(page - 1)} color={colors.sky} /> : null}
        {last
          ? <BigButton label="Questions →" onPress={() => { playSfx('correct'); startQuiz(); }} color={colors.teal} />
          : <BigButton label="Next →" onPress={() => goPage(page + 1)} color={colors.amber} />}
      </View>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 26, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, marginBottom: 6 },
  page: { fontSize: 15, color: colors.ink, marginBottom: 12 },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  dot: { width: 22, height: 8, borderRadius: 4, backgroundColor: '#fff', opacity: 0.6 },
  dotOn: { backgroundColor: '#FFC93C', opacity: 1 },
  dotDone: { backgroundColor: '#fff', opacity: 1 },
  scene: { backgroundColor: '#fff', borderRadius: 32, paddingVertical: 18, paddingHorizontal: 12, marginBottom: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 22, marginBottom: 14 },
  text: { color: colors.ink },
  word: { color: colors.ink },
  wordOn: { backgroundColor: '#FFE27A', borderRadius: 8, color: colors.ink },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' },
  hint: { textAlign: 'center', fontSize: 14, color: colors.ink, marginBottom: 12 },
  qCard: { backgroundColor: '#fff', borderRadius: 28, padding: 22, marginBottom: 16, alignItems: 'center' },
  qText: { fontSize: 26, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, textAlign: 'center' },
  opts: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  opt: { minWidth: 150, backgroundColor: '#fff', borderRadius: 28, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', borderBottomWidth: 5, borderBottomColor: '#DCE8F5' },
  optWrong: { opacity: 0.35, backgroundColor: '#FFE3E6' },
  optRight: { backgroundColor: '#D4F8E1', borderBottomColor: '#6CC590' },
  optLabel: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, marginTop: 4 },
  tryAgain: { textAlign: 'center', fontSize: 18, color: colors.bad, marginTop: 14 },
  good: { textAlign: 'center', fontSize: 22, color: colors.good, marginTop: 14, fontFamily: 'Baloo2_800ExtraBold' },
  doneWrap: { alignItems: 'center', gap: 12, paddingVertical: 20 },
  doneTitle: { fontSize: 30, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, textAlign: 'center' },
  starRow: { flexDirection: 'row', gap: 10 },
  doneSub: { fontSize: 17, color: colors.ink, textAlign: 'center', marginBottom: 8 },
});
