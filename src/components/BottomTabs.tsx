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
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((t) => {
        const active = path === t.route || (t.route === '/' && path === '/index');
        return (
          <Pressable
            key={t.label}
            onPress={() => router.push(t.route as never)}
            style={({ pressed }) => [
              styles.tab,
              pressed && { opacity: 0.8 },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <View style={[styles.iconWrap, active && { backgroundColor: t.activeBg }]}>
              <TabIcon id={t.icon} active={active} size={19} />
            </View>
            <Text
              style={[
                styles.label,
                active
                  ? { color: t.activeColor, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800' }
                  : null,
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 42, 82, 0.08)',
    paddingTop: 6,
    paddingHorizontal: 8,
    shadowColor: '#1E1B4B',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 12,
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
});
