import { StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store/useStore';
import { STICKERS } from '../data/extras';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import Pic from '../components/Pic';
import Grid from '../components/Grid';
import { useLayout } from '../lib/useLayout';
import ChildTopBar from '../components/ChildTopBar';
import { useRouter } from 'expo-router';

export default function RewardsScreen() {
  const stored = useStore((s) => s.stickers);
  const earned = stored.filter((id) => STICKERS.some((s) => s.id === id));
  const { wide } = useLayout();
  const router = useRouter();

  return (
    <ScreenShell onBack={() => router.replace('/')} backLabel="← Back">
      <ChildTopBar />
      <Text style={styles.title}>🎁 My Reward Box</Text>
      <Text style={styles.sub}>{earned.length} of {STICKERS.length} stickers collected</Text>
      <Grid cols={wide ? 6 : 3} gap={wide ? 16 : 10}>
        {STICKERS.map((s) => {
          const got = earned.includes(s.id);
          return (
            <View key={s.id} style={[styles.cell, !got ? styles.locked : null]}>
              <View style={!got ? { opacity: 0.35 } : undefined}><Pic emoji={got ? s.emoji : '🔒'} size={76} /></View>
              <Text style={styles.label}>{got ? s.label : '???'}</Text>
            </View>
          );
        })}
      </Grid>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sub: { fontSize: 15, color: colors.muted, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '100%', backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: colors.ring, padding: 14, alignItems: 'center' },
  locked: { opacity: 0.55 },
  emoji: { fontSize: 44 },
  label: { fontSize: 13, fontWeight: '800', color: colors.ink, textAlign: 'center', marginTop: 6 },
});
