import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '../theme/colors';
import { useStore } from '../store/useStore';
import { TabIcon } from './AppIcon';
import Logo from './Logo';

const LINKS = [
  { label: 'Home', icon: 'home', route: '/' },
  { label: 'Stories', icon: 'stories', route: '/stories' },
  { label: 'Rewards', icon: 'rewards', route: '/rewards' },
  { label: 'Grown-ups', icon: 'parent', route: '/parent' },
];

/** Desktop header: logo on the left, menu on the right (replaces the bottom tabs on wide screens). */
export default function TopNav({ links = true }: { links?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const onboarded = useStore((s) => s.profile.onboarded);
  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Pressable onPress={() => router.push('/' as never)} accessibilityRole="button" accessibilityLabel="Home">
          <Logo width={130} />
        </Pressable>
        {links ? (
          <View style={styles.links}>
            {LINKS.map((l) => {
              const active = path === l.route || (l.route === '/' && path === '/index');
              return (
                <Pressable key={l.label} onPress={() => router.push(l.route as never)} style={[styles.link, active ? styles.linkOn : null]} accessibilityRole="button">
                  <TabIcon id={l.icon} active />
                  <Text style={[styles.label, active ? styles.labelOn : null]}>{l.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : !onboarded ? null : (
          <Pressable onPress={() => router.replace('/' as never)} style={[styles.link, styles.linkOn]} accessibilityRole="button">
            <Text style={styles.labelOn}>← Home</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E6ECF5', alignItems: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3, zIndex: 5 },
  inner: { width: '100%', maxWidth: 1100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 4 },
  links: { flexDirection: 'row', gap: 6 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  linkOn: { backgroundColor: '#FFF1C2' },
  label: { fontSize: 16, color: colors.ink },
  labelOn: { fontSize: 16, color: colors.ink, fontFamily: 'Baloo2_800ExtraBold' },
});
