import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from './AppIcon';

const TABS = [
  { label: 'Home', icon: 'home', route: '/', activeColor: '#4F46E5', activeBg: '#EEF2FF' },
  { label: 'Stories', icon: 'stories', route: '/stories', activeColor: '#7C3AED', activeBg: '#F3E8FF' },
  { label: 'Rewards', icon: 'rewards', route: '/rewards', activeColor: '#D97706', activeBg: '#FEF3C7' },
  { label: 'Grown-ups', icon: 'parent', route: '/parent', activeColor: '#334155', activeBg: '#F1F5F9' },
];

export default function BottomTabs() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.dock}>
        {TABS.map((t) => {
          const active = path === t.route || (t.route === '/' && path === '/index');
          return (
            <Pressable
              key={t.label}
              onPress={() => router.push(t.route as never)}
              style={({ pressed }) => [
                styles.tab,
                active && styles.tabActive,
                pressed && styles.tabPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <View style={[styles.iconWrap, active && { backgroundColor: t.activeBg }]}>
                <TabIcon id={t.icon} active={active} size={20} />
              </View>
              <Text
                style={[
                  styles.label,
                  active
                    ? [styles.labelActive, { color: t.activeColor }]
                    : null,
                ]}
                numberOfLines={1}
              >
                {t.label}
              </Text>
              {active ? <View style={[styles.activeDot, { backgroundColor: t.activeColor }]} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
    backgroundColor: 'transparent',
  },
  dock: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#2B2A52',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 14,
  },
  tabActive: {
    transform: [{ scale: 1.02 }],
  },
  tabPressed: {
    transform: [{ scale: 0.95 }],
  },
  iconWrap: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
