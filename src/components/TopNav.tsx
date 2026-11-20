import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useStore } from '../store/useStore';
import { TabIcon } from './AppIcon';
import Logo from './Logo';

const LINKS = [
  { label: 'Home', icon: 'home', route: '/', activeColor: '#1E293B', activeBg: '#F1F5F9' },
  { label: 'Stories', icon: 'stories', route: '/stories', activeColor: '#1E293B', activeBg: '#F1F5F9' },
  { label: 'Rewards', icon: 'rewards', route: '/rewards', activeColor: '#D97706', activeBg: '#FEF3C7' },
  { label: 'Grown-ups', icon: 'parent', route: '/parent', activeColor: '#1E293B', activeBg: '#F1F5F9' },
];

/** Desktop header: logo on the left, menu on the right with soft, polished pills. */
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
                <Pressable
                  key={l.label}
                  onPress={() => router.push(l.route as never)}
                  style={[
                    styles.link,
                    active
                      ? { backgroundColor: l.activeBg, borderColor: l.activeColor + '40' }
                      : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <TabIcon id={l.icon} active={active} size={19} />
                  <Text
                    style={[
                      styles.label,
                      active
                        ? { color: l.activeColor, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800' }
                        : null,
                    ]}
                  >
                    {l.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : !onboarded ? null : (
          <Pressable
            onPress={() => router.replace('/' as never)}
            style={[styles.link, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}
            accessibilityRole="button"
          >
            <Text style={[styles.label, { color: '#4F46E5', fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800' }]}>
              ← Home
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#1E1B4B',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    zIndex: 5,
  },
  inner: {
    width: '100%',
    maxWidth: 1100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  links: {
    flexDirection: 'row',
    gap: 8,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 15,
    color: '#475569',
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
  },
});
