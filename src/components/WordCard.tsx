import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Word } from '../data/words';
import Pic from './Pic';

/** Large picture card for the word. `hideWord` keeps the spelling secret in spelling games. */
export default function WordCard({
  word,
  big,
  hideWord,
  compact = true,
}: {
  word: Word;
  big?: boolean;
  hideWord?: boolean;
  compact?: boolean;
}) {
  const imgSize = compact ? 84 : big ? 160 : 108;
  return (
    <View style={[styles.card, compact ? styles.cardCompact : big ? styles.big : null]}>
      <View style={[styles.picRing, compact ? styles.picRingCompact : big ? styles.picRingBig : null]}>
        <Pic emoji={word.emoji} imageUri={word.imageUri} size={imgSize} />
      </View>
      {hideWord ? null : <Text style={[styles.word, compact && styles.wordCompact]}>{word.word.toUpperCase()}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 10, alignItems: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  cardCompact: { padding: 6, borderRadius: 20 },
  big: { paddingVertical: 20 },
  picRing: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#EDF2F7' },
  picRingCompact: { padding: 4, borderRadius: 16 },
  picRingBig: { padding: 14, borderRadius: 28 },
  word: { fontSize: 24, fontFamily: 'Baloo2_800ExtraBold', letterSpacing: 3, color: colors.ink, marginTop: 6 },
  wordCompact: { fontSize: 20, letterSpacing: 2, marginTop: 4 },
});
