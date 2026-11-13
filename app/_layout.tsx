import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold } from '@expo-google-fonts/comic-neue';
import { Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { useStore } from '../src/store/useStore';
import { setSoundOn } from '../src/lib/audio';
import { colors } from '../src/theme/colors';

// Body text uses Comic Neue Bold; big headings use Baloo 2 (set per style). Patch Text/TextInput once so every
// <Text> gets the body font unless its own style sets a fontFamily (works on web and phones).
const patch = (C: unknown, family: string) => {
  const comp = C as { render?: (p: { style?: unknown }, r: unknown) => unknown };
  const orig = comp.render;
  if (!orig) return;
  comp.render = function (props, ref) { return orig.call(this, { ...props, style: [{ fontFamily: family }, props.style] }, ref); };
};
patch(Text, 'ComicNeue_700Bold');
patch(TextInput, 'ComicNeue_400Regular');

/** Friendly screen if something unexpected goes wrong (instead of a blank page). */
export function ErrorBoundary({ retry }: { error: Error; retry: () => Promise<void> }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: colors.skyBottom }}>
      <Text style={{ fontSize: 64 }}>🙈</Text>
      <Text style={{ fontSize: 26, color: colors.ink, textAlign: 'center', marginVertical: 10 }}>Oops! Something went wrong.</Text>
      <Text style={{ fontSize: 16, color: colors.ink, textAlign: 'center', marginBottom: 20 }}>Do not worry, your stars and stickers are safe.</Text>
      <Pressable onPress={retry} style={{ backgroundColor: '#FFC93C', borderRadius: 20, paddingHorizontal: 28, paddingVertical: 14, borderBottomWidth: 5, borderBottomColor: '#D1A531' }} accessibilityRole="button">
        <Text style={{ fontSize: 20, color: colors.ink }}>Try again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ComicNeue_400Regular, ComicNeue_700Bold, Baloo2_800ExtraBold });
  const load = useStore((s) => s.load);
  const soundOn = useStore((s) => s.profile.soundOn);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSoundOn(soundOn); }, [soundOn]);
  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.outer}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.skyBottom } }} />
      </View>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: colors.skyBottom },
});
