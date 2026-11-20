import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { STORIES, storiesForLevel, STORY_TOPICS } from '../data/stories';
import { ageToLevel } from '../data/levels';
import { useStore } from '../store/useStore';
import { personalize } from '../lib/personalize';
import { colors } from '../theme/colors';
import { useLayout } from '../lib/useLayout';
import ScreenShell from '../components/ScreenShell';
import Pic from '../components/Pic';
import Grid from '../components/Grid';
import ChildTopBar from '../components/ChildTopBar';

/** Story library: stories tailored for the child's level with beautiful cards. */
export default function StoriesScreen() {
  const router = useRouter();
  const { wide, cols } = useLayout();
  const age = useStore((s) => s.profile.age);
  const childLevel = ageToLevel(age);
  const name = useStore((s) => s.profile.name);
  const avatar = useStore((s) => s.profile.avatar);
  const read = useStore((s) => s.storiesRead);

  const list = storiesForLevel(childLevel).map((s) => personalize(s, name, avatar));
  const readCount = Object.keys(read).length;

  return (
    <ScreenShell onBack={() => router.replace('/')} backLabel="← Back">
      <ChildTopBar />
      <View style={styles.header}>
        <Text style={styles.title}>📖 Magical Storybook Library</Text>
        <Text style={styles.sub}>
          Read narrated stories, tap interactive scene characters, and answer fun quizzes! You've completed {readCount} of {STORIES.length} books.
        </Text>
      </View>

      <Grid cols={wide ? 2 : cols > 1 ? 2 : 1} gap={wide ? 16 : 12}>
        {list.map((s) => {
          const r = read[s.id];
          const topicInfo = STORY_TOPICS.find((t) => t.id === s.topic);
          return (
            <Pressable
              key={s.id}
              onPress={() => router.push({ pathname: '/story', params: { id: s.id } } as never)}
              style={[styles.card, { borderColor: s.color }]}
              accessibilityRole="button"
            >
              <View style={[styles.cover, { backgroundColor: s.color }]}>
                <Pic emoji={s.emoji} size={64} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardTopicBadge}>
                    <Text style={styles.cardTopicText}>
                      {topicInfo ? `${topicInfo.emoji} ${topicInfo.name.split(' ')[0]}` : 'Story'}
                    </Text>
                  </View>
                  <View style={styles.cardLevelBadge}>
                    <Text style={styles.cardLevelText}>Lvl {s.level}</Text>
                  </View>
                </View>
                <Text style={styles.t}>{s.title}</Text>
                <Text style={styles.meta}>{s.pages.length} pages · {s.questions.length} questions</Text>
                <Text style={r ? styles.done : styles.new}>
                  {r ? `${'⭐'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)} Completed` : '✨ Read Now'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Grid>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  title: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: colors.ink, marginBottom: 4 },
  sub: { fontSize: 14, fontFamily: 'Baloo2_700Bold', fontWeight: '700', color: colors.muted, lineHeight: 19 },
  card: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    padding: 14,
    alignItems: 'center',
    minHeight: 104,
    flex: 1,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cover: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cardHeaderRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 4 },
  cardTopicBadge: { backgroundColor: '#F1F5F9', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1.5 },
  cardTopicText: { fontSize: 10, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: '#475569' },
  cardLevelBadge: { backgroundColor: '#EEF2FF', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1.5 },
  cardLevelText: { fontSize: 10, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: '#4F46E5' },
  t: { fontSize: 18, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: colors.ink, lineHeight: 22 },
  meta: { fontSize: 12, fontFamily: 'Baloo2_700Bold', fontWeight: '700', color: colors.muted, marginTop: 2 },
  done: { fontSize: 13, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: colors.good, marginTop: 4 },
  new: { fontSize: 13, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '800', color: '#6366F1', marginTop: 4 },
});
