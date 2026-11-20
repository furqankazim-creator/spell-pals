import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

/** Letter button. `wide` makes it a word button (for Rhyme Time). */
export default function LetterTile({
  letter,
  onPress,
  disabled,
  filled,
  wide,
  size = 64,
}: {
  letter: string;
  onPress?: () => void;
  disabled?: boolean;
  filled?: boolean;
  wide?: boolean;
  size?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.tile,
        wide ? styles.wide : { width: size, height: size },
        filled ? styles.filled : null,
        disabled ? styles.dim : null,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.letter, wide ? styles.wideText : { fontSize: size * 0.5 }]}>
        {wide ? letter : letter.toUpperCase()}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  tile: {
    borderRadius: 18,
    backgroundColor: '#FFC93C',
    borderWidth: 0,
    borderBottomWidth: 4,
    borderBottomColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    shadowColor: '#B45309',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  wide: { minWidth: 120, height: 58, paddingHorizontal: 16 },
  filled: { backgroundColor: colors.green, borderBottomColor: '#15803D' },
  dim: { opacity: 0.35 },
  letter: { fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: colors.ink },
  wideText: { fontSize: 24 },
});
