import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore, weeklySummary } from '../store/useStore';
import { WORDS } from '../data/words';
import { LEVELS, levelInfo } from '../data/levels';
import Pic from '../components/Pic';
import { AVATARS } from '../data/extras';
import { setSoundOn } from '../lib/audio';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import ParentGate from '../components/ParentGate';
import BigButton from '../components/BigButton';

/** Grown-ups dashboard — weekly summary, practice/strength words, Star Words picker, settings. Behind PIN 1234. */
export default function ParentScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const attempts = useStore((s) => s.attempts);
  const sessions = useStore((s) => s.sessions);
  const resetChild = useStore((s) => s.resetChild);
  const [pinInput, setPinInput] = useState(profile.pin);
  const [confirmReset, setConfirmReset] = useState(false);
  const [tab, setTab] = useState<'summary' | 'words' | 'settings'>('summary');
  const summary = weeklySummary(sessions, attempts);
  const storiesRead = useStore((s) => s.storiesRead);
  const storyCount = Object.keys(storiesRead).length;
  const storyStars = Object.values(storiesRead).reduce((n, r) => n + r.stars, 0);

  const wordStats = new Map<string, { tries: number; correct: number }>();
  attempts.forEach((a) => {
    const cur = wordStats.get(a.word) ?? { tries: 0, correct: 0 };
    cur.tries += a.tries; cur.correct += a.correct;
    wordStats.set(a.word, cur);
  });
  const struggling = [...wordStats.entries()].filter(([, s]) => s.tries > 0 && s.correct / s.tries < 0.5).map(([w]) => w);
  const strong = [...wordStats.entries()].filter(([, s]) => s.tries >= 2 && s.correct / s.tries >= 0.8).map(([w]) => w);
  const focus = profile.focusWords;

  const toggleFocus = (word: string) => {
    const next = focus.includes(word) ? focus.filter((x) => x !== word) : [...focus, word].slice(0, 8);
    setProfile({ focusWords: next });
  };

  return (
    <ScreenShell max={820} onBack={() => router.push('/')} backLabel="← Back">
      <ParentGate>
        <Text style={styles.title}>Grown-ups Dashboard</Text>
        <View style={styles.tabs}>
          {(['summary', 'words', 'settings'] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t ? styles.tabOn : null]}>
              <Text style={styles.tabText}>{t === 'summary' ? 'Weekly summary' : t === 'words' ? 'Star Words' : 'Settings'}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'summary' ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.big}>{summary.streak} 🔥 day streak</Text>
              <Text style={styles.sub}>{summary.totalMinutes} minutes played · {summary.sessionsPlayed} sessions · {summary.accuracy}% correct</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.big}>📖 {storyCount} {storyCount === 1 ? 'story' : 'stories'} read</Text>
              <Text style={styles.sub}>{storyStars} reading stars earned from story questions</Text>
            </View>
            {summary.days.map((d) => (
              <View key={d.label} style={styles.dayRow}>
                <Text style={styles.dayLabel}>{d.label}</Text>
                <View style={styles.dayBar}><View style={[styles.dayFill, { width: `${Math.min(100, d.minutes * 10)}%` }]} /></View>
                <Text style={styles.dayMin}>{d.minutes}m</Text>
              </View>
            ))}
            <Text style={styles.h}>Words to practise</Text>
            <Text style={styles.sub}>{struggling.length ? struggling.join(', ') : 'None yet — great job!'}</Text>
            <Text style={styles.h}>Strong words</Text>
            <Text style={styles.sub}>{strong.length ? strong.join(', ') : 'Play more games to see strong words here.'}</Text>
          </View>
        ) : null}

        {tab === 'words' ? (
          <View>
            <Text style={styles.sub}>Tap up to 8 words to make them Star Words — games will practise them first.</Text>
            <View style={styles.chips}>
              {WORDS.filter((x) => x.level === profile.level).slice(0, 60).map((wd) => (
                <Pressable key={wd.word} onPress={() => toggleFocus(wd.word)} style={[styles.chip, focus.includes(wd.word) ? styles.chipOn : null]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Pic emoji={wd.emoji} size={26} /><Text>{wd.word}</Text></View>
                </Pressable>
              ))}
            </View>
            <Text style={styles.sub}>Showing Level {profile.level} words ({WORDS.filter((x) => x.level === profile.level).length}). Star Words: {focus.join(', ') || 'none yet'}.</Text>
          </View>
        ) : null}

        {tab === 'settings' ? (
          <View>
            {profile.pin === '1234' ? (
              <View style={styles.warn}><Text style={styles.warnText}>⚠️ The PIN is still the default (1234). Please choose your own PIN below so children cannot open this area.</Text></View>
            ) : null}
            <View style={styles.row}><Text style={styles.label}>Child&rsquo;s name</Text>
              <TextInput value={profile.name} onChangeText={(v) => setProfile({ name: v })} style={styles.input} /></View>
            <View style={styles.row}><Text style={styles.label}>Child&rsquo;s age</Text>
              <View style={styles.avatars}>{[4, 5, 6, 7, 8, 9].map((a) => (
                <Pressable key={a} onPress={() => setProfile({ age: a })}><Text style={[styles.av, profile.age === a ? styles.avOn : null]}>{a}</Text></Pressable>
              ))}</View></View>
            <View style={styles.row}><Text style={styles.label}>Auto level (follows mistakes)</Text>
              <Switch value={profile.autoLevel} onValueChange={(v) => setProfile({ autoLevel: v, levelSince: attempts.length })} /></View>
            <Text style={styles.sub}>Level {profile.level} — {levelInfo(profile.level).name}: {levelInfo(profile.level).desc}</Text>
            <View style={styles.avatars}>{LEVELS.map((l) => (
              <Pressable key={l.level} onPress={() => setProfile({ level: l.level, levelSince: attempts.length })} style={[styles.chip, profile.level === l.level ? styles.chipOn : null]}>
                <Text>{l.emoji} L{l.level}</Text>
              </Pressable>
            ))}</View>
            <View style={{ height: 12 }} />
            <View style={styles.row}><Text style={styles.label}>Buddy</Text>
              <View style={styles.avatars}>{AVATARS.map((a) => (
                <Pressable key={a} onPress={() => setProfile({ avatar: a })}><View style={[styles.avPic, profile.avatar === a ? styles.avOn : null]}><Pic emoji={a} size={30} /></View></Pressable>
              ))}</View></View>
            <View style={styles.row}><Text style={styles.label}>Daily goal (minutes)</Text>
              <TextInput value={String(profile.dailyGoal)} keyboardType="number-pad" onChangeText={(v) => setProfile({ dailyGoal: parseInt(v, 10) || 10 })} style={styles.input} /></View>
            <View style={styles.row}><Text style={styles.label}>Sound effects</Text>
              <Switch value={profile.soundOn} onValueChange={(v) => { setProfile({ soundOn: v }); setSoundOn(v); }} /></View>
            <View style={styles.row}><Text style={styles.label}>Rewards (stickers)</Text>
              <Switch value={profile.rewardsOn} onValueChange={(v) => setProfile({ rewardsOn: v })} /></View>
            <View style={styles.row}><Text style={styles.label}>Bedtime Mode (soft lavender sky)</Text>
              <Switch value={profile.bedtimeMode} onValueChange={(v) => setProfile({ bedtimeMode: v })} /></View>
            <View style={styles.row}><Text style={styles.label}>Change PIN</Text>
              <TextInput value={pinInput} keyboardType="number-pad" maxLength={4} onChangeText={setPinInput} style={styles.input} /></View>
            <BigButton label="Save new PIN" onPress={() => { if (/^\d{4}$/.test(pinInput)) setProfile({ pin: pinInput }); }} color={colors.violet} />
            <View style={{ height: 16 }} />
            {confirmReset ? (
              <View style={styles.warn}>
                <Text style={styles.warnText}>This deletes all stars, stickers, stories read and map progress for this child. Are you sure?</Text>
                <View style={{ height: 10 }} />
                <BigButton label="Yes, delete everything" onPress={() => { resetChild(); setConfirmReset(false); }} color={colors.coral} />
                <View style={{ height: 8 }} />
                <BigButton label="No, keep it" onPress={() => setConfirmReset(false)} color="#fff" />
              </View>
            ) : (
              <BigButton label="Reset this child (clears progress)" onPress={() => setConfirmReset(true)} color={colors.coral} />
            )}
            <View style={styles.card}>
              <Text style={styles.big}>🔐 Privacy</Text>
              <Text style={styles.sub}>Spell Pals has no accounts, no ads and no tracking. It does not use the camera, microphone or location. The name, age and progress you enter stay only on this device and are deleted if you reset the child or remove the app. Voice feedback uses the phone&rsquo;s built-in speech.</Text>
            </View>
          </View>
        ) : null}
      </ParentGate>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 26, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, marginBottom: 12 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, backgroundColor: '#fff', borderRadius: 999, paddingVertical: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.ring },
  tabOn: { borderColor: colors.violet, backgroundColor: colors.violetSoft },
  tabText: { fontWeight: '800', color: colors.ink, fontSize: 13 },
  card: { backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderColor: colors.ring, padding: 18, marginBottom: 12 },
  big: { fontSize: 22, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sub: { fontSize: 15, color: colors.muted, marginTop: 4, marginBottom: 12 },
  h: { fontSize: 18, fontWeight: '900', color: colors.ink, marginTop: 12 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dayLabel: { width: 40, fontWeight: '800', color: colors.ink },
  dayBar: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#fff', overflow: 'hidden' },
  dayFill: { height: 10, backgroundColor: colors.teal },
  dayMin: { width: 32, textAlign: 'right', color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
  chip: { backgroundColor: '#fff', borderRadius: 999, borderWidth: 2, borderColor: colors.ring, paddingHorizontal: 12, paddingVertical: 8 },
  chipOn: { borderColor: colors.amber, backgroundColor: colors.amberSoft },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  label: { fontSize: 16, fontWeight: '800', color: colors.ink, flex: 1 },
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 2, borderColor: colors.ring, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, minWidth: 120, textAlign: 'center' },
  warn: { backgroundColor: '#FFF1C2', borderRadius: 18, padding: 14, marginBottom: 12 },
  warnText: { fontSize: 14, color: colors.ink },
  avPic: { borderRadius: 10, padding: 2, borderWidth: 2, borderColor: 'transparent' },
  avatars: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, maxWidth: 220, justifyContent: 'flex-end' },
  av: { fontSize: 26, padding: 4, borderRadius: 12 },
  avOn: { backgroundColor: colors.amberSoft },
});
