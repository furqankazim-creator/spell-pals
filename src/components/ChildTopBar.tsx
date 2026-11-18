import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { useLayout } from '../lib/useLayout';
import Pic from './Pic';
import { colors } from '../theme/colors';

export default function ChildTopBar() {
  const router = useRouter();
  const { wide, width } = useLayout();
  const profile = useStore((s) => s.profile);
  const stickers = useStore((s) => s.stickers);

  if (wide) return null;

  const compact = width < 700;
  return (
    <View style={[styles.topRow, compact && styles.topRowCompact]}>
      <Pressable
        onPress={() => router.push('/setup')}
        style={[styles.profilePill, compact && styles.profilePillCompact]}
        accessibilityRole="button"
        accessibilityLabel="Open child profile"
      >
        <View style={styles.avatarWrap}><Pic emoji={profile.avatar} size={compact ? 28 : 34} /></View>
        <View style={styles.profileTextWrap}>
          <Text style={[styles.hello, compact && styles.helloCompact]} numberOfLines={1}>Hi, {profile.name}!</Text>
          <Text style={[styles.stickerText, compact && styles.stickerTextCompact]} numberOfLines={1}>★ {stickers.length} stickers collected</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => router.push('/map')}
        style={[styles.mapPill, compact && styles.mapPillCompact]}
        accessibilityRole="button"
        accessibilityLabel="Open Adventure Map"
      >
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={[styles.mapText, compact && styles.mapTextCompact]}>Map</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  topRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  profilePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 11,
    minHeight: 62,
  },
  profilePillCompact: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileTextWrap: { flex: 1 },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  hello: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, lineHeight: 24 },
  helloCompact: { fontSize: 18, lineHeight: 22 },
  stickerText: { fontSize: 14, color: colors.ink, fontWeight: '700' },
  stickerTextCompact: { fontSize: 12 },
  mapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 62,
    minWidth: 150,
  },
  mapPillCompact: { minWidth: 110, minHeight: 54, paddingHorizontal: 16, paddingVertical: 8 },
  mapIcon: { fontSize: 20, marginRight: 8 },
  mapText: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  mapTextCompact: { fontSize: 18 },
});
