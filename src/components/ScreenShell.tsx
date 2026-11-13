import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';
import { useLayout } from '../lib/useLayout';
import BottomTabs from './BottomTabs';
import TopNav from './TopNav';

/**
 * Light, still sky background. Phones: content + bottom tabs. Wide screens (web/tablet): top menu bar and
 * a centred, wider content area. `max` limits the content width for form/game screens.
 */
export default function ScreenShell({ children, tabs = true, max }: { children: React.ReactNode; tabs?: boolean; max?: number }) {
  const bedtime = useStore((s) => s.profile.bedtimeMode);
  const { wide, width } = useLayout();
  const limit = max ?? (wide ? 1100 : 680);
  return (
    <LinearGradient colors={bedtime ? [colors.nightTop, colors.nightBottom] : [colors.skyTop, colors.skyBottom]} style={styles.safe}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {wide ? <TopNav links={tabs} /> : null}
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.inner, { maxWidth: limit, paddingHorizontal: wide ? 24 : 16, paddingTop: wide ? 24 : 12 }]}>{children}</View>
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
});
