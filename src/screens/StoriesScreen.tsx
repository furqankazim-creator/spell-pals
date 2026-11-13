import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { STORIES, storiesForLevel } from '../data/stories';
import { LEVELS, levelInfo } from '../data/levels';
import { useStore } from '../store/useStore';
import { personalize } from '../lib/personalize';
import { colors } from '../theme/colors';
import { useLayout } from '../lib/useLayout';
import ScreenShell from '../components/ScreenShell';
import Pic from '../components/Pic';
import Grid from '../components/Grid';

/** Story library: stories grouped by level; the child's own level opens first. */
export default function StoriesScreen() {
  const router = useRouter();
  const { wide, cols } = useLayout();
  const level = useStore((s) => s.profile.level);
  const name = useStore((s) => s.profile.name);
  const avatar = useStore((s) => s.profile.avatar);
  const read = useStore((s) => s.storiesRead);
  const [shown, setShown] = useState(level);
  const list = storiesForLevel(shown).map((s) => personalize(s, name, avatar));
  const info = levelInfo(shown);
  const readCount = Object.keys(read).length;
  return (
    <ScreenShell>
      <Text style={styles.title}>📖 Story Time</Text>
      <Text style={styles.sub}>
        Read, listen, then answer the questions. You have read {readCount} of {STORIES.length} stories.
      </Text>

      <View style={styles.levels}>
        {LEVELS.map((l) => (
          <Pressable key={l.level} onPress={() => setShown(l.level)} style={[styles.chip, shown === l.level ? styles.chipOn : null]} accessibilityRole="button">
            <Text style={styles.chipText}>{l.emoji} Level {l.level}</Text>
            {l.level === level ? <Text style={styles.you}>your level</Text> : null}
          </Pressable>
        ))}
      </View>
      <Text style={styles.levelDesc}>{info.emoji} {info.name} · {info.ages}</Text>

      <Grid cols={wide ? 2 : cols > 1 ? 2 : 1} gap={wide ? 16 : 12}>
        {list.map((s) => {
          const r = read[s.id];
          return (
            <Pressable
              key={s.id}
              onPress={() => router.push({ pathname: '/story', params: { id: s.id } } as never)}
              style={[styles.card, { borderColor: s.color }]}
              accessibilityRole="button"
            >
              <View style={[styles.cover, { backgroundColor: s.color }]}><Pic emoji={s.emoji} size={64} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.t}>{s.title}</Text>
                <Text style={styles.meta}>{s.pages.length} pages · {s.questions.length} questions</Text>
                <Text style={r ? styles.done : styles.new}>{r ? `${'⭐'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}  Read` : 'New story'}</Text>
              </View>
            </Pressable>
          );
        })}
      </Grid>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, marginBottom: 4 },
  sub: { fontSize: 15, color: colors.ink, marginBottom: 14 },
  levels: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: 4, borderBottomColor: '#DCE8F5', alignItems: 'center' },
  chipOn: { backgroundColor: '#FFC93C', borderBottomColor: '#E0A820' },
  chipText: { fontSize: 15, color: colors.ink, fontFamily: 'Baloo2_800ExtraBold' },
  you: { fontSize: 10, color: colors.ink },
  levelDesc: { fontSize: 15, color: colors.ink, marginBottom: 12 },
  card: { flexDirection: 'row', gap: 14, backgroundColor: '#fff', borderRadius: 28, borderWidth: 2, padding: 14, alignItems: 'center', minHeight: 100, flex: 1 },
  cover: { width: 84, height: 84, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  t: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  meta: { fontSize: 13, color: colors.muted },
  done: { fontSize: 14, color: colors.good, marginTop: 2 },
  new: { fontSize: 14, color: colors.violetText, marginTop: 2 },
});
