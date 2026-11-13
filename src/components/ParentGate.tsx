import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

/** 4-digit PIN gate for the Grown-ups area. Default PIN 1234 (changeable in Parent settings). */
export default function ParentGate({ children }: { children: React.ReactNode }) {
  const pin = useStore((s) => s.profile.pin);
  const [digits, setDigits] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);
  if (unlocked) return <>{children}</>;
  const press = (d: string) => {
    const next = (digits + d).slice(0, 4);
    setDigits(next); setWrong(false);
    if (next.length === 4) {
      if (next === pin) setUnlocked(true);
      else { setWrong(true); setDigits(''); }
    }
  };
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>🔒 Grown-ups only</Text>
      <Text style={styles.sub}>Enter your 4-number PIN</Text>
      <View style={styles.dots}>{[0, 1, 2, 3].map((i) => (<View key={i} style={[styles.dot, i < digits.length ? styles.dotOn : null]} />))}</View>
      {wrong ? <Text style={styles.wrong}>That PIN did not match. Try again.</Text> : null}
      <View style={styles.pad}>
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k) => (
          <Pressable key={k || 'blank'} disabled={!k} onPress={() => (k === '⌫' ? setDigits(digits.slice(0, -1)) : press(k))} style={styles.key}>
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', paddingTop: 48, paddingHorizontal: 24 },
  title: { fontSize: 26, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sub: { fontSize: 16, color: colors.muted, marginTop: 8 },
  dots: { flexDirection: 'row', gap: 12, marginVertical: 24 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.violet },
  dotOn: { backgroundColor: colors.violet },
  wrong: { color: colors.bad, fontWeight: '700', marginBottom: 8 },
  pad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 320 },
  key: { width: 88, height: 64, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 26, fontWeight: '800', color: colors.ink },
});
