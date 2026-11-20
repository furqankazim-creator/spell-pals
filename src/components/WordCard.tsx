import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Word } from '../data/words';
import Pic from './Pic';

/** Large picture card for the word. `hideWord` keeps the spelling secret in spelling games. */
export default function WordCard({ word, big, hideWord }: { word: Word; big?: boolean; hideWord?: boolean }) {
  return (
    <View style={[styles.card, big ? styles.big : null]}>
      <View style={[styles.picRing, big ? styles.picRingBig : null]}>
        <Pic emoji={word.emoji} imageUri={word.imageUri} size={big ? 210 : 180} />
      </View>
      {hideWord ? null : <Text style={styles.word}>{word.word.toUpperCase()}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 32, padding: 20, alignItems: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  big: { paddingVertical: 28 },
  picRing: { backgroundColor: '#F8FAFC', borderRadius: 28, padding: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#EDF2F7' },
  picRingBig: { padding: 16, borderRadius: 32 },
  word: { fontSize: 34, fontFamily: 'Baloo2_800ExtraBold', letterSpacing: 4, color: colors.ink, marginTop: 12 },
});
