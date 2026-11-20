import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import { useStore } from '../src/store/useStore';
import { setSoundOn } from '../src/lib/audio';
import { colors } from '../src/theme/colors';

// Inject the Spell Pals logo font (Baloo 2) across the entire website with bold/heavy weight
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const fontStyleId = 'spell-pals-web-typography';
  if (!document.getElementById(fontStyleId)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = fontStyleId;
    style.innerHTML = `
      * {
        font-family: 'Baloo 2', 'Baloo2_700Bold', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-weight: 700;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      h1, h2, h3, h4, h5, h6, strong, b,
      [class*="title"], [class*="Title"],
      [class*="name"], [class*="Name"],
      [class*="btn"], [class*="Btn"],
      [class*="badge"], [class*="Badge"],
      [class*="button"], [class*="Button"],
      [class*="ExtraBold"], [class*="extraBold"] {
        font-weight: 800 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Global default font for Text and TextInput: Baloo 2 with high font weight (Bold 700 / ExtraBold 800)
const patch = (C: unknown) => {
  const comp = C as { render?: (p: { style?: unknown }, r: unknown) => unknown };
  const orig = comp.render;
  if (!orig) return;
  comp.render = function (props, ref) {
    const flat = (StyleSheet.flatten(props.style as never) || {}) as Record<string, unknown>;
    const is800 =
      (flat.fontFamily && String(flat.fontFamily).includes('800')) ||
      flat.fontWeight === '800' ||
      flat.fontWeight === '900' ||
      flat.fontWeight === 'bold';
    const targetFamily = is800 ? 'Baloo2_800ExtraBold' : (flat.fontFamily || 'Baloo2_700Bold');
    const targetWeight = is800 ? '800' : (flat.fontWeight || '700');

    return orig.call(
      this,
      {
        ...props,
        style: [
          props.style,
          { fontFamily: targetFamily, fontWeight: targetWeight },
        ],
      },
      ref
    );
  };
};
patch(Text);
patch(TextInput);

/** Friendly screen if something unexpected goes wrong (instead of a blank page). */
export function ErrorBoundary({ retry }: { error: Error; retry: () => Promise<void> }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: colors.skyBottom }}>
      <Text style={{ fontSize: 64 }}>🙈</Text>
      <Text style={{ fontSize: 26, color: colors.ink, textAlign: 'center', marginVertical: 10, fontFamily: 'Baloo2_800ExtraBold' }}>Oops! Something went wrong.</Text>
      <Text style={{ fontSize: 16, color: colors.ink, textAlign: 'center', marginBottom: 20 }}>Do not worry, your stars and stickers are safe.</Text>
      <Pressable onPress={retry} style={{ backgroundColor: '#FFC93C', borderRadius: 20, paddingHorizontal: 28, paddingVertical: 14, borderBottomWidth: 5, borderBottomColor: '#D1A531' }} accessibilityRole="button">
        <Text style={{ fontSize: 20, color: colors.ink, fontFamily: 'Baloo2_800ExtraBold' }}>Try again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });
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
