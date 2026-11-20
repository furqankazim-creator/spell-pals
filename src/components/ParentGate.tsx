import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store/useStore';
import { colors } from '../theme/colors';

const PAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

/** 4-digit PIN gate for the Grown-ups area. Default PIN 1234 (changeable in Parent settings). */
export default function ParentGate({ children }: { children: React.ReactNode }) {
  const pin = useStore((s) => s.profile.pin);
  const [digits, setDigits] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);
  if (unlocked) return <>{children}</>;

  const press = (d: string) => {
    const next = (digits + d).slice(0, 4);
    setDigits(next);
    setWrong(false);
    if (next.length === 4) {
      if (next === pin) setUnlocked(true);
      else {
        setWrong(true);
        setDigits('');
      }
    }
  };

  const remove = () => setDigits((current) => current.slice(0, -1));

  return (
    <View style={styles.wrap}>
      <View style={styles.lockBadge}>
        <Text style={styles.lockIcon}>🔒</Text>
      </View>
      <Text style={styles.title}>Grown-ups Only</Text>
      <Text style={styles.sub}>Enter your 4-number PIN to continue</Text>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => {
          const filled = i < digits.length;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                filled && styles.dotFilled,
                wrong && styles.dotWrong,
              ]}
            />
          );
        })}
      </View>

      {wrong ? (
        <View style={styles.wrongPill}>
          <Text style={styles.wrong}>That PIN did not match. Please try again.</Text>
        </View>
      ) : (
        <View style={{ height: 26 }} />
      )}

      <View style={styles.pad}>
        {PAD_KEYS.map((k, idx) => {
          if (k === '') {
            return <View key={`empty-${idx}`} style={styles.emptyKey} />;
          }
          const isBack = k === '⌫';
          return (
            <Pressable
              key={k}
              onPress={() => (isBack ? remove() : press(k))}
              style={({ pressed }) => [
                styles.key,
                isBack && styles.keyBack,
                pressed && styles.keyPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isBack ? 'Backspace' : k}
            >
              <Text style={[styles.keyText, isBack && styles.keyBackText]}>{k}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  lockBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  lockIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  sub: {
    fontSize: 15,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 4,
    marginBottom: 18,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#CBD5E1',
  },
  dotFilled: {
    backgroundColor: colors.violet,
    borderColor: colors.violet,
    transform: [{ scale: 1.15 }],
  },
  dotWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: colors.coral,
  },
  wrongPill: {
    height: 26,
    justifyContent: 'center',
  },
  wrong: {
    color: colors.coral,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  pad: {
    width: 288,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  key: {
    width: 86,
    height: 66,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  keyBack: {
    backgroundColor: '#F8FAFC',
    borderBottomColor: '#94A3B8',
  },
  keyPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  emptyKey: {
    width: 86,
    height: 66,
  },
  keyText: {
    fontSize: 30,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  keyBackText: {
    fontSize: 26,
    color: '#64748B',
  },
});
