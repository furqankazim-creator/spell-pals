import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenShell from '../components/ScreenShell';
import { HOPE_BRIDGE, openHopeBridgeEmail, openHopeBridgeWebsite } from '../data/hopeBridge';

export default function HopeBridgePromo() {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <ScreenShell max={820} onBack={goBack} backLabel="← Back">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Hope Bridge Digital</Text>
          </View>

          {/* Card 1 — About the Publisher */}
          <View style={[styles.card, styles.cardPurple]}>
            <View style={styles.publisherHeaderRow}>
              <View style={styles.publisherBadge}><Text style={styles.badgeText}>{HOPE_BRIDGE.star}</Text></View>
              <View style={styles.publisherInfo}>
                <Text style={styles.publisherLabel}>ABOUT THE PUBLISHER</Text>
                <Text style={styles.publisherName}>{HOPE_BRIDGE.publisher}</Text>
              </View>
            </View>
            <Text style={styles.publisherTitle}>{HOPE_BRIDGE.tagline}</Text>
            <Text style={styles.publisherDesc}>
              Developing calm, evidence-based, and family-first digital tools that empower autistic children and children with speech, language, and attention needs at home, school, and in therapy.
            </Text>

            <View style={styles.pillsRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>100% Private & Offline</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>SLP Guided</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>Zero Ads or Tracking</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>Bilingual (EN & AR)</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                style={({ pressed }) => [styles.buttonYellow, pressed && styles.btnPressed]}
                onPress={openHopeBridgeWebsite}
                accessibilityRole="button"
              >
                <Text style={styles.buttonYellowText}>🌐 Visit Official Portal</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.buttonWhite, pressed && styles.btnPressed]}
                onPress={openHopeBridgeEmail}
                accessibilityRole="button"
              >
                <Text style={styles.buttonWhiteText}>✉️ Contact Us</Text>
              </Pressable>
            </View>
          </View>

          {/* Card 2 — Closing invitation */}
          <View style={[styles.card, styles.cardCream]}>
            <View style={styles.inviteHeaderRow}>
              <View style={styles.inviteBadge}><Text style={styles.badgeText}>{HOPE_BRIDGE.star}</Text></View>
            </View>
            <Text style={styles.inviteTitle}>{HOPE_BRIDGE.closingTitle}</Text>
            <Text style={styles.inviteDesc}>
              Hope Bridge Digital creates compassionate, evidence-based assistive technology. Visit our live portal to discover new releases, clinical updates, and partnership opportunities.
            </Text>
            <View style={styles.inviteActions}>
              <Pressable
                style={({ pressed }) => [styles.buttonCoral, pressed && styles.btnPressed]}
                onPress={openHopeBridgeWebsite}
                accessibilityRole="button"
              >
                <Text style={styles.buttonCoralText}>🌐 Open hopebridgedigital.site</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.buttonOutline, pressed && styles.btnPressed]}
                onPress={openHopeBridgeEmail}
                accessibilityRole="button"
              >
                <Text style={styles.buttonOutlineText}>Contact Publisher ({HOPE_BRIDGE.email})</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: 'center' },
  inner: { width: '100%', flex: 1, paddingBottom: 32 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
  },
  backBtn: { paddingRight: 10 },
  backArrow: { fontSize: 26, color: '#1B1B1B', fontWeight: '400' },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#1B1B1B',
    marginLeft: 6,
  },

  card: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#2B2A52',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardPurple: {
    backgroundColor: '#5A52E0',
  },
  cardCream: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },

  publisherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  publisherBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8E5FA',
  },
  badgeText: {
    fontSize: 22,
    lineHeight: 26,
    color: '#5A52E0',
    textAlign: 'center',
    fontWeight: '900',
  },
  publisherInfo: { flex: 1 },
  publisherLabel: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#D5D1FC',
    letterSpacing: 0.5,
  },
  publisherName: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  publisherTitle: {
    fontSize: 21,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 27,
    marginBottom: 8,
  },
  publisherDesc: {
    fontSize: 14,
    fontFamily: 'Baloo2_600SemiBold',
    fontWeight: '600',
    lineHeight: 20,
    color: '#E4E0FD',
    marginBottom: 14,
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#242331',
  },

  actionsRow: { flexDirection: 'row', gap: 10 },
  buttonYellow: {
    flex: 1,
    backgroundColor: '#FDCB36',
    borderWidth: 0,
    borderBottomWidth: 4,
    borderBottomColor: '#D9A100',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B45309',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonYellowText: {
    color: '#27254A',
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  buttonWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonWhiteText: {
    color: '#5A52E0',
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },

  inviteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  inviteBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteTitle: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#242331',
    textAlign: 'center',
    marginBottom: 8,
  },
  inviteDesc: {
    fontSize: 13.5,
    fontFamily: 'Baloo2_600SemiBold',
    fontWeight: '600',
    lineHeight: 20,
    color: '#3F3D56',
    textAlign: 'center',
    marginBottom: 14,
  },
  inviteActions: { gap: 10 },
  buttonCoral: {
    backgroundColor: '#FF6459',
    borderWidth: 0,
    borderBottomWidth: 4,
    borderBottomColor: '#D9382B',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D9382B',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonCoralText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  buttonOutline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#5A52E0',
    borderBottomWidth: 4,
    borderBottomColor: '#4338CA',
    shadowColor: '#5A52E0',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonOutlineText: {
    color: '#5A52E0',
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1.5,
  },
});
