import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ROUNDS, pickProgressiveWords, shuffle, vowelIndex } from '../lib/game';
import { BOSS_ROUNDS } from '../data/mapStages';
import { speak, speakSounds, playSfx, cheerCorrect, cheerWrong, cheerHint, cheerWin } from '../lib/audio';
import { useStore } from '../store/useStore';
import { STICKERS } from '../data/extras';
import { WORDS, wordByName } from '../data/words';
import { levelInfo, rulesForRound, roundStageInfo } from '../data/levels';
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

interface RoundBreakInfo {
  completedRound: number;
  nextRound: number;
  xp: number;
  streak: number;
  wordsMastered: Word[];
}

/** One round engine for the letter games, scaled to the child's level with progressive round-by-round complexity. */
export default function GameScreen({ game }: { game: GameId }) {
  const router = useRouter();
  const { word: forced, stage, boss } = useLocalSearchParams<{ word?: string; stage?: string; boss?: string }>();
  const TOTAL = boss === '1' ? BOSS_ROUNDS : ROUNDS;
  const recordStage = useStore((s) => s.recordStage);
  const sessionWrong = useRef(0);
  const streakRef = useRef(0);
  const totalXpRef = useRef(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const profile = useStore((s) => s.profile);
  const attempts = useStore((s) => s.attempts);
  const storyWords = useStore((s) => s.storyWords);
  const recordAttempt = useStore((s) => s.recordAttempt);
  const recordSession = useStore((s) => s.recordSession);
  const earnSticker = useStore((s) => s.earnSticker);
  const addMinutes = useStore((s) => s.addMinutes);
  const info = levelInfo(profile.level);

  const customWords = useStore((s) => s.profile.customWords ?? []);

  // Build the rounds with progressive difficulty: simpler words first, challenge words in later rounds
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
    const rest = pickProgressiveWords(TOTAL, profile.level, [...profile.focusWords, ...storyWords.slice(-3)], attempts, only, customWords);
    const list = first ? [first, ...rest.filter((w) => w.word !== first.word)].slice(0, TOTAL) : rest;
    return list.map((w) => ({
      word: w,
      mode: profile.level >= 3 && w.word.length > 3 && Math.random() < 0.35 ? ('end' as const) : ('start' as const),
      rhymeAnswers: [],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, game, profile.level]);

  const [round, setRound] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);
  const [used, setUsed] = useState<number[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState(0);
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [clearedOverlay, setClearedOverlay] = useState<{
    word: Word;
    roundIndex: number;
    streak: number;
    xp: number;
    nextBadge: string;
    perfect: boolean;
  } | null>(null);
  const [roundBreak, setRoundBreak] = useState<RoundBreakInfo | null>(null);

  const currentMajorRound = round < 2 ? 1 : round < 4 ? 2 : 3;

  const startRef = useRef(Date.now());
  const cur = rounds[round] || rounds[0];
  const word: Word = cur.word;
  const targetLetter = cur.mode === 'end' ? word.word[word.word.length - 1] : word.word[0];

  // Dynamic round rules & stage complexity
  const rules = rulesForRound(profile.level, round, TOTAL);
  const stageInfo = roundStageInfo(round, TOTAL);

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
  }, [game, word, round, rules.pickChoices, rules.rhymeDistractors]);

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

  const advanceNextRound = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setClearedOverlay(null);
    setRound((r) => r + 1);
    setTries(0);
  };

  const startNextMajorRound = () => {
    if (!roundBreak) return;
    const nextTarget = roundBreak.completedRound === 1 ? 2 : 4;
    setRoundBreak(null);
    setRound(nextTarget);
    setTries(0);
    playSfx('tap');
    speak(roundBreak.nextRound === 2 ? `Welcome to Round 2! Power up!` : `Final Round 3! Show your mastery!`);
  };

  const finishRound = (correct: boolean) => {
    recordAttempt({ word: word.word, game, tries: tries + 1, correct: correct ? 1 : 0, at: new Date().toISOString() });
    if (correct) {
      const isPerfect = tries === 0;
      streakRef.current += 1;
      const roundXp = stageInfo.xpBonus + (isPerfect ? 5 : 0);
      totalXpRef.current += roundXp;

      // Check if this completes Round 1 (at word index 1)
      if (round === 1) {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
        playSfx('win');
        cheerWin(`Round 1 complete, ${profile.name}! Fantastic job!`);
        setRoundBreak({
          completedRound: 1,
          nextRound: 2,
          xp: totalXpRef.current,
          streak: streakRef.current,
          wordsMastered: [rounds[0]?.word ?? word, word],
        });
        return;
      }

      // Check if this completes Round 2 (at word index 3)
      if (round === 3) {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
        playSfx('win');
        cheerWin(`Round 2 complete, ${profile.name}! You are on fire!`);
        setRoundBreak({
          completedRound: 2,
          nextRound: 3,
          xp: totalXpRef.current,
          streak: streakRef.current,
          wordsMastered: [rounds[2]?.word ?? word, word],
        });
        return;
      }

      // Check if this completes Round 3 (at word index 5 or end of game)
      if (round + 1 >= TOTAL) {
        cheerWin(profile.rewardsOn ? `Amazing, ${profile.name}! You finished all 3 rounds and earned a sticker!` : `Amazing, ${profile.name}! All 3 rounds complete!`);
        if (profile.rewardsOn) earnSticker(STICKERS[Math.floor(Math.random() * STICKERS.length)].id);
        setTimeout(() => {
          if (stage) recordStage(stage, sessionWrong.current === 0 ? 3 : sessionWrong.current <= 3 ? 2 : 1);
          recordSession({ id: `${Date.now()}`, game, durationSeconds: Math.round((Date.now() - startRef.current) / 1000), at: new Date().toISOString() });
          addMinutes(1);
          setDone(true);
        }, 1200);
      } else {
        playSfx('win');
        cheerCorrect(profile.name);
        const nextInfo = roundStageInfo(round + 1, TOTAL);
        setClearedOverlay({
          word,
          roundIndex: round,
          streak: streakRef.current,
          xp: roundXp,
          nextBadge: nextInfo.badge,
          perfect: isPerfect,
        });

        autoAdvanceRef.current = setTimeout(() => {
          advanceNextRound();
        }, 2200);
      }
    } else {
      streakRef.current = 0;
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
      <ScreenShell tabs={false} max={820} onBack={() => router.replace(stage ? '/map' : '/')} backLabel="← Back">
        <Celebration
          stickerEmoji="⭐"
          stickerLabel="Super Star"
          stars={sessionWrong.current === 0 ? 3 : sessionWrong.current <= 3 ? 2 : 1}
          level={profile.level}
          levelName={info.name}
          levelEmoji={info.emoji}
          totalRounds={TOTAL}
          xpEarned={totalXpRef.current}
          doneLabel={stage ? 'Back to the map' : 'Back to Home'}
          onDone={() => router.replace(stage ? '/map' : '/')}
          onAgain={() => { sessionWrong.current = 0; streakRef.current = 0; totalXpRef.current = 0; setRound(0); setTries(0); setDone(false); }}
          rewardsOn={profile.rewardsOn}
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
      {/* ─────────────────── LEVEL & ROUND STEPPING-STONES HEADER ─────────────────── */}
      <View style={styles.topJourneyCard}>
        <View style={styles.journeyHeaderRow}>
          <Text style={styles.gameTitle}>{TITLES[game]}</Text>
          <View style={[styles.roundTierBadge, { backgroundColor: stageInfo.bg, borderColor: stageInfo.color }]}>
            <Text style={[styles.roundTierBadgeText, { color: stageInfo.color }]}>{stageInfo.badge}</Text>
          </View>
        </View>

        <Text style={styles.journeySub}>
          {info.emoji} Level {profile.level}: {info.name} · Round {currentMajorRound} of 3 (Word {round + 1} of {TOTAL})
        </Text>

        {/* 3-Round Stage Progression */}
        <View style={styles.threeRoundsTrack}>
          <View style={[styles.roundPill, currentMajorRound === 1 && styles.roundPillActive, currentMajorRound > 1 && styles.roundPillDone]}>
            <Text style={styles.roundPillEmoji}>{currentMajorRound > 1 ? '✅' : '🌱'}</Text>
            <Text style={[styles.roundPillText, currentMajorRound === 1 && styles.roundPillTextActive, currentMajorRound > 1 && styles.roundPillTextDone]}>
              Round 1
            </Text>
          </View>
          <Text style={styles.roundArrow}>➔</Text>
          <View style={[styles.roundPill, currentMajorRound === 2 && styles.roundPillActive, currentMajorRound > 2 && styles.roundPillDone]}>
            <Text style={styles.roundPillEmoji}>{currentMajorRound > 2 ? '✅' : '⚡'}</Text>
            <Text style={[styles.roundPillText, currentMajorRound === 2 && styles.roundPillTextActive, currentMajorRound > 2 && styles.roundPillTextDone]}>
              Round 2
            </Text>
          </View>
          <Text style={styles.roundArrow}>➔</Text>
          <View style={[styles.roundPill, currentMajorRound === 3 && styles.roundPillActive]}>
            <Text style={styles.roundPillEmoji}>👑</Text>
            <Text style={[styles.roundPillText, currentMajorRound === 3 && styles.roundPillTextActive]}>
              Round 3 (Boss)
            </Text>
          </View>
        </View>

        {/* Stepping Stones Path */}
        <View style={styles.steppingStones}>
          {rounds.map((_, i) => {
            const isCompleted = i < round;
            const isCurrent = i === round;
            const isBoss = i === TOTAL - 1;
            return (
              <React.Fragment key={i}>
                <View
                  style={[
                    styles.stone,
                    isCompleted && styles.stoneCompleted,
                    isCurrent && styles.stoneCurrent,
                    isBoss && !isCompleted && styles.stoneBoss,
                  ]}
                >
                  {isCompleted ? (
                    <Text style={styles.stoneStar}>⭐</Text>
                  ) : isCurrent ? (
                    <Pic emoji={profile.avatar || '🐼'} size={26} />
                  ) : isBoss ? (
                    <Text style={styles.stoneBossIcon}>👑</Text>
                  ) : (
                    <Text style={styles.stoneNum}>{i + 1}</Text>
                  )}
                </View>
                {i < TOTAL - 1 && (
                  <View style={[styles.stoneLine, i < round && styles.stoneLineActive]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* ─────────────────── MAIN GAME ACTIVITY ─────────────────── */}
      {game === 'match' ? (
        <View>
          <Text style={styles.prompt}>Find the picture for:</Text>
          <Text style={styles.bigWord}>{word.word.toUpperCase()}</Text>
          <View style={styles.grid}>
            {matchChoices.map((c) => (
              <Pressable key={c.word} onPress={() => tapChoice(c.word)} style={[styles.picChoice, smallPics ? styles.picSmall : null]}>
                <Pic emoji={c.emoji} imageUri={c.imageUri} size={smallPics ? 112 : 140} />
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
      <Pressable
        onPress={() => router.replace(stage ? '/map' : '/')}
        style={styles.quitTextBtn}
        accessibilityRole="button"
        accessibilityLabel="Quit game"
      >
        <Text style={styles.quitText}>Quit game ✕</Text>
      </Pressable>

      {/* ─────────────────── ROUND CLEARED VICTORY OVERLAY ─────────────────── */}
      {clearedOverlay && (
        <View style={styles.clearedOverlay}>
          <View style={styles.clearedModal}>
            <View style={styles.clearedStarCircle}>
              <Text style={{ fontSize: 36 }}>⭐</Text>
            </View>
            <Text style={styles.clearedTitle}>Round {clearedOverlay.roundIndex + 1} Cleared!</Text>

            <View style={styles.clearedWordCard}>
              <Pic emoji={clearedOverlay.word.emoji} size={64} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.clearedWordText}>{clearedOverlay.word.word.toUpperCase()}</Text>
                <Text style={styles.clearedWordBadge}>
                  {clearedOverlay.perfect ? '✨ Perfect! No hints needed' : '🎉 Word Mastered!'}
                </Text>
              </View>
            </View>

            <View style={styles.clearedStatsRow}>
              <View style={styles.streakBadge}>
                <Text style={{ fontSize: 14 }}>🔥</Text>
                <Text style={styles.streakText}>{clearedOverlay.streak} Streak</Text>
              </View>
              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>+{clearedOverlay.xp} XP</Text>
              </View>
            </View>

            <View style={styles.nextTeaserBox}>
              <Text style={styles.nextTeaserLabel}>Up Next:</Text>
              <Text style={styles.nextTeaserBadge}>{clearedOverlay.nextBadge} 🚀</Text>
            </View>

            <Pressable onPress={advanceNextRound} style={styles.continueBtn}>
              <Text style={styles.continueBtnText}>Next Challenge ➔</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ─────────────────── MAJOR 3-ROUND BREAK MODAL ─────────────────── */}
      {roundBreak && (
        <View style={styles.roundBreakOverlay}>
          <View style={styles.roundBreakModal}>
            <View style={styles.roundBreakHeader}>
              <View style={styles.roundBreakCrown}>
                <Text style={{ fontSize: 42 }}>
                  {roundBreak.completedRound === 1 ? '🌱' : '⚡'}
                </Text>
              </View>
              <Text style={styles.roundBreakTitle}>
                Round {roundBreak.completedRound} Complete!
              </Text>
              <Text style={styles.roundBreakSubtitle}>
                {roundBreak.completedRound === 1
                  ? 'Fantastic start! You conquered the Warm-Up.'
                  : 'Incredible power! You crushed the Core Challenge.'}
              </Text>
            </View>

            {/* Words Mastered in this Round */}
            <View style={styles.roundBreakWordsBox}>
              <Text style={styles.roundBreakWordsLabel}>
                Words Mastered in Round {roundBreak.completedRound}:
              </Text>
              <View style={styles.roundBreakWordsList}>
                {roundBreak.wordsMastered.map((w, idx) => (
                  <View key={`${w.word}-${idx}`} style={styles.masteredWordChip}>
                    <Pic emoji={w.emoji} imageUri={w.imageUri} size={28} />
                    <Text style={styles.masteredWordText}>{w.word.toUpperCase()}</Text>
                    <Text style={styles.masteredCheck}>✓</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.roundBreakStatsRow}>
              <View style={styles.roundStatCard}>
                <Text style={styles.roundStatIcon}>🔥</Text>
                <Text style={styles.roundStatValue}>{roundBreak.streak}</Text>
                <Text style={styles.roundStatLabel}>Streak</Text>
              </View>
              <View style={styles.roundStatCard}>
                <Text style={styles.roundStatIcon}>⭐</Text>
                <Text style={styles.roundStatValue}>+{roundBreak.xp}</Text>
                <Text style={styles.roundStatLabel}>XP Earned</Text>
              </View>
            </View>

            {/* Next Round Invitation */}
            <View style={styles.roundNextInviteCard}>
              <Text style={styles.roundNextInviteTitle}>
                Ready for Round {roundBreak.nextRound}?
              </Text>
              <Text style={styles.roundNextInviteDesc}>
                {roundBreak.nextRound === 2
                  ? 'Round 2: Power Up Challenge with faster clues & extra XP!'
                  : 'Round 3: Grand Star Boss! Conquer to claim your Victory Star & Sticker!'}
              </Text>
            </View>

            {/* Action Buttons */}
            <Pressable onPress={startNextMajorRound} style={styles.startNextRoundBtn}>
              <Text style={styles.startNextRoundBtnText}>
                {roundBreak.nextRound === 2 ? '🚀 Start Round 2 ➔' : '👑 Start Final Round 3 ➔'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace(stage ? '/map' : '/')}
              style={styles.takeBreakBtn}
            >
              <Text style={styles.takeBreakBtnText}>Take a Break / ← Home</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topJourneyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  journeyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gameTitle: {
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
  },
  roundTierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  roundTierBadgeText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
  },
  journeySub: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    marginBottom: 8,
  },
  threeRoundsTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 10,
    gap: 6,
  },
  roundPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  roundPillActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  roundPillDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  roundPillEmoji: {
    fontSize: 13,
  },
  roundPillText: {
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  roundPillTextActive: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#92400E',
  },
  roundPillTextDone: {
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#15803D',
  },
  roundArrow: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  steppingStones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  stone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stoneCompleted: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  stoneCurrent: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
    transform: [{ scale: 1.15 }],
  },
  stoneBoss: {
    borderColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  stoneStar: {
    fontSize: 16,
  },
  stoneBossIcon: {
    fontSize: 16,
  },
  stoneNum: {
    fontSize: 13,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.muted,
  },
  stoneLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
    maxWidth: 24,
  },
  stoneLineActive: {
    backgroundColor: '#F59E0B',
  },

  prompt: { fontSize: 20, fontWeight: '800', color: colors.ink, textAlign: 'center', marginVertical: 12 },
  bigWord: { fontSize: 40, fontFamily: 'Baloo2_800ExtraBold', letterSpacing: 6, color: colors.ink, textAlign: 'center', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  picChoice: { width: 172, height: 172, backgroundColor: '#fff', borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#EDF2F7', shadowColor: '#5B8DB8', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  picSmall: { width: 138, height: 138, borderRadius: 26 },
  hearRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 12, flexWrap: 'wrap' },
  slots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 12, flexWrap: 'wrap' },
  slot: { height: 64, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.violetText, backgroundColor: '#FFFBF0', alignItems: 'center', justifyContent: 'center' },
  slotText: { fontSize: 32, fontFamily: 'Baloo2_800ExtraBold', color: colors.ink },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 8 },
  clear: { textAlign: 'center', color: colors.muted, fontWeight: '800', marginTop: 10, fontSize: 16 },
  feedback: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', color: colors.good, textAlign: 'center', marginTop: 16 },
  wrong: { fontSize: 14, color: colors.bad, textAlign: 'center', marginTop: 6 },

  /* Round Cleared Modal */
  clearedOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 99,
  },
  clearedModal: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F59E0B',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  clearedStarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  clearedTitle: {
    fontSize: 24,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
    marginBottom: 12,
  },
  clearedWordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    width: '100%',
    marginBottom: 12,
  },
  clearedWordText: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
    letterSpacing: 1,
  },
  clearedWordBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  clearedStatsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 12,
  },
  streakBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingVertical: 6,
    gap: 4,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EA580C',
  },
  xpBadge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingVertical: 6,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4F46E5',
  },
  nextTeaserBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: 16,
    gap: 6,
  },
  nextTeaserLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '700',
  },
  nextTeaserBadge: {
    fontSize: 12,
    fontFamily: 'Baloo2_800ExtraBold',
    color: '#2563EB',
  },
  continueBtn: {
    width: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#D97706',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  /* Major 3-Round Break Modal */
  roundBreakOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 100,
  },
  roundBreakModal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F59E0B',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  roundBreakHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  roundBreakCrown: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    borderWidth: 3,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roundBreakTitle: {
    fontSize: 24,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  roundBreakSubtitle: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  roundBreakWordsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 12,
  },
  roundBreakWordsLabel: {
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 6,
    textAlign: 'center',
  },
  roundBreakWordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  masteredWordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  masteredWordText: {
    fontSize: 13,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  masteredCheck: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
  },
  roundBreakStatsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 12,
  },
  roundStatCard: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundStatIcon: {
    fontSize: 18,
  },
  roundStatValue: {
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#B45309',
  },
  roundStatLabel: {
    fontSize: 10,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  roundNextInviteCard: {
    width: '100%',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    padding: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  roundNextInviteTitle: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#3730A3',
    marginBottom: 2,
  },
  roundNextInviteDesc: {
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#4F46E5',
    textAlign: 'center',
  },
  startNextRoundBtn: {
    width: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#3730A3',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  startNextRoundBtnText: {
    fontSize: 17,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  takeBreakBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  takeBreakBtnText: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  quitTextBtn: {
    marginTop: 18,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  quitText: {
    fontSize: 15,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#64748B',
  },
});
