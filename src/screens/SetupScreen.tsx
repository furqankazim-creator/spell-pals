import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const { wide } = useLayout();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const editing = profile.onboarded;
  const [name, setName] = useState(editing ? profile.name : '');
  const [age, setAge] = useState(editing ? profile.age : 5);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [goal, setGoal] = useState(profile.dailyGoal);
  const [pin, setPin] = useState('');

  const level = ageToLevel(age);
  const info = levelInfo(level);
  const sample = useMemo(() => shuffle(WORDS.filter((w) => w.level === level)).slice(0, 4), [level]);
  const display = name.trim() || 'your child';

  const save = () => {
    const finalName = name.trim() || 'Friend';
    const newPin = /^\d{4}$/.test(pin) ? { pin } : {};
    setProfile({ name: finalName, avatar, dailyGoal: goal, onboarded: true, age, level: ageToLevel(age), ...newPin });
    speak(`Hi ${finalName}! Let us start. Your level is ${info.name}.`, { delay: 300 });
    router.replace('/');
  };

  return (
    <ScreenShell tabs={false} max={760}>
      {wide ? null : <Logo width={200} />}
      <Text style={styles.title}>{editing ? 'About me' : 'Welcome to Spell Pals!'}</Text>
      <Text style={styles.lead}>{editing ? 'Change anything below. The words and games will fit.' : 'Tell us about the player so the words fit just right.'}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>👤 What is your name?</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Type your name" placeholderTextColor="#9AA3C0" maxLength={20} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🎂 How old are you?</Text>
        <View style={styles.ageRow}>
          {AGES.map((a) => (
            <Pressable key={a} onPress={() => { setAge(a); speak(`${a} years old`); }} style={[styles.age, age === a ? styles.ageOn : null]} accessibilityRole="button">
              <Text style={[styles.ageNum, age === a ? styles.ageNumOn : null]}>{a}</Text>
              <Text style={[styles.ageYr, age === a ? styles.ageNumOn : null]}>years</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🐾 Pick your buddy</Text>
        <View style={styles.avatars}>
          {AVATARS.map((a) => (
            <Pressable key={a} onPress={() => setAvatar(a)} style={[styles.av, avatar === a ? styles.avOn : null]} accessibilityRole="button">
              <Pic emoji={a} size={52} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>⏱️ Play goal each day</Text>
        <View style={styles.goals}>
          {GOALS.map((g) => (
            <Pressable key={g} onPress={() => setGoal(g)} style={[styles.goal, goal === g ? styles.ageOn : null]} accessibilityRole="button">
              <Text style={[styles.goalText, goal === g ? styles.ageNumOn : null]}>{g} min</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {!editing ? (
        <View style={styles.card}>
          <Text style={styles.label}>🔒 Grown-ups: choose a PIN</Text>
          <Text style={styles.pinHint}>A parent or teacher enters this 4-number PIN to open the Grown-ups area. Leave it empty to use 1234 (you can change it later).</Text>
          <TextInput
            value={pin}
            onChangeText={(v) => setPin(v.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholder="4 numbers"
            placeholderTextColor="#9AA3C0"
            style={styles.input}
          />
        </View>
      ) : null}

      <View style={[styles.card, styles.preview]}>
        <Text style={styles.previewTitle}>{info.emoji} {display} starts at Level {level}: {info.name}</Text>
        <Text style={styles.previewSub}>{info.desc}</Text>
        <View style={styles.sample}>
          {sample.map((w) => (
            <View key={w.word} style={styles.sampleItem}>
              <Pic emoji={w.emoji} size={64} />
              <Text style={styles.sampleWord}>{w.word}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.previewSub}>
          Levels: {LEVELS.map((l) => `${l.level} ${l.name}`).join(' · ')}. The level moves up or down by itself as {display} plays.
        </Text>
      </View>

      <BigButton label={editing ? 'Save' : "Let's play!"} icon="pencil" onPress={save} color={colors.amber} />
      {editing ? (
        <>
          <View style={{ height: 10 }} />
          <BigButton label="Back" onPress={() => router.back()} color="#fff" />
        </>
      ) : null}
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 32, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, textAlign: 'center', marginTop: 8 },
  lead: { fontSize: 16, color: colors.ink, textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 16, marginBottom: 12 },
  label: { fontSize: 19, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink, marginBottom: 10 },
  input: { backgroundColor: '#F4FAFF', borderRadius: 18, padding: 14, fontSize: 22, color: colors.ink },
  ageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  age: { width: 84, height: 84, borderRadius: 22, backgroundColor: '#F4FAFF', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 4, borderBottomColor: '#DCE8F5' },
  ageOn: { backgroundColor: '#FFC93C', borderBottomColor: '#E0A820' },
  ageNum: { fontSize: 34, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  ageYr: { fontSize: 13, color: colors.muted },
  ageNumOn: { color: colors.ink },
  avatars: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  av: { width: 68, height: 68, borderRadius: 20, backgroundColor: '#F4FAFF', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  avOn: { borderColor: '#FFC93C', backgroundColor: '#FFF6D6' },
  goals: { flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
  goal: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18, backgroundColor: '#F4FAFF', borderBottomWidth: 4, borderBottomColor: '#DCE8F5' },
  goalText: { fontSize: 18, fontWeight: '900', color: colors.ink },
  preview: { backgroundColor: '#FFF6D6' },
  pinHint: { fontSize: 13, color: colors.muted, marginBottom: 8 },
  previewTitle: { fontSize: 19, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  previewSub: { fontSize: 14, color: colors.ink, marginTop: 4 },
  sample: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 },
  sampleItem: { alignItems: 'center' },
  sampleWord: { fontSize: 15, fontWeight: '900', color: colors.ink, marginTop: 2 },
});
