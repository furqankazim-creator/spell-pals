import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

const EMOJI: Record<string, string> = { 'volume-high': '🔊', pencil: '✏️' };
function shade(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.82));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

/** Chunky 3D-style button (as in the reference design). */
export default function BigButton({ label, onPress, color = colors.amber, emoji, icon }: { label: string; onPress: () => void; color?: string; emoji?: string; icon?: string }) {
  const e = emoji ?? (icon ? EMOJI[icon] : undefined);
  const white = color === colors.sky || color === colors.coral;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, { backgroundColor: color, borderBottomColor: shade(color), transform: [{ translateY: pressed ? 2 : 0 }], borderBottomWidth: pressed ? 3 : 5 }]}
      accessibilityRole="button"
    >
      {e ? <Text style={styles.emoji}>{e}</Text> : null}
      <Text style={[styles.label, white ? { color: '#fff' } : null]}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  btn: { minHeight: 56, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10 },
  label: { fontSize: 19, fontFamily: 'Baloo2_800ExtraBold', color: colors.ink },
  emoji: { fontSize: 20 },
});
