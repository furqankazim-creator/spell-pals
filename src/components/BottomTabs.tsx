import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '../theme/colors';
import { TabIcon } from './AppIcon';

const TABS = [
  { label: 'Home', icon: 'home', route: '/' },
  { label: 'Stories', icon: 'stories', route: '/stories' },
  { label: 'Rewards', icon: 'rewards', route: '/rewards' },
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
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E6ECF5', paddingTop: 4, paddingBottom: 6 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 0, minHeight: 46, paddingVertical: 2 },
  icon: { fontSize: 22 },
  label: { fontSize: 11, lineHeight: 13, fontWeight: '700', color: colors.ink },
  active: { color: '#3B4BDB' },
});
