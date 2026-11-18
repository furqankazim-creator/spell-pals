import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PRAISE } from '../data/extras';
import { colors } from '../theme/colors';
import BigButton from './BigButton';
import Pic from './Pic';
import { cheerWin } from '../lib/audio';

/** End-of-game celebration: praise + a sticker. No confetti, no animation. */
export default function Celebration({ stickerEmoji, stickerLabel, onDone, onAgain, doneLabel = 'Back to Home', stars, rewardsOn = true }: { stickerEmoji: string; stickerLabel: string; onDone: () => void; onAgain: () => void; doneLabel?: string; stars?: number; rewardsOn?: boolean }) {
  const praise = useMemo(() => PRAISE[Math.floor(Math.random() * PRAISE.length)], []);
  useEffect(() => { cheerWin(rewardsOn ? `${praise} You earned a sticker: ${stickerLabel}!` : `${praise} Great work!`); }, [praise, stickerLabel, rewardsOn]);
  return (
    <View style={styles.wrap}>
      {rewardsOn ? <Pic emoji={stickerEmoji} size={150} /> : null}
      <Text style={styles.praise}>{praise}</Text>
      {stars ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3].map((n) => (<View key={n} style={{ opacity: n <= stars ? 1 : 0.25 }}><Pic emoji="⭐" size={64} /></View>))}
        </View>
      ) : null}
      {rewardsOn ? <Text style={styles.sub}>You earned a sticker: {stickerLabel}</Text> : null}
      <BigButton label="Play again" onPress={onAgain} color={colors.violet} />
      <View style={{ height: 12 }} />
      <BigButton label={doneLabel} onPress={onDone} color={colors.teal} />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  emoji: { fontSize: 90 },
  praise: { fontSize: 30, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sub: { fontSize: 17, color: colors.muted, marginBottom: 12 },
});
