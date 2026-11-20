import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Word } from '../data/words';
import Pic from './Pic';

/** Large picture card for the word. `hideWord` keeps the spelling secret in spelling games. */
export default function WordCard({ word, big, hideWord }: { word: Word; big?: boolean; hideWord?: boolean }) {
  const ringSize = big ? 220 : 180;
  return (
    <View style={[styles.card, big ? styles.big : null]}>
      <View style={[styles.picRing, { width: ringSize, height: ringSize }]}>
        <Pic emoji={word.emoji} imageUri={word.imageUri} size={ringSize - 28} />
      </View>
      {hideWord ? null : <Text style={styles.word}>{word.word.toUpperCase()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  big: {
    paddingVertical: 26,
  },
  picRing: {
    backgroundColor: '#F8FAFC',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EDF2F7',
  },
  word: {
    fontSize: 34,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    letterSpacing: 4,
    color: colors.ink,
    marginTop: 12,
  },
});
