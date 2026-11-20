import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
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

  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const active = path === t.route || (t.route === '/' && path === '/index');
        return (
          <Pressable
            key={t.label}
            onPress={() => router.push(t.route as never)}
            style={[
              styles.tab,
              active && { backgroundColor: t.activeBg, borderColor: t.activeColor + '30', borderWidth: 1.5 },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <View style={styles.iconWrap}>
              <TabIcon id={t.icon} active={active} size={18} />
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
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 5,
    paddingBottom: 6,
    paddingHorizontal: 12,
    shadowColor: '#1E1B4B',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: 36,
  },
  iconWrap: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    lineHeight: 13,
    marginTop: 0,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
});
