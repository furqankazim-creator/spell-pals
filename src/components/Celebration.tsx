import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PRAISE } from '../data/extras';
import { colors } from '../theme/colors';
import BigButton from './BigButton';
import Pic from './Pic';
import { cheerWin } from '../lib/audio';

/** End-of-game celebration: praise + a sticker. No confetti, no animation. */
export default function Celebration({ stickerEmoji, stickerLabel, onDone, onAgain, doneLabel = 'Back to Home', stars }: { stickerEmoji: string; stickerLabel: string; onDone: () => void; onAgain: () => void; doneLabel?: string; stars?: number }) {
  const praise = useMemo(() => PRAISE[Math.floor(Math.random() * PRAISE.length)], []);
  useEffect(() => { cheerWin(`${praise} You earned a sticker: ${stickerLabel}!`); }, [praise, stickerLabel]);
  return (
    <View style={styles.wrap}>
      <Pic emoji={stickerEmoji} size={150} />
      <Text style={styles.praise}>{praise}</Text>
      {stars ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3].map((n) => (<View key={n} style={{ opacity: n <= stars ? 1 : 0.25 }}><Pic emoji="⭐" size={64} /></View>))}
        </View>
      ) : null}
      <Text style={styles.sub}>You earned a sticker: {stickerLabel}</Text>
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
