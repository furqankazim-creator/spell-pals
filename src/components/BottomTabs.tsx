import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from './AppIcon';
import { colors } from '../theme/colors';

const TABS = [
  { label: 'Home', icon: 'home', route: '/', activeColor: '#1E293B' },
  { label: 'Stories', icon: 'stories', route: '/stories', activeColor: '#1E293B' },
  { label: 'Rewards', icon: 'rewards', route: '/rewards', activeColor: '#D97706' },
  { label: 'Grown-ups', icon: 'parent', route: '/parent', activeColor: '#1E293B' },
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
              <View style={styles.iconWrap}>
                <TabIcon id={t.icon} active={active} size={22} />
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
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#2B2A52',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  tabActive: {
    transform: [{ scale: 1.05 }],
  },
  tabPressed: {
    transform: [{ scale: 0.95 }],
  },
  iconWrap: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
});
