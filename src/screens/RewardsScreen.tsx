import React, { useState, useEffect } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { STICKERS } from '../data/extras';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import Pic from '../components/Pic';
import Grid from '../components/Grid';
import { useLayout } from '../lib/useLayout';
import ChildTopBar from '../components/ChildTopBar';
import { speak, playSfx, cheerWin } from '../lib/audio';

type FilterType = 'all' | 'collected' | 'locked';

export default function RewardsScreen() {
  const router = useRouter();
  const { open } = useLocalSearchParams<{ open?: string }>();
  const { wide } = useLayout();

  const profile = useStore((s) => s.profile);
  const mapStars = useStore((s) => s.mapStars);
  const stored = useStore((s) => s.stickers);
  const earnSticker = useStore((s) => s.earnSticker);

  const totalMapStars = Object.values(mapStars).reduce((sum, v) => sum + v, 0);
  const earned = stored.filter((id) => STICKERS.some((s) => s.id === id));
  const unearned = STICKERS.filter((s) => !earned.includes(s.id));

  const [filter, setFilter] = useState<FilterType>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [unboxedSticker, setUnboxedSticker] = useState<typeof STICKERS[0] | null>(null);

  // Open mystery box automatically if navigated with query ?open=box or ?open=1
  useEffect(() => {
    if (open === 'box' || open === '1' || open === 'mystery') {
      handleOpenMysteryBox();
    }
  }, [open]);

  const handleOpenMysteryBox = () => {
    playSfx('win');
    if (unearned.length > 0) {
      // Pick a random unearned sticker
      const prize = unearned[Math.floor(Math.random() * unearned.length)];
      earnSticker(prize.id);
      setUnboxedSticker(prize);
      setModalVisible(true);
      speak(`Hooray ${profile.name || 'friend'}! You opened the mystery box and won the ${prize.label}!`);
    } else {
      // All stickers collected!
      const prize = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      setUnboxedSticker(prize);
      setModalVisible(true);
      speak(`Congratulations ${profile.name || 'friend'}! You have collected every sticker in the kingdom! You are a champion!`);
    }
  };

  const handleTapSticker = (s: typeof STICKERS[0], isEarned: boolean) => {
    if (isEarned) {
      playSfx('correct');
      speak(`${s.label}! Great job!`);
    } else {
      playSfx('tap');
      speak(`This is the secret ${s.label}. Keep playing games and reading stories to unlock it!`);
    }
  };

  const displayedStickers = STICKERS.filter((s) => {
    const isEarned = earned.includes(s.id);
    if (filter === 'collected') return isEarned;
    if (filter === 'locked') return !isEarned;
    return true;
  });

  const progressPercent = Math.round((earned.length / STICKERS.length) * 100);

  return (
    <ScreenShell onBack={() => router.replace('/')} backLabel="← Back">
      <ChildTopBar />

      {/* ────────────────── HEADER HUB ────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>🎁 Treasure & Rewards</Text>
        <Text style={styles.sub}>
          Collect badges, win sparkling mystery gifts, and celebrate your spelling victories!
        </Text>
      </View>

      {/* ────────────────── STAR & STICKER SUMMARY ────────────────── */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <View style={styles.statIconWrap}>
              <Text style={{ fontSize: 26 }}>⭐</Text>
            </View>
            <View>
              <Text style={styles.statNumber}>{totalMapStars}</Text>
              <Text style={styles.statLabel}>Adventure Stars</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <View style={[styles.statIconWrap, { backgroundColor: '#F3E8FF' }]}>
              <Text style={{ fontSize: 26 }}>🏆</Text>
            </View>
            <View>
              <Text style={styles.statNumber}>
                {earned.length}/{STICKERS.length}
              </Text>
              <Text style={styles.statLabel}>Badges Won</Text>
            </View>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressPercent}% Collection Complete</Text>
        </View>
      </View>

      {/* ────────────────── INTERACTIVE MYSTERY REWARD BOX ────────────────── */}
      <View style={styles.mysteryBoxCard}>
        <View style={styles.mysteryContent}>
          <View style={styles.mysteryIconBadge}>
            <Text style={{ fontSize: 44 }}>🎁</Text>
          </View>
          <View style={styles.mysteryTextBox}>
            <View style={styles.mysteryPill}>
              <Text style={styles.mysteryPillText}>✨ MYSTERY GIFT CHEST</Text>
            </View>
            <Text style={styles.mysteryTitle}>Unwrap a Mystery Reward!</Text>
            <Text style={styles.mysterySub}>
              {unearned.length > 0
                ? `${unearned.length} secret surprise badges waiting to be discovered!`
                : 'All secret badges unlocked! Open for bonus celebration!'}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleOpenMysteryBox}
          style={styles.openBoxBtn}
          accessibilityRole="button"
          accessibilityLabel="Open Mystery Reward Box"
        >
          <Text style={styles.openBoxIcon}>🎁</Text>
          <Text style={styles.openBoxText}>Open Mystery Box!</Text>
          <Text style={styles.openBoxSparkle}>✨</Text>
        </Pressable>
      </View>

      {/* ────────────────── FILTER TABS ────────────────── */}
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter('all')}
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          accessibilityRole="button"
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            🌟 All ({STICKERS.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter('collected')}
          style={[styles.filterTab, filter === 'collected' && styles.filterTabActive]}
          accessibilityRole="button"
        >
          <Text style={[styles.filterTabText, filter === 'collected' && styles.filterTabTextActive]}>
            🏆 Won ({earned.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter('locked')}
          style={[styles.filterTab, filter === 'locked' && styles.filterTabActive]}
          accessibilityRole="button"
        >
          <Text style={[styles.filterTabText, filter === 'locked' && styles.filterTabTextActive]}>
            🔒 Secret ({unearned.length})
          </Text>
        </Pressable>
      </View>

      {/* ────────────────── STICKER ALBUM GRID ────────────────── */}
      <View style={{ marginTop: 6, marginBottom: 24 }}>
        <Grid cols={wide ? 6 : 3} gap={wide ? 16 : 10}>
          {displayedStickers.map((s) => {
            const isEarned = earned.includes(s.id);
            return (
              <Pressable
                key={s.id}
                onPress={() => handleTapSticker(s, isEarned)}
                style={[
                  styles.cell,
                  isEarned ? styles.cellEarned : styles.cellLocked,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${isEarned ? s.label : 'Locked Badge'}`}
              >
                <View style={styles.badgeWrap}>
                  {isEarned ? (
                    <Pic emoji={s.emoji} size={wide ? 68 : 56} />
                  ) : (
                    <View style={styles.lockedIconWrap}>
                      <Text style={{ fontSize: wide ? 38 : 32, opacity: 0.35 }}>🔒</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.label, !isEarned && styles.labelLocked]} numberOfLines={2}>
                  {isEarned ? s.label : '??? Secret'}
                </Text>

                {isEarned ? (
                  <View style={styles.starBadge}>
                    <Text style={styles.starBadgeText}>⭐ Unlocked</Text>
                  </View>
                ) : (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>Tap for clue</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </Grid>
      </View>

      {/* ────────────────── UNBOXING CELEBRATION MODAL ────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalSparkleTop}>🎉 ✨ 🎊</Text>
            <View style={styles.modalPrizeWrap}>
              <Pic emoji={unboxedSticker?.emoji || '⭐'} size={96} />
            </View>

            <Text style={styles.modalTitle}>New Badge Unlocked!</Text>
            <Text style={styles.modalPrizeName}>{unboxedSticker?.label}</Text>
            <Text style={styles.modalSub}>
              Awesome job, {profile.name || 'Super Speller'}! This shiny badge has been added to your trophy album!
            </Text>

            <Pressable
              onPress={() => {
                playSfx('correct');
                setModalVisible(false);
              }}
              style={styles.modalClaimBtn}
              accessibilityRole="button"
            >
              <Text style={styles.modalClaimBtnText}>⭐ Place in My Trophy Album!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 14 },
  title: {
    fontSize: 28,
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
    lineHeight: 19,
  },

  /* Stats Card */
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  statDivider: {
    width: 1.5,
    height: 36,
    backgroundColor: '#F1F5F9',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 999,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    textAlign: 'center',
  },

  /* Mystery Box Card */
  mysteryBoxCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FDE68A',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mysteryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  mysteryIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  mysteryTextBox: {
    flex: 1,
  },
  mysteryPill: {
    backgroundColor: '#FEF08A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  mysteryPillText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#854D0E',
  },
  mysteryTitle: {
    fontSize: 18,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  mysterySub: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#78350F',
    marginTop: 2,
    lineHeight: 16,
  },
  openBoxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: '#B45309',
  },
  openBoxIcon: {
    fontSize: 20,
  },
  openBoxText: {
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  openBoxSparkle: {
    fontSize: 18,
  },

  /* Filter Tabs */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  filterTabText: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#4F46E5',
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },

  /* Sticker Album Grid */
  cell: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cellEarned: {
    borderColor: '#E2E8F0',
  },
  cellLocked: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },
  badgeWrap: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  lockedIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 16,
  },
  labelLocked: {
    color: '#94A3B8',
  },
  starBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  starBadgeText: {
    fontSize: 10,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#92400E',
  },
  lockedBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  lockedBadgeText: {
    fontSize: 10,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#64748B',
  },

  /* Celebration Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  modalSparkleTop: {
    fontSize: 32,
    marginBottom: 8,
  },
  modalPrizeWrap: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: '#FFFBEB',
    borderWidth: 3,
    borderColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#D97706',
    marginBottom: 4,
  },
  modalPrizeName: {
    fontSize: 26,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalClaimBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#B45309',
  },
  modalClaimBtnText: {
    fontSize: 16,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
