import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { wordOfTheDay } from '../lib/game';
import { speak, greet } from '../lib/audio';
import { useEffect } from 'react';
import { GAMES } from '../data/extras';
import { STORIES } from '../data/stories';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import BigButton from '../components/BigButton';
import { IconTile } from '../components/AppIcon';
import Pic from '../components/Pic';
import Logo from '../components/Logo';
import Grid from '../components/Grid';
import { useLayout } from '../lib/useLayout';
import { levelInfo } from '../data/levels';

/** Home — exactly as the client screenshot: Hi, Hadi! / Leo says… / Word of the Day / goal ring / 7 games / Reward Box / Learning Map. */
export default function HomeScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const stickers = useStore((s) => s.stickers);
  const minutes = useStore((s) => s.minutesToday);
  const { wide, cols } = useLayout();
  const loaded = useStore((s) => s.loaded);
  const wotd = wordOfTheDay(profile.level);
  const info = levelInfo(profile.level);
  const levelNotice = useStore((s) => s.levelNotice);
  const clearLevelNotice = useStore((s) => s.clearLevelNotice);
  useEffect(() => { if (levelNotice) { speak(levelNotice, { delay: 1500 }); } }, [levelNotice]);
  useEffect(() => { if (loaded && profile.onboarded) greet(profile.name); }, [loaded, profile.onboarded, profile.name]);
  const goalPct = Math.min(100, Math.round((minutes / profile.dailyGoal) * 100));
  if (loaded && !profile.onboarded) return <Redirect href="/setup" />;
  return (
    <ScreenShell>
      {wide ? null : <Logo width={230} />}
      <Text style={styles.brandSub}>Leo 🦁 &amp; Bella 🐰 — ages 4-9 · offline</Text>
      <View style={[styles.row, wide ? { justifyContent: 'space-between' } : null]}>
        <Pressable onPress={() => router.push('/setup')} style={[styles.pill, wide ? { minWidth: 300 } : styles.flex]} accessibilityRole="button" accessibilityLabel="Change name and age">
          <Pic emoji={profile.avatar} size={44} />
          <View>
            <Text style={styles.hi}>Hi, {profile.name}!</Text>
            <Text style={styles.pillSub}>⭐ {stickers.length} stickers collected</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => router.push('/parent')} style={styles.pill} accessibilityRole="button">
          <Text>🔒</Text><Text style={styles.grown}>Grown-ups</Text>
        </Pressable>
      </View>

      <View style={wide ? styles.twoCol : undefined}>
      <Pressable onPress={clearLevelNotice} style={[styles.levelCard, wide ? styles.colItem : null]} accessibilityRole="button">
        <Text style={styles.levelEmoji}>{info.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.levelTitle}>Level {profile.level} · {info.name}</Text>
          <Text style={styles.levelSub}>{levelNotice ?? info.desc}</Text>
        </View>
      </Pressable>

      <View style={[styles.leoCard, wide ? styles.colItem : null]}>
        <Text style={styles.leo}>Leo says: &ldquo;Let&rsquo;s spell some words!&rdquo;</Text>
        <Text style={styles.leoSub}>Pick a game below — every game ends with a sticker.</Text>
      </View>
      </View>

      <View style={wide ? styles.twoCol : undefined}>
        <View style={[styles.card, wide ? { flex: 2 } : null]}>
          <Text style={styles.kicker}>⭐ WORD OF THE DAY</Text>
          <View style={{ alignItems: 'center', marginVertical: 6 }}><Pic emoji={wotd.emoji} size={150} /></View>
          <Text style={styles.wotd}>{wotd.word}</Text>
          <View style={styles.btnRow}>
            <BigButton label="Hear it" icon="volume-high" onPress={() => speak(wotd.word)} color={colors.violet} />
            <BigButton label="Spell it!" icon="pencil" onPress={() => router.push({ pathname: '/spell', params: { word: wotd.word } } as never)} color={colors.amber} />
          </View>
        </View>
        <View style={[styles.card, wide ? { flex: 1, justifyContent: 'center' } : null]}>
          <Text style={styles.ring}>{minutes}m</Text>
          <Text style={styles.goalTitle}>Today&rsquo;s goal</Text>
          <Text style={styles.sub}>{minutes} of {profile.dailyGoal} minutes played</Text>
          <View style={styles.bar}><View style={[styles.barFill, { width: `${goalPct}%` }]} /></View>
        </View>
      </View>

      <Grid cols={cols} gap={wide ? 16 : 12}>
        {[
          ...GAMES.map((g) => ({ key: g.id, icon: g.id, title: g.title, desc: g.desc, route: g.route })),
          { key: 'rewards', icon: 'rewards', title: 'My Reward Box', desc: `${stickers.length} stickers inside`, route: '/rewards' },
          { key: 'map', icon: 'map', title: 'My Learning Map', desc: 'See the islands you’ve mastered', route: '/map' },
          { key: 'stories', icon: 'stories', title: 'Story Time', desc: `${STORIES.length} stories for every level — read, listen and answer`, route: '/stories' },
        ].map((g) => (
          <Pressable key={g.key} onPress={() => router.push(g.route as never)} style={[styles.gameCard, { marginBottom: 0, flex: 1 }]} accessibilityRole="button">
            <IconTile id={g.icon} size={wide ? 72 : 64} />
            <View style={{ flex: 1 }}>
              <Text style={styles.gameTitle}>{g.title}</Text>
              <Text style={styles.sub}>{g.desc}</Text>
            </View>
          </Pressable>
        ))}
      </Grid>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  twoCol: { flexDirection: 'row', gap: 16, alignItems: 'stretch' },
  colItem: { flex: 1 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  flex: { flex: 1 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.amber, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  brand: { fontSize: 40, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, textAlign: 'center' },
  brandSub: { fontSize: 14, color: colors.ink, textAlign: 'center', marginBottom: 12 },
  avatar: { fontSize: 32 },
  hi: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sub: { fontSize: 14, color: colors.muted },
  pillSub: { fontSize: 13, color: colors.ink },
  grown: { fontSize: 14, fontWeight: '800', color: colors.ink },
  levelCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF6D6', borderRadius: 24, padding: 14, marginBottom: 12 },
  levelEmoji: { fontSize: 36 },
  levelTitle: { fontSize: 18, fontWeight: '900', color: colors.ink },
  levelSub: { fontSize: 13, color: colors.ink },
  leoCard: { backgroundColor: '#fff', borderRadius: 28, borderWidth: 2, borderColor: colors.ring, padding: 20, alignItems: 'center', marginBottom: 12 },
  leo: { fontSize: 24, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, textAlign: 'center' },
  leoSub: { fontSize: 15, color: colors.muted, marginTop: 6, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 28, borderWidth: 2, borderColor: colors.ring, padding: 16, marginBottom: 12 },
  kicker: { fontSize: 12, fontWeight: '900', color: colors.violetText, letterSpacing: 1 },
  wotdEmoji: { fontSize: 56, textAlign: 'center' },
  wotd: { fontSize: 32, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, textAlign: 'center' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'center' },
  ring: { fontSize: 34, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.tealText, textAlign: 'center' },
  goalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  bar: { height: 10, borderRadius: 5, backgroundColor: colors.tealSoft, marginTop: 10, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: colors.teal },
  gameCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 28, borderWidth: 2, borderColor: colors.ring, padding: 16, marginBottom: 12, minHeight: 84 },
  gameIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  gameIconText: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  gameTitle: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
});
