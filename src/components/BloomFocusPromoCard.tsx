import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function BloomFocusPromoCard({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Focus & Therapy Games 🎯</Text>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 28 }}>🌱</Text>
          </View>
          <View style={styles.titleCol}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Bloom Focus</Text>
              <Text style={{ fontSize: 16 }}>🌱</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ATTENTION</Text>
              </View>
            </View>
            <Text style={styles.tagline}>Therapy-guided attention games kids love.</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Bridge the clinic and home! 15 adaptive focus games with 40+ hero buddies, real-time sensory regulation, and clear clinical progress reports therapists and parents trust.
        </Text>

        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Meet Bloom Focus ›</Text>
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#242331',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F3F2FD',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6E3FD',
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
    borderColor: '#E8E5FA',
  },
  titleCol: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#5243C2',
  },
  badge: {
    backgroundColor: '#FFE5E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D84534',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E05344',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3F3D56',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#5C5BE5',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
