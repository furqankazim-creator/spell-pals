import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { AVATARS } from '../data/extras';
import { WORDS } from '../data/words';
import { ageToLevel, levelInfo } from '../data/levels';
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
  const [avatar, setAvatar] = useState(profile.avatar || '🐼');
  const [goal, setGoal] = useState(profile.dailyGoal || 10);
  const [pin, setPin] = useState('');

  const level = ageToLevel(age);
  const info = levelInfo(level);
  const sample = useMemo(
    () => shuffle(WORDS.filter((w) => w.level === level)).slice(0, 4),
    [level]
  );
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
      {/* Header */}
      <View style={styles.header}>
        <Logo width={wide ? 240 : 200} />
        <Text style={styles.title}>
          {editing ? 'Update Child Details' : 'Welcome to Spell Pals!'}
        </Text>
        <Text style={styles.headerSub}>
          {editing ? 'Customise learning difficulty & personal preferences' : 'Personalise learning, stories & reading games for your child'}
        </Text>
      </View>

      {/* Card 1: Child's Name */}
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

      {/* Card 2: Age Selection (Symmetrical 2 rows of 3 columns) */}
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
                style={({ pressed }) => [
                  styles.ageCard,
                  active && styles.ageCardActive,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${a} years old, Level ${lvl}`}
              >
                <Text style={[styles.ageNum, active && styles.textActive]}>{a}</Text>
                <Text style={[styles.ageYr, active && styles.textActive]}>years</Text>
                <View style={[styles.levelTag, active && styles.levelTagActive]}>
                  <Text style={[styles.levelTagText, active && styles.levelTagTextActive]}>
                    Lvl {lvl}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Card 3: Buddy Selection (Symmetrical 2 rows of 4 columns) */}
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
                style={({ pressed }) => [
                  styles.avCard,
                  active && styles.avCardActive,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Choose ${a} as learning buddy`}
              >
                <Pic emoji={a} size={46} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Card 4: Daily Goal */}
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
                style={({ pressed }) => [
                  styles.goalBtn,
                  active && styles.goalBtnActive,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${g} minutes daily goal`}
              >
                <Text style={[styles.goalText, active && styles.goalTextActive]}>{g} min</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Card 5: Grown-ups PIN (Optional for setup) */}
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

      {/* Card 6: Live Curriculum Preview */}
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
              <Pic emoji={w.emoji} size={42} />
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
            <BigButton
              label="Cancel & Back to Home"
              onPress={() => router.replace('/')}
              color="#FFFFFF"
            />
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
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 19,
  },

  /* Card base */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3.5,
    borderBottomColor: '#CBD5E1',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  hint: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 2,
  },

  /* Text Input */
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    color: colors.ink,
  },

  /* Symmetrical 2x3 Age Grid */
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  ageCard: {
    flexBasis: '31%',
    flexGrow: 1,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageCardActive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
  },
  cardPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1.5,
  },
  ageNum: {
    fontSize: 24,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  ageYr: {
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: -2,
  },
  levelTag: {
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  levelTagActive: {
    backgroundColor: '#FDE68A',
  },
  levelTagText: {
    fontSize: 10,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#475569',
  },
  levelTagTextActive: {
    color: '#92400E',
  },
  textActive: {
    color: '#92400E',
  },

  /* Symmetrical 2x4 Avatar Grid */
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  avCard: {
    flexBasis: '22.5%',
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avCardActive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
  },

  /* Daily Goal Row */
  goalRow: {
    flexDirection: 'row',
    gap: 8,
  },
  goalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderBottomColor: '#1D4ED8',
  },
  goalText: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  goalTextActive: {
    color: '#1D4ED8',
  },

  /* Curriculum Preview */
  previewCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderBottomWidth: 3.5,
    borderBottomColor: '#F59E0B',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#F59E0B',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  previewEmoji: {
    fontSize: 34,
  },
  previewTitle: {
    fontSize: 17,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#92400E',
  },
  previewDesc: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#78350F',
    marginTop: 2,
  },
  previewSampleTitle: {
    fontSize: 12,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#92400E',
    marginTop: 8,
    marginBottom: 8,
  },
  sampleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
  },
  sampleWordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderBottomWidth: 2.5,
    borderBottomColor: '#FDE68A',
  },
  sampleWordText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    marginTop: 4,
  },
  previewFooterNote: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#B45309',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },

  buttonWrapper: {
    marginBottom: 24,
  },
});
