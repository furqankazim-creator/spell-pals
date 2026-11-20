import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PRAISE } from '../data/extras';
import { colors } from '../theme/colors';
import BigButton from './BigButton';
import Pic from './Pic';
import { cheerWin } from '../lib/audio';

/** End-of-game celebration: praise + a sticker. No confetti, no animation. */
export default function Celebration({
  stickerEmoji,
  stickerLabel,
  onDone,
  onAgain,
  doneLabel = 'Back to Home',
  stars,
  rewardsOn = true,
  level,
  levelName,
  levelEmoji,
  totalRounds,
  xpEarned,
}: {
  stickerEmoji: string;
  stickerLabel: string;
  onDone: () => void;
  onAgain: () => void;
  doneLabel?: string;
  stars?: number;
  rewardsOn?: boolean;
  level?: number;
  levelName?: string;
  levelEmoji?: string;
  totalRounds?: number;
  xpEarned?: number;
}) {
  const router = useRouter();
  const praise = useMemo(() => PRAISE[Math.floor(Math.random() * PRAISE.length)], []);
  useEffect(() => {
    cheerWin(rewardsOn ? `${praise} You earned a sticker: ${stickerLabel}!` : `${praise} Great work!`);
  }, [praise, stickerLabel, rewardsOn]);

  return (
    <View style={styles.wrap}>
      {rewardsOn ? <Pic emoji={stickerEmoji} size={180} /> : null}
      <Text style={styles.praise}>{praise}</Text>

      {stars ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={{ opacity: n <= stars ? 1 : 0.25 }}>
              <Pic emoji="⭐" size={64} />
            </View>
          ))}
        </View>
      ) : null}

      {level ? (
        <View style={styles.levelBadge}>
          <Text style={styles.levelEmoji}>{levelEmoji || '🌱'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.levelTitle}>Level {level}: {levelName}</Text>
            <Text style={styles.levelSub}>{totalRounds || 6} of {totalRounds || 6} Rounds Cleared · +{xpEarned || 75} Star XP</Text>
          </View>
        </View>
      ) : null}

      {rewardsOn ? <Text style={styles.sub}>You earned a sticker: {stickerLabel}</Text> : null}
      <BigButton label="Play again" onPress={onAgain} color={colors.violet} />
      <View style={{ height: 10 }} />
      {rewardsOn ? (
        <>
          <BigButton label="🎁 See My Reward Box" onPress={() => router.push('/rewards')} color={colors.amber} />
          <View style={{ height: 10 }} />
        </>
      ) : null}
      <BigButton label={doneLabel} onPress={onDone} color={colors.teal} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12, paddingVertical: 24 },
  emoji: { fontSize: 90 },
  praise: { fontSize: 30, fontFamily: 'Baloo2_800ExtraBold', color: colors.ink },
  sub: { fontSize: 17, color: colors.muted, marginBottom: 12 },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    width: '90%',
    maxWidth: 420,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginVertical: 4,
  },
  levelEmoji: {
    fontSize: 32,
  },
  levelTitle: {
    fontSize: 17,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
  },
  levelSub: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '800',
    marginTop: 2,
  },
});
