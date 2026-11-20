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
import { MAP_WORLDS, getStagesForLevel } from '../data/mapStages';
import ChildTopBar from '../components/ChildTopBar';
import StarWordImageUpload from '../components/StarWordImageUpload';
import { useLayout } from '../lib/useLayout';

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
  const [tab, setTab] = useState<'summary' | 'map' | 'words' | 'settings'>('summary');
  const summary = weeklySummary(sessions, attempts);
  const storiesRead = useStore((s) => s.storiesRead);
  const storyCount = Object.keys(storiesRead).length;
  const storyStars = Object.values(storiesRead).reduce((n, r) => n + r.stars, 0);

  const wordStats = new Map<string, { tries: number; correct: number }>();
  attempts.forEach((a) => {
    const cur = wordStats.get(a.word) ?? { tries: 0, correct: 0 };
    cur.tries += a.tries;
    cur.correct += a.correct;
    wordStats.set(a.word, cur);
  });
  const struggling = [...wordStats.entries()]
    .filter(([, s]) => s.tries > 0 && s.correct / s.tries < 0.5)
    .map(([w]) => w);
  const strong = [...wordStats.entries()]
    .filter(([, s]) => s.tries >= 2 && s.correct / s.tries >= 0.8)
    .map(([w]) => w);
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

  const TAB_ITEMS = [
    { id: 'summary', label: 'Weekly Summary', icon: '📊' },
    { id: 'map', label: 'Adventure Map', icon: '🗺️' },
    { id: 'words', label: 'Star Words', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as const;

  return (
    <ScreenShell max={820} onBack={() => router.replace('/')} backLabel="← Back">
      <ChildTopBar />
      <ParentGate>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👨‍👩‍👧 Grown-ups Dashboard</Text>
          <Text style={styles.sub}>
            Monitor your child’s weekly learning progress, customize vocabulary, and configure preferences.
          </Text>
        </View>

        {/* 4 Navigation Tabs */}
        <View style={styles.tabsRow}>
          {TAB_ITEMS.map((t) => {
            const isActive = tab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={({ pressed }) => [
                  styles.tabPill,
                  isActive && styles.tabPillActive,
                  pressed && styles.tabPillPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={t.label}
              >
                <Text style={styles.tabIcon}>{t.icon}</Text>
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ─────────────────── TAB 1: WEEKLY SUMMARY ─────────────────── */}
        {tab === 'summary' && (
          <View style={styles.tabContent}>
            {/* Streak & Sessions Stat Card */}
            <View style={styles.statCard}>
              <View style={styles.statCardTop}>
                <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={{ fontSize: 26 }}>🔥</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statBigTitle}>{summary.streak} Day Learning Streak</Text>
                  <Text style={styles.statSubText}>
                    {summary.totalMinutes} mins played · {summary.sessionsPlayed} sessions completed · {summary.accuracy}% accuracy
                  </Text>
                </View>
              </View>
            </View>

            {/* Stories Read Stat Card */}
            <View style={styles.statCard}>
              <View style={styles.statCardTop}>
                <View style={[styles.statIconWrap, { backgroundColor: '#E0E7FF' }]}>
                  <Text style={{ fontSize: 26 }}>📖</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statBigTitle}>
                    {storyCount} {storyCount === 1 ? 'Story' : 'Stories'} Completed
                  </Text>
                  <Text style={styles.statSubText}>
                    {storyStars} reading stars earned across comprehension challenges
                  </Text>
                </View>
              </View>
            </View>

            {/* Daily Activity Chart Card */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>📅 Daily Minutes This Week</Text>
              <View style={{ marginTop: 12 }}>
                {summary.days.map((d) => (
                  <View key={d.label} style={styles.dayRow}>
                    <Text style={styles.dayLabel}>{d.label}</Text>
                    <View style={styles.dayBarBg}>
                      <View
                        style={[
                          styles.dayBarFill,
                          { width: `${Math.min(100, Math.max(d.minutes > 0 ? 8 : 0, d.minutes * 10))}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.dayMin}>{d.minutes}m</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Words to Practise Card */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>🎯 Words to Practise</Text>
              {struggling.length ? (
                <View style={styles.chipsRow}>
                  {struggling.map((w) => (
                    <View key={w} style={styles.practiseChip}>
                      <Text style={styles.practiseChipText}>{w}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyNote}>None yet — your child is mastering words smoothly!</Text>
              )}
            </View>

            {/* Strong Words Card */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>💪 Strong Words Mastered</Text>
              {strong.length ? (
                <View style={styles.chipsRow}>
                  {strong.map((w) => (
                    <View key={w} style={styles.strongChip}>
                      <Text style={styles.strongChipText}>⭐ {w}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyNote}>Play more games to see mastered words here.</Text>
              )}
            </View>
          </View>
        )}

        {/* ─────────────────── TAB 2: ADVENTURE MAP ─────────────────── */}
        {tab === 'map' && (
          <View style={styles.tabContent}>
            <View style={styles.statCard}>
              <View style={styles.statCardTop}>
                <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={{ fontSize: 26 }}>🗺️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statBigTitle}>10 Locks Adventure Trails</Text>
                  <Text style={styles.statSubText}>
                    {Object.values(mapStars).reduce((sum, v) => sum + v, 0)} total stars collected across all quest realms
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 14 }}>
                <BigButton
                  label="Open Adventure Map"
                  icon="map"
                  onPress={() => router.push('/map')}
                  color={colors.amber}
                />
              </View>
            </View>

            {MAP_WORLDS.map((world) => {
              const stages = getStagesForLevel(world.level);
              const stars = stages.reduce((n, s) => n + (mapStars[s.id] ?? 0), 0);
              const completedCount = stages.filter((s) => (mapStars[s.id] ?? 0) > 0).length;
              return (
                <View key={world.id} style={styles.worldCard}>
                  <View style={styles.worldCardHeader}>
                    <View style={styles.worldIconWrap}>
                      <Text style={{ fontSize: 28 }}>{world.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.worldTitle}>
                        {world.name} (Level {world.level})
                      </Text>
                      <Text style={styles.worldDesc}>{world.desc}</Text>
                    </View>
                    <View style={styles.worldStarsPill}>
                      <Text style={styles.worldStarsText}>⭐ {stars}/30</Text>
                    </View>
                  </View>

                  <View style={styles.worldProgressBarBg}>
                    <View
                      style={[
                        styles.worldProgressBarFill,
                        { width: `${Math.min(100, (stars / 30) * 100)}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.worldStatusText}>
                    {completedCount} of 10 locks opened {completedCount === 10 ? '👑 Mastered!' : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ─────────────────── TAB 3: STAR WORDS ─────────────────── */}
        {tab === 'words' && (
          <View style={styles.tabContent}>
            {/* Create Custom Star Word */}
            <View style={styles.customWordCard}>
              <View style={styles.customCardHeader}>
                <View style={styles.customHeaderIcon}>
                  <Text style={styles.customHeaderEmoji}>⭐</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.customTitle}>Create a Custom Star Word</Text>
                  <Text style={styles.customSubtitle}>
                    Add your child's name, family members, pets, or favourite items!
                  </Text>
                </View>
              </View>

              <View style={styles.customGrid}>
                <View style={styles.customForm}>
                  <Text style={styles.fieldLabel}>Word</Text>
                  <TextInput
                    value={customWord}
                    onChangeText={setCustomWord}
                    placeholder="e.g. teddy, luna, milk"
                    placeholderTextColor="#9AA3C0"
                    style={styles.customInput}
                    maxLength={20}
                    autoCapitalize="none"
                  />
                  <Text style={styles.fieldLabel}>Fallback Emoji</Text>
                  <TextInput
                    value={customEmoji}
                    onChangeText={setCustomEmoji}
                    placeholder="🧸"
                    placeholderTextColor="#9AA3C0"
                    style={styles.emojiInput}
                    maxLength={8}
                  />
                </View>

                <View style={styles.customUploadWrap}>
                  <Text style={styles.fieldLabel}>Custom Picture (Optional)</Text>
                  <StarWordImageUpload
                    value={customImageUri}
                    emoji={customEmoji || '🧸'}
                    onChange={setCustomImageUri}
                  />
                </View>
              </View>

              <View style={styles.addWordButtonWrap}>
                <BigButton
                  label="Add to Star Words"
                  icon="star"
                  onPress={() => {
                    const word = customWord.trim().toLowerCase();
                    if (!word) return;
                    addCustomWord({
                      word,
                      emoji: customEmoji.trim() || '🧸',
                      imageUri: customImageUri.trim() || undefined,
                      level: profile.level as 1 | 2 | 3 | 4 | 5,
                      sounds: [],
                    });
                    setCustomWord('');
                    setCustomEmoji('🧸');
                    setCustomImageUri('');
                  }}
                  color={colors.amber}
                />
              </View>
            </View>

            {/* Custom Words List */}
            {(profile.customWords ?? []).length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardSectionTitle}>✨ My Custom Star Words</Text>
                <View style={styles.chipsRow}>
                  {(profile.customWords ?? []).map((wd) => {
                    const isFocus = focus.includes(wd.word);
                    return (
                      <View
                        key={wd.word}
                        style={[styles.customWordChip, isFocus && styles.chipActive]}
                      >
                        <Pressable
                          onPress={() => toggleFocus(wd.word)}
                          style={styles.customWordChipInner}
                        >
                          <Pic emoji={wd.emoji} imageUri={wd.imageUri} size={26} />
                          <Text style={styles.chipText}>{wd.word}</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => removeCustomWord(wd.word)}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${wd.word}`}
                          style={styles.chipRemoveBtn}
                        >
                          <Text style={styles.chipRemoveText}>✕</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Library Words Picker */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>
                📚 Library Star Words (Level {profile.level})
              </Text>
              <Text style={styles.cardHelpText}>
                Tap up to 8 priority words for games to present first in rounds:
              </Text>
              <View style={styles.chipsRow}>
                {WORDS.filter((x) => x.level === profile.level)
                  .slice(0, 60)
                  .map((wd) => {
                    const isFocus = focus.includes(wd.word);
                    return (
                      <Pressable
                        key={wd.word}
                        onPress={() => toggleFocus(wd.word)}
                        style={({ pressed }) => [
                          styles.libraryChip,
                          isFocus && styles.chipActive,
                          pressed && styles.chipPressed,
                        ]}
                      >
                        <Pic emoji={wd.emoji} size={22} />
                        <Text style={[styles.chipText, isFocus && styles.chipTextActive]}>
                          {wd.word}
                        </Text>
                        {isFocus && <Text style={styles.chipCheck}>⭐</Text>}
                      </Pressable>
                    );
                  })}
              </View>
            </View>
          </View>
        )}

        {/* ─────────────────── TAB 4: SETTINGS ─────────────────── */}
        {tab === 'settings' && (
          <View style={styles.tabContent}>
            {profile.pin === '1234' && (
              <View style={styles.warnCard}>
                <Text style={styles.warnIcon}>⚠️</Text>
                <Text style={styles.warnText}>
                  Your PIN is still the default (1234). Set a private PIN below so children cannot change settings.
                </Text>
              </View>
            )}

            {/* Child's Profile Settings */}
            <View style={styles.settingCard}>
              <Text style={styles.settingGroupTitle}>👶 Child Profile</Text>

              {/* Child's Name */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Child's Name</Text>
                <TextInput
                  value={profile.name}
                  onChangeText={(v) => setProfile({ name: v })}
                  style={styles.textInput}
                  placeholder="Child's Name"
                />
              </View>

              {/* Child's Age */}
              <View style={styles.settingRowWrap}>
                <Text style={styles.settingLabel}>Child's Age</Text>
                <View style={styles.agePillsRow}>
                  {[4, 5, 6, 7, 8, 9].map((a) => {
                    const isSelected = profile.age === a;
                    return (
                      <Pressable
                        key={a}
                        onPress={() => setProfile({ age: a })}
                        style={({ pressed }) => [
                          styles.agePillBtn,
                          isSelected && styles.agePillBtnSelected,
                          pressed && styles.agePillBtnPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.agePillBtnText,
                            isSelected && styles.agePillBtnTextSelected,
                          ]}
                        >
                          {a}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Learning Level */}
              <View style={styles.settingRowWrap}>
                <Text style={styles.settingLabel}>
                  Level ({profile.level}: {levelInfo(profile.level).name})
                </Text>
                <View style={styles.levelPillsRow}>
                  {LEVELS.map((l) => {
                    const isSelected = profile.level === l.level;
                    return (
                      <Pressable
                        key={l.level}
                        onPress={() =>
                          setProfile({ level: l.level, levelSince: attempts.length })
                        }
                        style={({ pressed }) => [
                          styles.levelPillBtn,
                          isSelected && styles.levelPillBtnSelected,
                          pressed && styles.levelPillBtnPressed,
                        ]}
                      >
                        <Text style={styles.levelPillEmoji}>{l.emoji}</Text>
                        <Text
                          style={[
                            styles.levelPillText,
                            isSelected && styles.levelPillTextSelected,
                          ]}
                        >
                          L{l.level}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Buddy Avatar */}
              <View style={styles.settingRowWrap}>
                <Text style={styles.settingLabel}>Buddy Avatar</Text>
                <View style={styles.avatarsRow}>
                  {AVATARS.map((a) => {
                    const isSelected = profile.avatar === a;
                    return (
                      <Pressable
                        key={a}
                        onPress={() => setProfile({ avatar: a })}
                        style={({ pressed }) => [
                          styles.avatarPill,
                          isSelected && styles.avatarPillSelected,
                          pressed && styles.avatarPillPressed,
                        ]}
                      >
                        <Pic emoji={a} size={30} />
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Daily Goal */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Daily Goal (Minutes)</Text>
                <TextInput
                  value={String(profile.dailyGoal)}
                  keyboardType="number-pad"
                  onChangeText={(v) =>
                    setProfile({ dailyGoal: parseInt(v, 10) || 10 })
                  }
                  style={styles.textInputSmall}
                />
              </View>
            </View>

            {/* App Preferences */}
            <View style={styles.settingCard}>
              <Text style={styles.settingGroupTitle}>⚙️ Learning Preferences</Text>

              {/* Auto Level */}
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchTitle}>Auto-Level Adaptability</Text>
                  <Text style={styles.switchSub}>
                    Adjusts word challenge dynamically based on mistakes and streaks
                  </Text>
                </View>
                <Switch
                  value={profile.autoLevel}
                  onValueChange={(v) =>
                    setProfile({ autoLevel: v, levelSince: attempts.length })
                  }
                  trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
                  thumbColor={profile.autoLevel ? colors.violet : '#94A3B8'}
                />
              </View>

              {/* Sound Effects */}
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchTitle}>Sound Effects & Voice</Text>
                  <Text style={styles.switchSub}>
                    Phonics pronunciation and positive cheers
                  </Text>
                </View>
                <Switch
                  value={profile.soundOn}
                  onValueChange={(v) => {
                    setProfile({ soundOn: v });
                    setSoundOn(v);
                  }}
                  trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
                  thumbColor={profile.soundOn ? colors.violet : '#94A3B8'}
                />
              </View>

              {/* Sticker Rewards */}
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchTitle}>Reward Badges & Mystery Gifts</Text>
                  <Text style={styles.switchSub}>
                    Celebrate victories with mystery gift boxes and album stickers
                  </Text>
                </View>
                <Switch
                  value={profile.rewardsOn}
                  onValueChange={(v) => setProfile({ rewardsOn: v })}
                  trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
                  thumbColor={profile.rewardsOn ? colors.violet : '#94A3B8'}
                />
              </View>

              {/* Bedtime Mode */}
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchTitle}>Bedtime Mode</Text>
                  <Text style={styles.switchSub}>
                    Softer lavender sky backdrop for evening reading
                  </Text>
                </View>
                <Switch
                  value={profile.bedtimeMode}
                  onValueChange={(v) => setProfile({ bedtimeMode: v })}
                  trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
                  thumbColor={profile.bedtimeMode ? colors.violet : '#94A3B8'}
                />
              </View>
            </View>

            {/* PIN Security */}
            <View style={styles.settingCard}>
              <Text style={styles.settingGroupTitle}>🔐 Grown-ups Gate PIN</Text>
              <Text style={styles.cardHelpText}>
                Choose a 4-digit code to keep child play locked to learning screens:
              </Text>
              <View style={styles.pinRow}>
                <TextInput
                  value={pinInput}
                  keyboardType="number-pad"
                  maxLength={4}
                  onChangeText={setPinInput}
                  style={styles.pinInput}
                />
                <Pressable
                  onPress={() => {
                    if (/^\d{4}$/.test(pinInput)) {
                      setProfile({ pin: pinInput });
                    }
                  }}
                  style={({ pressed }) => [
                    styles.savePinBtn,
                    pressed && styles.btnPressed,
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.savePinBtnText}>Save PIN</Text>
                </Pressable>
              </View>
            </View>

            {/* Publisher Info */}
            <Pressable
              onPress={() => router.push('/about-hope-bridge')}
              style={({ pressed }) => [
                styles.publisherCard,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 24 }}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.publisherTitle}>About Hope Bridge Digital</Text>
                <Text style={styles.publisherSub}>
                  Independent Australian children's learning studio
                </Text>
              </View>
              <Text style={styles.publisherChevron}>➔</Text>
            </Pressable>

            {/* Reset Child Progress */}
            {confirmReset ? (
              <View style={styles.resetConfirmCard}>
                <View style={styles.resetConfirmHeader}>
                  <View style={styles.resetIconSmall}>
                    <Text style={styles.resetIconText}>↻</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resetTitle}>Reset All Progress?</Text>
                    <Text style={styles.resetDescription}>
                      This clears collected stars, won stickers, story completions, custom words, and map quests.
                    </Text>
                  </View>
                </View>
                <View style={styles.resetActions}>
                  <Pressable
                    style={styles.keepButton}
                    onPress={() => setConfirmReset(false)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.keepButtonText}>Keep Everything</Text>
                  </Pressable>
                  <Pressable
                    style={styles.confirmResetButton}
                    onPress={() => {
                      resetChild();
                      setConfirmReset(false);
                    }}
                    accessibilityRole="button"
                  >
                    <Text style={styles.confirmResetText}>Yes, Reset</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.resetButton,
                  pressed && styles.btnPressed,
                ]}
                onPress={() => setConfirmReset(true)}
                accessibilityRole="button"
              >
                <View style={styles.resetIconCircle}>
                  <Text style={styles.resetIconText}>↻</Text>
                </View>
                <View style={styles.resetButtonTextWrap}>
                  <Text style={styles.resetButtonTitle}>Reset This Child</Text>
                  <Text style={styles.resetButtonSub}>
                    Clears all stars, sticker album, and level progress
                  </Text>
                </View>
                <Text style={styles.resetChevron}>›</Text>
              </Pressable>
            )}

            {/* Privacy Guarantee Card */}
            <View style={styles.privacyCard}>
              <View style={styles.privacyHeader}>
                <View style={styles.privacyIcon}>
                  <Text style={{ fontSize: 18 }}>🛡️</Text>
                </View>
                <Text style={styles.privacyTitle}>100% Private & Ad-Free Guarantee</Text>
              </View>
              <Text style={styles.privacyText}>
                Spell Pals has zero accounts, third-party ads, or data tracking. Child details and learning progress stay strictly on this device. Custom pictures remain local and are wiped when reset. Voice feedback runs on device via the phone's native speech engine.
              </Text>
            </View>
          </View>
        )}
      </ParentGate>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    lineHeight: 20,
  },

  /* 4 Tabs Navigation */
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tabPill: {
    flex: 1,
    minWidth: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
    borderBottomColor: '#4F46E5',
  },
  tabPillPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 1.5,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  tabLabelActive: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#4F46E5',
  },

  tabContent: {
    marginBottom: 20,
  },

  /* General Cards */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  cardHelpText: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 2,
    marginBottom: 10,
  },

  /* Stat Card */
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBigTitle: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  statSubText: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 2,
  },

  /* Day Bars */
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dayLabel: {
    width: 38,
    fontSize: 13,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  dayBarBg: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  dayBarFill: {
    height: '100%',
    backgroundColor: colors.teal,
    borderRadius: 6,
  },
  dayMin: {
    width: 36,
    textAlign: 'right',
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },

  /* Chips */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  practiseChip: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  practiseChipText: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#DC2626',
  },
  strongChip: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  strongChipText: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#059669',
  },
  emptyNote: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 6,
  },

  /* World Cards (Map Tab) */
  worldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    padding: 16,
    marginBottom: 14,
  },
  worldCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  worldIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  worldTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  worldDesc: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 1,
  },
  worldStarsPill: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  worldStarsText: {
    fontSize: 12,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#B45309',
  },
  worldProgressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 6,
  },
  worldProgressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  worldStatusText: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },

  /* Custom Word Card */
  customWordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  customCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  customHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  customHeaderEmoji: {
    fontSize: 24,
  },
  customTitle: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  customSubtitle: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 1,
  },
  customGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  customForm: {
    flexGrow: 1,
    flexBasis: 180,
  },
  customUploadWrap: {
    flexGrow: 1,
    flexBasis: 180,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
  },
  customInput: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: colors.ink,
    marginBottom: 12,
  },
  emojiInput: {
    height: 48,
    width: 72,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    textAlign: 'center',
    fontSize: 24,
    color: colors.ink,
  },
  addWordButtonWrap: {
    marginTop: 14,
  },

  /* Custom Words Chips */
  customWordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    paddingLeft: 8,
    paddingRight: 10,
    paddingVertical: 6,
  },
  customWordChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipActive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  chipTextActive: {
    color: '#92400E',
  },
  chipRemoveBtn: {
    marginLeft: 8,
    padding: 2,
  },
  chipRemoveText: {
    fontSize: 15,
    color: colors.coral,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  libraryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 1.5,
  },
  chipCheck: {
    fontSize: 12,
  },

  /* Settings Tab */
  warnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    padding: 14,
    marginBottom: 14,
  },
  warnIcon: {
    fontSize: 22,
  },
  warnText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#92400E',
    lineHeight: 18,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    padding: 16,
    marginBottom: 14,
  },
  settingGroupTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  settingRowWrap: {
    marginBottom: 14,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: colors.ink,
    minWidth: 140,
    textAlign: 'center',
  },
  textInputSmall: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Baloo2_700Bold',
    color: colors.ink,
    width: 80,
    textAlign: 'center',
  },

  /* Age Pills */
  agePillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  agePillBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agePillBtnSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
    borderBottomColor: '#4F46E5',
  },
  agePillBtnPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 1.5,
  },
  agePillBtnText: {
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  agePillBtnTextSelected: {
    color: '#4F46E5',
  },

  /* Level Pills */
  levelPillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  levelPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
  },
  levelPillBtnSelected: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
  },
  levelPillBtnPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 1.5,
  },
  levelPillEmoji: {
    fontSize: 14,
  },
  levelPillText: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  levelPillTextSelected: {
    color: '#B45309',
  },

  /* Avatars */
  avatarsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  avatarPill: {
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
  },
  avatarPillSelected: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
  },
  avatarPillPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 1.5,
  },

  /* Switches */
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  switchTitle: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  switchSub: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 1,
  },

  /* PIN Row */
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  pinInput: {
    width: 100,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: 4,
  },
  savePinBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#5B21B6',
  },
  savePinBtnText: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Publisher Card */
  publisherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    borderBottomWidth: 3,
    borderBottomColor: '#818CF8',
    padding: 14,
    marginBottom: 14,
  },
  publisherTitle: {
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#3730A3',
  },
  publisherSub: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#6366F1',
    marginTop: 1,
  },
  publisherChevron: {
    fontSize: 18,
    color: '#4F46E5',
    fontWeight: '900',
  },

  /* Reset Button & Confirmation */
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F1',
    borderWidth: 1.5,
    borderColor: '#FFD0D4',
    borderBottomWidth: 3,
    borderBottomColor: '#FCA5A5',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  resetIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF646D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  resetIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  resetButtonTextWrap: {
    flex: 1,
  },
  resetButtonTitle: {
    color: '#A92F3C',
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  resetButtonSub: {
    color: '#A45B63',
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    marginTop: 2,
  },
  resetChevron: {
    color: '#A92F3C',
    fontSize: 26,
    fontWeight: '900',
  },

  resetConfirmCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FFD0D4',
    borderBottomWidth: 3,
    borderBottomColor: '#FCA5A5',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
  },
  resetConfirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  resetIconSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FF646D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetTitle: {
    color: '#822633',
    fontSize: 17,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  resetDescription: {
    color: '#95636A',
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 2,
  },
  resetActions: {
    flexDirection: 'row',
    gap: 8,
  },
  keepButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  confirmResetButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FF646D',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#DC2626',
  },
  confirmResetText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },

  /* Privacy Card */
  privacyCard: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1.5,
    borderColor: '#DFE9F5',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  privacyIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTitle: {
    color: '#26344D',
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  privacyText: {
    color: '#5F6B7C',
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    lineHeight: 20,
  },

  btnPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 1.5,
  },
});
