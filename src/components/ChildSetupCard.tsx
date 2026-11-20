import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useStore } from '../store/useStore';
import { AVATARS } from '../data/extras';
import { WORDS } from '../data/words';
import { LEVELS, ageToLevel, levelInfo } from '../data/levels';
import { shuffle } from '../lib/game';
import { speak } from '../lib/audio';
import { colors } from '../theme/colors';
import Pic from './Pic';

const AGES = [4, 5, 6, 7, 8, 9];
const GOALS = [5, 10, 15, 20];

interface Props {
  onSaved?: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export default function ChildSetupCard({ onSaved, onCancel, title, subtitle }: Props) {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);

  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(profile.age || 5);
  const [avatar, setAvatar] = useState(profile.avatar || '🐼');
  const [goal, setGoal] = useState(profile.dailyGoal || 10);

  const level = ageToLevel(age);
  const info = levelInfo(level);
  const sampleWords = useMemo(
    () => shuffle(WORDS.filter((w) => w.level === level)).slice(0, 4),
    [level]
  );

  const handleAgeChange = (selectedAge: number) => {
    setAge(selectedAge);
    speak(`${selectedAge} years old. Level ${ageToLevel(selectedAge)}: ${levelInfo(ageToLevel(selectedAge)).name}`);
  };

  const handleSave = () => {
    const finalName = name.trim() || 'Champion';
    const newLevel = ageToLevel(age);
    setProfile({
      name: finalName,
      age,
      level: newLevel,
      avatar,
      dailyGoal: goal,
      onboarded: true,
    });
    speak(`Welcome ${finalName}! Let us start Level ${newLevel}: ${levelInfo(newLevel).name}!`, { delay: 200 });
    if (onSaved) onSaved();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 28 }}>👨‍👩‍👧</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title || 'Parent Setup: Child Learning Profile'}</Text>
          <Text style={styles.subtitle}>
            {subtitle || 'Set your child’s info so activities and stories fit their exact reading level.'}
          </Text>
        </View>
      </View>

      {/* Name Field */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>👤 Child’s Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Leo, Maya, Hadi..."
          placeholderTextColor="#9AA3C0"
          style={styles.input}
          maxLength={24}
        />
      </View>

      {/* Age Selector */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>🎂 How old is the child?</Text>
        <Text style={styles.fieldHint}>Select age to automatically match words and stories to their grade level.</Text>
        <View style={styles.ageGrid}>
          {AGES.map((a) => {
            const lvl = ageToLevel(a);
            const active = age === a;
            return (
              <Pressable
                key={a}
                onPress={() => handleAgeChange(a)}
                style={[styles.ageButton, active ? styles.ageButtonActive : null]}
                accessibilityRole="button"
              >
                <Text style={[styles.ageNumber, active ? styles.textActive : null]}>{a}</Text>
                <Text style={[styles.ageLabel, active ? styles.textActive : null]}>yrs</Text>
                <View style={[styles.levelMiniBadge, active ? styles.levelMiniBadgeActive : null]}>
                  <Text style={styles.levelMiniText}>Lvl {lvl}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Buddy Avatar Picker */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>🐾 Choose a Learning Buddy</Text>
        <Text style={styles.fieldHint}>This buddy will guide your child through stories and praise their spelling!</Text>
        <View style={styles.avatarGrid}>
          {AVATARS.map((a) => {
            const active = avatar === a;
            return (
              <Pressable
                key={a}
                onPress={() => setAvatar(a)}
                style={[styles.avatarButton, active ? styles.avatarButtonActive : null]}
                accessibilityRole="button"
              >
                <Pic emoji={a} size={48} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Daily Goal */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>⏱️ Daily Play Goal</Text>
        <View style={styles.goalRow}>
          {GOALS.map((g) => {
            const active = goal === g;
            return (
              <Pressable
                key={g}
                onPress={() => setGoal(g)}
                style={[styles.goalButton, active ? styles.goalButtonActive : null]}
                accessibilityRole="button"
              >
                <Text style={[styles.goalText, active ? styles.textActive : null]}>{g} min / day</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Live Curriculum Preview Box */}
      <View style={styles.curriculumPreview}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewEmoji}>{info.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewTitle}>Level {level}: {info.name}</Text>
            <Text style={styles.previewDesc}>{info.desc}</Text>
          </View>
        </View>
        <Text style={styles.sampleHeading}>Sample words for this level:</Text>
        <View style={styles.sampleRow}>
          {sampleWords.map((w) => (
            <View key={w.word} style={styles.sampleCard}>
              <Pic emoji={w.emoji} size={44} />
              <Text style={styles.sampleWordText}>{w.word.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {onCancel ? (
          <Pressable onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={handleSave} style={[styles.saveBtn, !onCancel && { flex: 1 }]}>
          <Text style={styles.saveBtnText}>Save & Apply Level ✨</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 14,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  fieldSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
    marginBottom: 6,
  },
  fieldHint: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
  },
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
  ageGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ageButton: {
    flex: 1,
    minWidth: 54,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  ageNumber: {
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
  },
  ageLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '700',
  },
  levelMiniBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  levelMiniBadgeActive: {
    backgroundColor: '#FDE68A',
  },
  levelMiniText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.ink,
  },
  textActive: {
    color: '#92400E',
  },
  avatarGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarButton: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonActive: {
    backgroundColor: '#FEF9C3',
    borderColor: '#EAB308',
    transform: [{ scale: 1.05 }],
  },
  goalRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  goalButton: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  goalButtonActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  curriculumPreview: {
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    padding: 14,
    marginBottom: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  previewEmoji: {
    fontSize: 32,
  },
  previewTitle: {
    fontSize: 17,
    fontFamily: 'Baloo2_800ExtraBold',
    color: '#92400E',
  },
  previewDesc: {
    fontSize: 13,
    color: '#78350F',
  },
  sampleHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 6,
    marginBottom: 6,
  },
  sampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 6,
  },
  sampleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    alignItems: 'center',
    minWidth: 64,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  sampleWordText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.ink,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.muted,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 18,
    backgroundColor: '#F59E0B',
    borderBottomWidth: 4,
    borderBottomColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
