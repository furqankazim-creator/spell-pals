import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { GAMES } from '../src/data/extras';
import { colors } from '../src/theme/colors';
import { useLayout } from '../src/lib/useLayout';
import ScreenShell from '../src/components/ScreenShell';
import Grid from '../src/components/Grid';
import { IconTile } from '../src/components/AppIcon';

/** All games, with their icons (same cards as Home). */
export default function Route() {
  const router = useRouter();
  const { wide, cols } = useLayout();
  return (
    <ScreenShell>
      <Text style={styles.title}>All games</Text>
      <Grid cols={wide ? 3 : cols} gap={wide ? 16 : 12}>
        {GAMES.map((g) => (
          <Pressable key={g.id} onPress={() => router.push(g.route as never)} style={styles.card} accessibilityRole="button">
            <IconTile id={g.id} size={wide ? 72 : 64} />
            <View style={{ flex: 1 }}>
              <Text style={styles.t}>{g.title}</Text>
              <Text style={styles.d}>{g.desc}</Text>
            </View>
          </Pressable>
        ))}
      </Grid>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, marginBottom: 12 },
  card: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 28, padding: 16, minHeight: 84 },
  t: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  d: { fontSize: 14, color: colors.muted },
});
