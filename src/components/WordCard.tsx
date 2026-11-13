import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Word } from '../data/words';
import Pic from './Pic';

/** Large picture card for the word. `hideWord` keeps the spelling secret in spelling games. */
export default function WordCard({ word, big, hideWord }: { word: Word; big?: boolean; hideWord?: boolean }) {
  return (
    <View style={[styles.card, big ? styles.big : null]}>
      <Pic emoji={word.emoji} size={big ? 190 : 160} />
      {hideWord ? null : <Text style={styles.word}>{word.word.toUpperCase()}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 32, padding: 18, alignItems: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  big: { paddingVertical: 28 },
  word: { fontSize: 34, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', letterSpacing: 4, color: colors.ink, marginTop: 8 },
});
