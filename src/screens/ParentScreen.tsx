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
import { STAGES, WORLDS } from '../data/mapStages';
import ChildTopBar from '../components/ChildTopBar';
import StarWordImageUpload from '../components/StarWordImageUpload';
import { useLayout } from '../lib/useLayout';

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
  const [customWord, setCustomWord] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🧸');
  const [customImageUri, setCustomImageUri] = useState('');
  const [tab, setTab] = useState<'summary' | 'words' | 'settings' | 'map'>('summary');
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

  const mapStars = useStore((s) => s.mapStars);
  const addCustomWord = useStore((s) => s.addCustomWord);
  const removeCustomWord = useStore((s) => s.removeCustomWord);

  const { width } = useLayout();
  const compact = width < 700;

  return (
    <ScreenShell max={820} onBack={() => router.replace('/')} backLabel="← Back">
      <ChildTopBar />
      <ParentGate>
        <Text style={styles.title}>Grown-ups Dashboard</Text>
        <View style={[styles.tabs, compact && styles.tabsCompact]}>
          {(['summary', 'map', 'words', 'settings'] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, compact && styles.tabCompact, tab === t ? styles.tabOn : null]}>
              <Text style={styles.tabText}>{t === 'summary' ? 'Weekly summary' : t === 'map' ? 'Adventure Map' : t === 'words' ? 'Star Words' : 'Settings'}</Text>
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

        {tab === 'map' ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.big}>🗺️ Adventure Map</Text>
              <Text style={styles.sub}>{STAGES.reduce((n, s) => n + (mapStars[s.id] ?? 0), 0)} of {STAGES.length * 3} stars earned · {STAGES.filter((s) => (mapStars[s.id] ?? 0) > 0).length} of {STAGES.length} stages started</Text>
              <BigButton label="Open the Map" onPress={() => router.push('/map')} color={colors.amber} />
            </View>
            {WORLDS.map((world, wi) => {
              const stages = STAGES.filter((s) => s.world === wi);
              const stars = stages.reduce((n, s) => n + (mapStars[s.id] ?? 0), 0);
              const complete = stages.every((s) => (mapStars[s.id] ?? 0) > 0);
              return (
                <View key={world.id} style={styles.card}>
                  <Text style={styles.big}>{world.emoji} {world.name}</Text>
                  <Text style={styles.sub}>⭐ {stars} / 15 stars · {complete ? 'World complete!' : 'Keep exploring'}</Text>
                </View>
              );
            })}
          </View>
        ) : null}

        {tab === 'words' ? (
          <View>
            <Text style={styles.sub}>Add a custom Star Word or tap up to 8 words for games to practise first.</Text>
            <View style={styles.customWordCard}>
              <View style={styles.customCardHeader}>
                <View style={styles.customHeaderIcon}><Text style={styles.customHeaderEmoji}>⭐</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.customTitle}>Create a Star Word</Text>
                  <Text style={styles.customSubtitle}>Add a word and its own picture</Text>
                </View>
              </View>

              <View style={styles.customGrid}>
                <View style={styles.customForm}>
                  <Text style={styles.fieldLabel}>Word</Text>
                  <TextInput value={customWord} onChangeText={setCustomWord} placeholder="Type a word" placeholderTextColor="#9AA3C0" style={styles.customInput} maxLength={20} autoCapitalize="none" />
                  <Text style={styles.fieldLabel}>Fallback emoji</Text>
                  <TextInput value={customEmoji} onChangeText={setCustomEmoji} placeholder="🧸" placeholderTextColor="#9AA3C0" style={styles.emojiInput} maxLength={8} />
                </View>

                <View style={styles.customUploadWrap}>
                  <Text style={styles.fieldLabel}>Picture</Text>
                  <StarWordImageUpload value={customImageUri} emoji={customEmoji || '🧸'} onChange={setCustomImageUri} />
                </View>
              </View>

              <View style={styles.addWordButtonWrap}>
                <BigButton label="Add to Star Words" onPress={() => {
                  const word = customWord.trim().toLowerCase();
                  if (!word) return;
                  addCustomWord({ word, emoji: customEmoji.trim() || '🧸', imageUri: customImageUri.trim() || undefined, level: profile.level as 1 | 2 | 3 | 4 | 5, sounds: [] });
                  setCustomWord(''); setCustomEmoji('🧸'); setCustomImageUri('');
                }} color={colors.amber} />
              </View>
            </View>

            {(profile.customWords ?? []).length ? (
              <View>
                <Text style={styles.h}>My custom Star Words</Text>
                <View style={styles.chips}>
                  {(profile.customWords ?? []).map((wd) => (
                    <View key={wd.word} style={[styles.customChip, focus.includes(wd.word) ? styles.chipOn : null]}>
                      <Pressable onPress={() => toggleFocus(wd.word)} style={styles.customChipMain}>
                        <Pic emoji={wd.emoji} imageUri={wd.imageUri} size={26} />
                        <Text style={styles.customChipText}>{wd.word}</Text>
                      </Pressable>
                      <Pressable onPress={() => removeCustomWord(wd.word)} accessibilityRole="button" accessibilityLabel={`Remove ${wd.word}`}><Text style={styles.removeText}>✕</Text></Pressable>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <Text style={styles.h}>Library Star Words</Text>
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
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={[styles.label, compact && styles.labelCompact]}>Child&rsquo;s name</Text>
              <TextInput value={profile.name} onChangeText={(v) => setProfile({ name: v })} style={styles.input} /></View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={[styles.label, compact && styles.labelCompact]}>{'Child’s age'}</Text>
              <View style={styles.avatars}>{[4, 5, 6, 7, 8, 9].map((a) => (
                <Pressable key={a} onPress={() => setProfile({ age: a })}><Text style={[styles.av, profile.age === a ? styles.avOn : null]}>{a}</Text></Pressable>
              ))}</View></View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={[styles.label, compact && styles.labelCompact]}>Auto level (follows mistakes)</Text>
              <Switch value={profile.autoLevel} onValueChange={(v) => setProfile({ autoLevel: v, levelSince: attempts.length })} /></View>
            <Text style={styles.sub}>Level {profile.level} — {levelInfo(profile.level).name}: {levelInfo(profile.level).desc}</Text>
            <View style={styles.avatars}>{LEVELS.map((l) => (
              <Pressable key={l.level} onPress={() => setProfile({ level: l.level, levelSince: attempts.length })} style={[styles.chip, profile.level === l.level ? styles.chipOn : null]}>
                <Text>{l.emoji} L{l.level}</Text>
              </Pressable>
            ))}</View>
            <View style={{ height: 12 }} />
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={styles.label}>Buddy</Text>
              <View style={styles.avatars}>{AVATARS.map((a) => (
                <Pressable key={a} onPress={() => setProfile({ avatar: a })}><View style={[styles.avPic, profile.avatar === a ? styles.avOn : null]}><Pic emoji={a} size={30} /></View></Pressable>
              ))}</View></View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={styles.label}>Daily goal (minutes)</Text>
              <TextInput value={String(profile.dailyGoal)} keyboardType="number-pad" onChangeText={(v) => setProfile({ dailyGoal: parseInt(v, 10) || 10 })} style={styles.input} /></View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={[styles.label, compact && styles.labelCompact]}>Sound effects</Text>
              <Switch value={profile.soundOn} onValueChange={(v) => { setProfile({ soundOn: v }); setSoundOn(v); }} /></View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={styles.label}>Rewards (stickers)</Text>
              <Switch value={profile.rewardsOn} onValueChange={(v) => setProfile({ rewardsOn: v })} /></View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={styles.label}>Bedtime Mode (soft lavender sky)</Text>
              <Switch value={profile.bedtimeMode} onValueChange={(v) => setProfile({ bedtimeMode: v })} /></View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={[styles.label, compact && styles.labelCompact]}>Publisher</Text>
              <Pressable onPress={() => router.push('/about-hope-bridge')} style={styles.publisherRow} accessibilityRole="button">
                <Text style={styles.publisherText}>About Hope Bridge Digital →</Text>
              </Pressable>
            </View>
            <View style={[styles.row, compact && styles.rowCompact]}><Text style={[styles.label, compact && styles.labelCompact]}>Change PIN</Text>
              <TextInput value={pinInput} keyboardType="number-pad" maxLength={4} onChangeText={setPinInput} style={styles.input} /></View>
            <BigButton label="Save new PIN" onPress={() => { if (/^\d{4}$/.test(pinInput)) setProfile({ pin: pinInput }); }} color={colors.violet} />
            <View style={{ height: 16 }} />
            {confirmReset ? (
              <View style={styles.resetConfirmCard}>
                <View style={styles.resetConfirmHeader}>
                  <View style={styles.resetIconSmall}><Text style={styles.resetIconText}>↻</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resetTitle}>Reset this child?</Text>
                    <Text style={styles.resetDescription}>This clears stars, stickers, stories, custom words and map progress.</Text>
                  </View>
                </View>
                <View style={styles.resetActions}>
                  <Pressable style={styles.keepButton} onPress={() => setConfirmReset(false)} accessibilityRole="button">
                    <Text style={styles.keepButtonText}>Keep everything</Text>
                  </Pressable>
                  <Pressable style={styles.confirmResetButton} onPress={() => { resetChild(); setConfirmReset(false); }} accessibilityRole="button">
                    <Text style={styles.confirmResetText}>Yes, reset</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable style={styles.resetButton} onPress={() => setConfirmReset(true)} accessibilityRole="button">
                <View style={styles.resetIconCircle}><Text style={styles.resetIconText}>↻</Text></View>
                <View style={styles.resetButtonTextWrap}>
                  <Text style={styles.resetButtonTitle}>Reset this child</Text>
                  <Text style={styles.resetButtonSub}>Clears all progress and rewards</Text>
                </View>
                <Text style={styles.resetChevron}>›</Text>
              </Pressable>
            )}

            <View style={styles.privacyCard}>
              <View style={styles.privacyHeader}>
                <View style={styles.privacyIcon}><Text style={styles.privacyIconText}>🔐</Text></View>
                <Text style={styles.privacyTitle}>Privacy</Text>
              </View>
              <Text style={styles.privacyText}>Spell Pals has no accounts, ads or tracking. Child details and progress stay on this device. Custom pictures stay on this device and are removed when the child is reset or the app is deleted. Voice feedback uses the phone&rsquo;s built-in speech.</Text>
            </View>
          </View>
        ) : null}
      </ParentGate>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 26, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, marginBottom: 12 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tabsCompact: { flexWrap: 'wrap', gap: 8 },
  tab: { flex: 1, backgroundColor: '#fff', borderRadius: 999, paddingVertical: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.ring },
  tabCompact: { flexBasis: '48%', flexGrow: 0, minHeight: 44, paddingVertical: 9, paddingHorizontal: 8 },
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
  rowCompact: { alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 2, borderColor: colors.ring, padding: 12 },
  publisherRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  publisherText: { fontSize: 15, color: colors.violetText, fontWeight: '800' },
  label: { fontSize: 16, fontWeight: '800', color: colors.ink, flex: 1 },
  labelCompact: { flexBasis: '100%', marginBottom: 2 },
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 2, borderColor: colors.ring, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, minWidth: 120, textAlign: 'center' },
  warn: { backgroundColor: '#FFF1C2', borderRadius: 18, padding: 14, marginBottom: 12 },
  warnText: { fontSize: 14, color: colors.ink },
  avPic: { borderRadius: 10, padding: 2, borderWidth: 2, borderColor: 'transparent' },
  avatars: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, maxWidth: 220, justifyContent: 'flex-end' },
  av: { fontSize: 26, padding: 4, borderRadius: 12 },
  avOn: { backgroundColor: colors.amberSoft },
  stage: { flex: 1, alignItems: 'center' },
  stageLocked: { opacity: 0.4 },
  stageText: { fontSize: 28 },
  stageTextCompleted: { color: colors.teal },
  completed: { color: colors.teal, fontWeight: '800' },
  locked: { color: colors.muted, fontWeight: '800' },
  customWordCard: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 2, borderColor: '#E7EAF3', padding: 16, marginBottom: 16, shadowColor: '#5B8DB8', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  customCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  customHeaderIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF1C2', alignItems: 'center', justifyContent: 'center' },
  customHeaderEmoji: { fontSize: 22 },
  customTitle: { fontSize: 20, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  customSubtitle: { fontSize: 12, color: colors.muted, marginTop: 1 },
  customGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  customForm: { flexGrow: 1, flexBasis: 190 },
  customUploadWrap: { flexGrow: 1, flexBasis: 190 },
  fieldLabel: { fontSize: 13, fontWeight: '900', color: colors.ink, marginBottom: 7 },
  customInput: { height: 52, backgroundColor: '#F8FAFF', borderRadius: 14, borderWidth: 2, borderColor: '#E5EAF4', paddingHorizontal: 14, fontSize: 16, color: colors.ink, marginBottom: 12 },
  emojiInput: { height: 52, width: 72, backgroundColor: '#F8FAFF', borderRadius: 14, borderWidth: 2, borderColor: '#E5EAF4', textAlign: 'center', fontSize: 24, color: colors.ink },
  addWordButtonWrap: { marginTop: 12 },
  customChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 999, borderWidth: 2, borderColor: colors.ring, paddingLeft: 8, paddingRight: 10, paddingVertical: 6 },
  customChipMain: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  customChipText: { fontSize: 14, color: colors.ink, fontWeight: '800' },
  removeText: { fontSize: 16, color: colors.coral, fontWeight: '900', marginLeft: 8 },
  resetButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F1', borderWidth: 2, borderColor: '#FFD0D4', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 14, marginTop: 4, marginBottom: 14 },
  resetIconCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FF646D', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  resetIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  resetButtonTextWrap: { flex: 1 },
  resetButtonTitle: { color: '#A92F3C', fontSize: 16, fontWeight: '900' },
  resetButtonSub: { color: '#A45B63', fontSize: 12, marginTop: 2 },
  resetChevron: { color: '#A92F3C', fontSize: 28, fontWeight: '900', marginLeft: 8 },
  resetConfirmCard: { backgroundColor: '#FFF5F5', borderWidth: 2, borderColor: '#FFD0D4', borderRadius: 20, padding: 14, marginBottom: 14 },
  resetConfirmHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  resetIconSmall: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FF646D', alignItems: 'center', justifyContent: 'center' },
  resetTitle: { color: '#822633', fontSize: 17, fontWeight: '900' },
  resetDescription: { color: '#95636A', fontSize: 12, lineHeight: 17, marginTop: 2 },
  resetActions: { flexDirection: 'row', gap: 8 },
  keepButton: { flex: 1, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E3E7F0', alignItems: 'center', justifyContent: 'center' },
  keepButtonText: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  confirmResetButton: { flex: 1, height: 44, borderRadius: 14, backgroundColor: '#FF646D', alignItems: 'center', justifyContent: 'center' },
  confirmResetText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  privacyCard: { backgroundColor: '#F8FBFF', borderWidth: 2, borderColor: '#DFE9F5', borderRadius: 20, padding: 14, marginBottom: 12 },
  privacyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  privacyIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#EAF3FF', alignItems: 'center', justifyContent: 'center' },
  privacyIconText: { fontSize: 17 },
  privacyTitle: { color: '#26344D', fontSize: 17, fontWeight: '900' },
  privacyText: { color: '#5F6B7C', fontSize: 13, lineHeight: 19 },
  settingsCompact: { width: '100%' },
});
