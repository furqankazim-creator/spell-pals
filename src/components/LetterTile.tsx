import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

/** Letter button. `wide` makes it a word button (for Rhyme Time). */
export default function LetterTile({ letter, onPress, disabled, filled, wide, size = 64 }: { letter: string; onPress?: () => void; disabled?: boolean; filled?: boolean; wide?: boolean; size?: number }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.tile, wide ? styles.wide : { width: size, height: size }, filled ? styles.filled : null, disabled ? styles.dim : null]}
      accessibilityRole="button"
    >
      <Text style={[styles.letter, wide ? styles.wideText : { fontSize: size * 0.5 }]}>{wide ? letter : letter.toUpperCase()}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  tile: { borderRadius: 20, backgroundColor: '#FFC93C', borderBottomWidth: 5, borderBottomColor: '#E0A820', alignItems: 'center', justifyContent: 'center', margin: 4 },
  wide: { minWidth: 130, height: 64, paddingHorizontal: 18 },
  filled: { backgroundColor: colors.green, borderBottomColor: '#6CC590' },
  dim: { opacity: 0.35 },
  letter: { fontWeight: '900', color: colors.ink },
  wideText: { fontSize: 26 },
});
