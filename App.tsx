import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useStore } from './src/store/useStore';
import { setSoundOn } from './src/lib/audio';

// Entry point when run without expo-router (kept for parity); expo-router uses app/_layout.tsx.
export default function App() {
  const load = useStore((s) => s.load);
  const loaded = useStore((s) => s.loaded);
  const soundOn = useStore((s) => s.profile.soundOn);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSoundOn(soundOn); }, [soundOn]);
  if (!loaded) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  return null; // expo-router renders the app/ routes instead.
}
