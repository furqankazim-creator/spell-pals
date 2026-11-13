import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '../theme/colors';
import { TabIcon } from './AppIcon';

const TABS = [
  { label: 'Home', icon: 'home', route: '/' },
  { label: 'Stories', icon: 'stories', route: '/stories' },
  { label: 'Rewards', icon: 'rewards', route: '/rewards' },
  { label: 'Map', icon: 'map', route: '/map' },
  { label: 'Grown-ups', icon: 'parent', route: '/parent' },
];

export default function BottomTabs() {
  const router = useRouter();
  const path = usePathname();
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const active = path === t.route || (t.route === '/' && path === '/index');
        return (
          <Pressable key={t.label} onPress={() => router.push(t.route as never)} style={styles.tab} accessibilityRole="button">
            <TabIcon id={t.icon} active={active} />
            <Text style={[styles.label, active ? styles.active : null]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E6ECF5', paddingVertical: 6, paddingBottom: 18 },
  tab: { flex: 1, alignItems: 'center', gap: 2, minHeight: 56 },
  icon: { fontSize: 24 },
  label: { fontSize: 12, fontWeight: '700', color: colors.ink },
  active: { color: '#3B4BDB' },
});
