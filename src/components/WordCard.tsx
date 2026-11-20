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
  const imgSize = compact ? 135 : big ? 190 : 150;
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
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 12, alignItems: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  cardCompact: { padding: 8, borderRadius: 22 },
  big: { paddingVertical: 20 },
  picRing: { backgroundColor: '#F8FAFC', borderRadius: 22, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#EDF2F7' },
  picRingCompact: { padding: 6, borderRadius: 18 },
  picRingBig: { padding: 14, borderRadius: 28 },
  word: { fontSize: 26, fontFamily: 'Baloo2_800ExtraBold', letterSpacing: 3, color: colors.ink, marginTop: 6 },
  wordCompact: { fontSize: 22, letterSpacing: 3, marginTop: 4 },
});
