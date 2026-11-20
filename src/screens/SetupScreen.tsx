import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { AVATARS } from '../data/extras';
import { WORDS } from '../data/words';
import { LEVELS, ageToLevel, levelInfo } from '../data/levels';
import { shuffle } from '../lib/game';
import { speak } from '../lib/audio';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import BigButton from '../components/BigButton';
import Pic from '../components/Pic';
import Logo from '../components/Logo';
import { useLayout } from '../lib/useLayout';

const AGES = [4, 5, 6, 7, 8, 9];
const GOALS = [5, 10, 15, 20];

/** Main set-up screen: name, age, buddy and daily goal. Everything in the app (words, games, difficulty) follows this. */
export default function SetupScreen() {
  const router = useRouter();
  const { wide, width } = useLayout();
  const compact = width < 700;
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const editing = profile.onboarded;

  const [name, setName] = useState(editing ? profile.name : '');
  const [age, setAge] = useState(editing ? profile.age : 5);
  const [avatar, setAvatar] = useState(profile.avatar || '🐼');
  const [goal, setGoal] = useState(profile.dailyGoal || 10);
  const [pin, setPin] = useState('');

  const level = ageToLevel(age);
  const info = levelInfo(level);
  const sample = useMemo(() => shuffle(WORDS.filter((w) => w.level === level)).slice(0, 4), [level]);
  const display = name.trim() || 'your child';

  const save = () => {
    const finalName = name.trim() || 'Friend';
    const newPin = /^\d{4}$/.test(pin) ? { pin } : {};
    setProfile({
      name: finalName,
      avatar,
      dailyGoal: goal,
      onboarded: true,
      age,
      level: ageToLevel(age),
      ...newPin,
    });
    speak(`Hi ${finalName}! Welcome to Spell Pals! Your starting level is ${info.name}. Let's play!`, { delay: 250 });
    router.replace('/');
  };

  return (
    <ScreenShell tabs={false} max={760}>
      <View style={styles.header}>
        <Logo width={wide ? 240 : 190} />
        <Text style={styles.title}>
          {editing ? 'Update Child Details' : 'Welcome to Spell Pals!'}
        </Text>
      </View>

      {/* Child Name */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>👤 Child’s Name</Text>
          <Text style={styles.hint}>Used in personalized stories & voice praise</Text>
        </View>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="e.g. Leo, Maya, Hadi..."
          placeholderTextColor="#9AA3C0"
          maxLength={24}
        />
      </View>

      {/* Age Selection with Level badges */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>🎂 How old is the child?</Text>
          <Text style={styles.hint}>Sets the curriculum level and reading difficulty</Text>
        </View>
        <View style={styles.ageGrid}>
          {AGES.map((a) => {
            const lvl = ageToLevel(a);
            const active = age === a;
            return (
              <Pressable
                key={a}
                onPress={() => {
                  setAge(a);
                  speak(`${a} years old. Level ${lvl}: ${levelInfo(lvl).name}`);
                }}
                style={[styles.ageCard, active ? styles.ageCardActive : null]}
                accessibilityRole="button"
              >
                <Text style={[styles.ageNum, active ? styles.textActive : null]}>{a}</Text>
                <Text style={[styles.ageYr, active ? styles.textActive : null]}>years</Text>
                <View style={[styles.levelTag, active ? styles.levelTagActive : null]}>
                  <Text style={styles.levelTagText}>Lvl {lvl}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Buddy Selection */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>🐾 Pick a Learning Buddy</Text>
          <Text style={styles.hint}>Stars alongside {display} in reading stories!</Text>
        </View>
        <View style={styles.avatarGrid}>
          {AVATARS.map((a) => {
            const active = avatar === a;
            return (
              <Pressable
                key={a}
                onPress={() => setAvatar(a)}
                style={[styles.avCard, active ? styles.avCardActive : null]}
                accessibilityRole="button"
              >
                <Pic emoji={a} size={54} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Daily Goal */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>⏱️ Daily Play Goal</Text>
          <Text style={styles.hint}>Recommended daily practice time</Text>
        </View>
        <View style={styles.goalRow}>
          {GOALS.map((g) => {
            const active = goal === g;
            return (
              <Pressable
                key={g}
                onPress={() => setGoal(g)}
                style={[styles.goalBtn, active ? styles.goalBtnActive : null]}
                accessibilityRole="button"
              >
                <Text style={[styles.goalText, active ? styles.textActive : null]}>{g} min</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Grown-ups PIN (Optional for setup) */}
      {!editing && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>🔒 Grown-ups: Choose a PIN (Optional)</Text>
            <Text style={styles.hint}>Protects parent settings & analytics. Default is 1234.</Text>
          </View>
          <TextInput
            value={pin}
            onChangeText={(v) => setPin(v.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholder="4 digits (leave blank for 1234)"
            placeholderTextColor="#9AA3C0"
            style={styles.input}
          />
        </View>
      )}

      {/* Live Curriculum Preview */}
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewEmoji}>{info.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewTitle}>
              {info.emoji} {display} will start at Level {level}: {info.name}
            </Text>
            <Text style={styles.previewDesc}>{info.desc}</Text>
          </View>
        </View>
        <Text style={styles.previewSampleTitle}>Sample words for this level:</Text>
        <View style={styles.sampleGrid}>
          {sample.map((w) => (
            <View key={w.word} style={styles.sampleWordCard}>
              <Pic emoji={w.emoji} size={48} />
              <Text style={styles.sampleWordText}>{w.word.toUpperCase()}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.previewFooterNote}>
          💡 The app adapts automatically as {display} plays, gently stepping up or down to keep learning fun.
        </Text>
      </View>

      {/* Primary Action Button */}
      <View style={styles.buttonWrapper}>
        <BigButton
          label={editing ? 'Save Changes & Return Home ✨' : "Let's Play! Go to Home 🚀"}
          icon="pencil"
          onPress={save}
          color={colors.amber}
        />
        {editing && (
          <View style={{ marginTop: 12 }}>
            <BigButton label="Cancel & Back to Home" onPress={() => router.replace('/')} color="#FFFFFF" />
          </View>
        )}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
  },
  hint: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    fontFamily: 'Baloo2_700Bold',
    color: colors.ink,
  },
  ageGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ageCard: {
    flex: 1,
    minWidth: 54,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageCardActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    transform: [{ scale: 1.04 }],
  },
  ageNum: {
    fontSize: 26,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
  },
  ageYr: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '700',
  },
  levelTag: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  levelTagActive: {
    backgroundColor: '#FDE68A',
  },
  levelTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.ink,
  },
  textActive: {
    color: '#92400E',
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avCard: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avCardActive: {
    backgroundColor: '#FEF9C3',
    borderColor: '#EAB308',
    transform: [{ scale: 1.08 }],
    shadowColor: '#EAB308',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  goalRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  goalBtn: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  goalBtnActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  goalText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },
  previewCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FDE68A',
    padding: 16,
    marginBottom: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  previewEmoji: {
    fontSize: 36,
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    color: '#92400E',
  },
  previewDesc: {
    fontSize: 13,
    color: '#78350F',
    marginTop: 2,
  },
  previewSampleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 8,
    marginBottom: 8,
  },
  sampleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    marginBottom: 10,
  },
  sampleWordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sampleWordText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
    marginTop: 4,
  },
  previewFooterNote: {
    fontSize: 12,
    color: '#B45309',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  buttonWrapper: {
    marginBottom: 24,
  },
});
