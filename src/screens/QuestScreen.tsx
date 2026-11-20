import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getStageById, getStagesForLevel, MapStage } from '../data/mapStages';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';
import { speak, playSfx, cheerWin, cheerCorrect, cheerWrong } from '../lib/audio';
import ScreenShell from '../components/ScreenShell';
import BigButton from '../components/BigButton';
import Pic from '../components/Pic';
import LetterTile from '../components/LetterTile';

export default function QuestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ stage?: string; level?: string }>();
  const profile = useStore((s) => s.profile);
  const recordStage = useStore((s) => s.recordStage);
  const earnSticker = useStore((s) => s.earnSticker);
  const addMinutes = useStore((s) => s.addMinutes);

  const activeLevel = params.level ? parseInt(params.level, 10) : profile.level;
  const stages = useMemo(() => getStagesForLevel(activeLevel), [activeLevel]);
  const stage: MapStage = useMemo(() => {
    if (params.stage) {
      const found = getStageById(params.stage, activeLevel);
      if (found) return found;
    }
    return stages[0];
  }, [params.stage, activeLevel, stages]);

  const [questionIdx, setQuestionIdx] = useState(0);
  const [slots, setSlots] = useState<string[]>([]);
  const [used, setUsed] = useState<number[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrongTries, setWrongTries] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [lockOpen, setLockOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  const sessionWrong = useRef(0);
  const startRef = useRef(Date.now());
  const curQ = stage.questions[questionIdx] || stage.questions[0];

  // Letter tiles for spell phase (Phase 2 & 3)
  const letters = useMemo(() => {
    const base = curQ.word.toLowerCase().split('');
    const decoys = ['a', 'b', 'c', 'd', 'e', 'm', 'p', 's', 't']
      .filter((c) => !base.includes(c))
      .slice(0, 2);
    const combined = [...base, ...decoys];
    // shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined;
  }, [curQ.word]);

  // Read the story prompt when entering a question
  useEffect(() => {
    setFeedback('');
    setSlots([]);
    setUsed([]);
    setPicked(null);
    speak(curQ.storyPrompt, { delay: 300 });
  }, [questionIdx, curQ]);

  const onSelectChoice = (choice: string) => {
    setPicked(choice);
    const isCorrect = choice.toLowerCase() === curQ.word.toLowerCase();
    if (isCorrect) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const tapLetter = (letter: string, idx: number) => {
    if (used.includes(idx) || slots.length >= curQ.word.length) return;
    playSfx('tap');
    const nextSlots = [...slots, letter];
    const nextUsed = [...used, idx];
    setSlots(nextSlots);
    setUsed(nextUsed);

    if (nextSlots.length === curQ.word.length) {
      const spelled = nextSlots.join('').toLowerCase();
      if (spelled === curQ.word.toLowerCase()) {
        handleSuccess();
      } else {
        handleFailure();
      }
    }
  };

  const handleSuccess = () => {
    playSfx('win');
    cheerCorrect(profile.name);

    // If this was the final Lock-Breaker question
    if (questionIdx === stage.questions.length - 1) {
      setLockOpen(true);
      speak(`Padlock unlocked! Fantastic job, ${profile.name}!`, { delay: 200 });

      const starsEarned = sessionWrong.current === 0 ? 3 : sessionWrong.current <= 2 ? 2 : 1;
      recordStage(stage.id, starsEarned);
      addMinutes(1);
      if (profile.rewardsOn) {
        earnSticker('star');
      }

      setTimeout(() => {
        setCompleted(true);
      }, 1600);
    } else {
      setFeedback('✨ Correct! The lock pin clicks!');
      setTimeout(() => {
        setQuestionIdx((i) => i + 1);
      }, 1200);
    }
  };

  const handleFailure = () => {
    sessionWrong.current += 1;
    setWrongTries((w) => w + 1);
    cheerWrong(profile.name);
    setFeedback(`Try again! Hint: ${curQ.hint}`);
    setTimeout(() => {
      setSlots([]);
      setUsed([]);
      setPicked(null);
    }, 1200);
  };

  const starsEarned = sessionWrong.current === 0 ? 3 : sessionWrong.current <= 2 ? 2 : 1;
  const nextStage = stages.find((s) => s.lockNumber === stage.lockNumber + 1);

  if (completed) {
    return (
      <ScreenShell tabs={false} max={640} onBack={() => router.replace('/map')} backLabel="← Map">
        <View style={styles.victoryCard}>
          <View style={styles.unlockedIconCircle}>
            <Text style={{ fontSize: 56 }}>🔓</Text>
          </View>

          <Text style={styles.victoryTitle}>Lock {stage.lockNumber} Unlocked!</Text>
          <Text style={styles.victorySubtitle}>{stage.title} Conquered!</Text>

          {/* Stars Earned */}
          <View style={styles.victoryStarsRow}>
            {[1, 2, 3].map((s) => (
              <Text key={s} style={[styles.victoryStar, { opacity: s <= starsEarned ? 1 : 0.25 }]}>
                ⭐
              </Text>
            ))}
          </View>
          <Text style={styles.victoryStarsLabel}>
            {starsEarned === 3 ? '✨ Perfect Run! 3 Stars!' : `${starsEarned} Adventure Stars Earned!`}
          </Text>

          {/* Reward Badge */}
          <View style={styles.rewardBadgeCard}>
            <Text style={{ fontSize: 28 }}>{stage.boss ? '👑' : '🗝️'}</Text>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.rewardBadgeTitle}>{stage.rewardBadge}</Text>
              <Text style={styles.rewardBadgeDesc}>Unlocked on your Adventure Map</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.victoryActions}>
            {nextStage ? (
              <BigButton
                label={`Start Lock ${nextStage.lockNumber} ➔`}
                onPress={() => {
                  router.replace({
                    pathname: '/quest',
                    params: { stage: nextStage.id, level: `${activeLevel}` },
                  } as never);
                }}
                color={colors.amber}
              />
            ) : null}
            <View style={{ height: 10 }} />
            <BigButton
              label="🗺️ Back to Adventure Map"
              onPress={() => router.replace('/map')}
              color={colors.violet}
            />
          </View>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell tabs={false} scroll={false} max={640} onBack={() => router.replace('/map')} backLabel="← Map">
      <View style={styles.container}>
        {/* Top Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.lockNumberBadge}>
              <Text style={styles.lockNumberText}>
                {stage.boss ? '👑 BOSS LOCK 10' : `🔒 LOCK ${stage.lockNumber} OF 10`}
              </Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Level {stage.level} Quest</Text>
            </View>
          </View>

          <Text style={styles.stageTitle}>{stage.title}</Text>

          {/* 3 Quest Phase Stepper */}
          <View style={styles.phaseStepper}>
            {stage.questions.map((_, i) => (
              <View key={i} style={styles.phaseStepItem}>
                <View
                  style={[
                    styles.phaseDot,
                    i < questionIdx && styles.phaseDotDone,
                    i === questionIdx && styles.phaseDotActive,
                  ]}
                >
                  <Text style={styles.phaseDotText}>
                    {i < questionIdx ? '✓' : i === 2 ? '🔒' : `${i + 1}`}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.phaseLabel,
                    i === questionIdx && styles.phaseLabelActive,
                  ]}
                >
                  {i === 0 ? 'Clue' : i === 1 ? 'Rune' : 'Lock Break'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Narrative Story Dialogue Card */}
        <View style={styles.storyCard}>
          <View style={styles.characterAvatar}>
            <Text style={{ fontSize: 26 }}>{stage.character}</Text>
          </View>
          <View style={styles.dialogueBox}>
            <Text style={styles.characterName}>{stage.characterName}</Text>
            <Text style={styles.storyText}>{stage.story}</Text>
          </View>
        </View>

        {/* Current Quest Challenge */}
        <View style={styles.challengeCard}>
          <View style={styles.challengePromptBox}>
            <Text style={styles.challengePhaseTag}>
              {questionIdx === 2 ? '🔥 FINAL LOCK TRIAL' : `TRIAL ${questionIdx + 1} OF 3`}
            </Text>
            <Text style={styles.challengePrompt}>{curQ.storyPrompt}</Text>
          </View>

          {/* Visual Clue Card */}
          <View style={styles.clueBox}>
            <Pic emoji={curQ.emoji} size={54} />
            <Text style={styles.clueText}>“{curQ.clue}”</Text>
          </View>

          {/* Challenge Interaction */}
          {questionIdx === 0 ? (
            <View style={styles.choicesRow}>
              {curQ.choices.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => onSelectChoice(c)}
                  style={[
                    styles.choiceButton,
                    picked === c && styles.choiceButtonPicked,
                  ]}
                >
                  <Text style={styles.choiceButtonText}>{c.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.spellBox}>
              <View style={styles.slotRow}>
                {curQ.word.split('').map((_, idx) => (
                  <View key={idx} style={styles.slot}>
                    <Text style={styles.slotText}>
                      {slots[idx] ? slots[idx].toUpperCase() : ''}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.tilesRow}>
                {letters.map((l, idx) => (
                  <LetterTile
                    key={idx}
                    letter={l}
                    size={48}
                    disabled={used.includes(idx)}
                    onPress={() => tapLetter(l, idx)}
                  />
                ))}
              </View>

              <Pressable
                onPress={() => {
                  setSlots([]);
                  setUsed([]);
                }}
                style={styles.clearBtn}
              >
                <Text style={styles.clearBtnText}>Clear ↺</Text>
              </Pressable>
            </View>
          )}

          {/* Audio & Hint Button */}
          <View style={styles.toolRow}>
            <Pressable
              onPress={() => speak(curQ.clue)}
              style={styles.soundButton}
            >
              <Text style={styles.soundButtonText}>🔊 Hear Clue</Text>
            </Pressable>
            <Pressable
              onPress={() => speak(`Hint: ${curQ.hint}`)}
              style={styles.hintButton}
            >
              <Text style={styles.hintButtonText}>💡 Hint</Text>
            </Pressable>
          </View>

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
          {lockOpen ? (
            <View style={styles.lockOpenBanner}>
              <Text style={{ fontSize: 24 }}>🔓</Text>
              <Text style={styles.lockOpenBannerText}>LOCK SHATTERED!</Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={() => router.replace('/map')}
          style={styles.quitMapLink}
        >
          <Text style={styles.quitMapLinkText}>Quit quest ✕</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 8,
    marginBottom: 6,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lockNumberBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  lockNumberText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#B45309',
  },
  levelBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  levelBadgeText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#4F46E5',
  },
  stageTitle: {
    fontSize: 17,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
  },
  phaseStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 4,
  },
  phaseStepItem: {
    alignItems: 'center',
  },
  phaseDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  phaseDotDone: {
    backgroundColor: '#22C55E',
  },
  phaseDotActive: {
    backgroundColor: '#F59E0B',
    transform: [{ scale: 1.1 }],
  },
  phaseDotText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  phaseLabel: {
    fontSize: 10,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  phaseLabelActive: {
    color: '#B45309',
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },

  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 8,
    marginBottom: 6,
    gap: 8,
  },
  characterAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogueBox: {
    flex: 1,
  },
  characterName: {
    fontSize: 12,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#1E40AF',
  },
  storyText: {
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#1E3A8A',
    lineHeight: 14,
    marginTop: 1,
  },

  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  challengePhaseTag: {
    fontSize: 10,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#EA580C',
    textAlign: 'center',
    marginBottom: 2,
  },
  challengePromptBox: {
    width: '100%',
    marginBottom: 6,
  },
  challengePrompt: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  clueBox: {
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    padding: 6,
    width: '100%',
    marginBottom: 8,
  },
  clueText: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#92400E',
    marginTop: 2,
    textAlign: 'center',
  },
  quitMapLink: {
    alignSelf: 'center',
    paddingVertical: 4,
    marginTop: 2,
  },
  quitMapLinkText: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
  },

  choicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  choiceButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderBottomWidth: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  choiceButtonPicked: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  choiceButtonText: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },

  spellBox: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  slotRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 14,
  },
  slot: {
    width: 48,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8B5CF6',
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    fontSize: 26,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  clearBtnText: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },

  toolRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  soundButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  soundButtonText: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.ink,
  },
  hintButton: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hintButtonText: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#B45309',
  },

  feedback: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#059669',
    marginTop: 10,
    textAlign: 'center',
  },
  lockOpenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  lockOpenBannerText: {
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#15803D',
  },

  /* Victory Card */
  victoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#F59E0B',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  unlockedIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FEF3C7',
    borderWidth: 3,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  victoryTitle: {
    fontSize: 26,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  victorySubtitle: {
    fontSize: 15,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  victoryStarsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  victoryStar: {
    fontSize: 40,
  },
  victoryStarsLabel: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 16,
  },
  rewardBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    width: '100%',
    marginBottom: 20,
  },
  rewardBadgeTitle: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  rewardBadgeDesc: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  victoryActions: {
    width: '100%',
  },
});
