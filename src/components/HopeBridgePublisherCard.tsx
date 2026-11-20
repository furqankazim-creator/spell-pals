import { View, Text, StyleSheet, Pressable } from 'react-native';
import { HOPE_BRIDGE } from '../data/hopeBridge';

export default function HopeBridgePublisherCard({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 28 }}>✨</Text>
          </View>
          <View style={styles.titleCol}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{HOPE_BRIDGE.publisher}</Text>
              <Text style={styles.publisherLabel}>Publisher</Text>
            </View>
            <Text style={styles.tagline}>Calm, Family-First Apps for Autism, Speech & Attention Needs</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Makers of Angel Artic, Angel Talk, Bloom Learn, Bloom Focus & Nexia Bridge. Calm, family-first apps for autism, speech, and attention needs.
        </Text>

        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Explore Our Apps & Mission ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFF7E6',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FBE7A4',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FBE7A4',
  },
  titleCol: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    color: '#242331',
  },
  publisherLabel: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    color: '#B85A2E',
    marginLeft: 6,
  },
  tagline: {
    fontSize: 13,
    fontFamily: 'Baloo2_600SemiBold',
    color: '#E05344',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Baloo2_500Medium',
    color: '#3F3D56',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6459',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
  },
});
