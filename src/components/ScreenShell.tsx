import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';
import { useLayout } from '../lib/useLayout';
import BottomTabs from './BottomTabs';
import TopNav from './TopNav';
import HopeBridgeTicker from './HopeBridgeTicker';

/**
 * Light, still sky background. Phones: content + bottom tabs. Wide screens (web/tablet): top menu bar and
 * a centred, wider content area. `max` limits the content width for form/game screens.
 */
export default function ScreenShell({ children, tabs = true, max, backLabel, onBack }: { children: React.ReactNode; tabs?: boolean; max?: number; backLabel?: string; onBack?: () => void }) {
  const bedtime = useStore((s) => s.profile.bedtimeMode);
  const { wide, width } = useLayout();
  const limit = max ?? (wide ? 1100 : width < 440 ? 420 : 680);
  const mobilePad = width < 420 ? 10 : 16;
  return (
    <LinearGradient colors={bedtime ? [colors.nightTop, colors.nightBottom] : [colors.skyTop, colors.skyBottom]} style={styles.safe}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {tabs ? <HopeBridgeTicker /> : null}
        {wide ? <TopNav links={tabs} /> : null}
        {onBack ? (
          <View style={styles.backWrap}>
            <Pressable onPress={onBack} style={styles.backBtn} accessibilityRole="button">
              <Text style={styles.backText}>{!backLabel || backLabel === '‹' || backLabel === '<' ? '← Back' : backLabel}</Text>
            </Pressable>
          </View>
        ) : null}
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.inner, { maxWidth: limit, paddingHorizontal: wide ? 24 : mobilePad, paddingTop: wide ? 24 : 10 }]}>{children}</View>
        </ScrollView>
        {tabs && !wide && width < 900 ? <BottomTabs /> : null}
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center' },
  inner: { width: '100%', flex: 1, paddingBottom: 32 },
  backWrap: { paddingHorizontal: 16, paddingTop: 10, alignItems: 'flex-start' },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.12)',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  backText: { fontSize: 14, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: colors.ink },
});
