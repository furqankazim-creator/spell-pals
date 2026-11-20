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

  const remove = () => setDigits((current) => current.slice(0, -1));

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.title}>Grown-ups only</Text>
      </View>
      <Text style={styles.sub}>Enter your 4-number PIN</Text>
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i < digits.length ? styles.dotOn : null]} />
        ))}
      </View>
      {wrong ? <Text style={styles.wrong}>That PIN did not match. Try again.</Text> : null}
      <View style={styles.pad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '⌫'].map((k) => (
          <Pressable
            key={k}
            disabled={k === ''}
            onPress={() => (k === '⌫' ? remove() : press(k))}
            style={[styles.key, k === '⌫' ? styles.keyBack : null]}
          >
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: 24 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lock: { fontSize: 28 },
  title: { fontSize: 32, fontFamily: 'Baloo2_800ExtraBold', color: colors.ink },
  sub: { fontSize: 18, color: colors.muted, marginTop: 10, marginBottom: 18 },
  dots: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff', borderWidth: 2, borderColor: colors.violet },
  dotOn: { backgroundColor: colors.violet },
  wrong: { color: colors.bad, fontWeight: '700', marginBottom: 10, fontSize: 14, textAlign: 'center' },
  pad: { width: 280, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  key: { width: 82, height: 64, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#5B8DB8', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  keyBack: { backgroundColor: '#F7F7FF' },
  keyText: { fontSize: 32, fontWeight: '800', color: colors.ink },
});
