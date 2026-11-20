import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { GAMES, GameId } from '../data/extras';
import { levelInfo } from '../data/levels';
import { speak, playSfx } from '../lib/audio';
import BloomFocusPromoCard from '../components/BloomFocusPromoCard';
import HopeBridgePublisherCard from '../components/HopeBridgePublisherCard';
import ScreenShell from '../components/ScreenShell';
import Pic from '../components/Pic';
import { colors } from '../theme/colors';
import { useLayout } from '../lib/useLayout';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const stickers = useStore((s) => s.stickers);
  const mapStars = useStore((s) => s.mapStars);
  const sessions = useStore((s) => s.sessions);
  const attempts = useStore((s) => s.attempts);

  const currentLevel = profile.level;
  const currentLevelInfo = levelInfo(currentLevel);
  const { width } = useLayout();
  const compact = width < 700;

  const totalMapStars = Object.values(mapStars).reduce((sum, v) => sum + v, 0);

  const hasCompletedGame = (gameId: GameId) => {
    return (
      sessions.some((s) => s.game === gameId) ||
      attempts.some((a) => a.game === gameId && a.correct > 0)
    );
  };

  const getGameLevelDetail = (id: GameId, lvl: number) => {
    switch (id) {
      case 'spell':
        return lvl === 1 ? '3 Rounds: 🌱 3-letter CVC · ⚡ Blends · 👑 Star Boss' : '3 Rounds: 🌱 Core Words · ⚡ Power Blends · 👑 Star Boss';
      case 'pick':
        return lvl === 1 ? '3 Rounds: 🌱 First Sounds · ⚡ End Sounds · 👑 Speed Pick' : '3 Rounds: 🌱 Key Sounds · ⚡ Tricky Blends · 👑 Decoy Challenge';
      case 'sound':
        return lvl === 1 ? '3 Rounds: 🌱 3 Phonemes · ⚡ Sound Blend · 👑 Phonics Master' : '3 Rounds: 🌱 Core Sounds · ⚡ Cluster Blends · 👑 Boss Decoder';
      case 'match':
        return lvl === 1 ? '3 Rounds: 🌱 3 Cards · ⚡ 4 Picture Cards · 👑 Boss Match' : '3 Rounds: 🌱 Word Match · ⚡ Fast Cards · 👑 Boss Vocabulary';
      case 'vowel':
        return lvl === 1 ? '3 Rounds: 🌱 Middle Vowels · ⚡ 4-Letter Blends · 👑 Mystery Vowel' : '3 Rounds: 🌱 Vowel Pairs · ⚡ Long Vowels · 👑 Boss Vowels';
      case 'rhyme':
        return lvl === 1 ? '3 Rounds: 🌱 CVC Pairs · ⚡ Rhyme Families · 👑 Boss Distractor' : '3 Rounds: 🌱 Rhyme Pairs · ⚡ Sound Families · 👑 Boss Rhyme';
      case 'memory':
        return lvl === 1 ? '3 Rounds: 🌱 3 Pairs · ⚡ 4 Pairs · 👑 Master Memory' : '3 Rounds: 🌱 Pair Match · ⚡ Fast Memory · 👑 Grand Puzzle';
      default:
        return '3 Progressive Rounds with Star Boss';
    }
  };

  return (
    <ScreenShell max={compact ? 460 : 860}>
      {/* ─────────────────── PARENT CHILD DETAILS HUB ─────────────────── */}
      <View style={styles.childHub}>
        <View style={styles.childHubMain}>
          <View style={styles.avatarBox}>
            <Pic emoji={profile.avatar} size={compact ? 46 : 56} />
          </View>
          <View style={styles.childInfoBox}>
            <View style={styles.childNameRow}>
              <Text style={styles.childName} numberOfLines={1}>
                {profile.name || 'Your Child'}
              </Text>
              <View style={styles.agePill}>
                <Text style={styles.agePillText}>Age {profile.age}</Text>
              </View>
            </View>
            <Text style={styles.levelActiveBadge}>
              {currentLevelInfo.emoji} Level {currentLevel}: {currentLevelInfo.name}
            </Text>
          </View>
          <View style={styles.childActionsRow}>
            <Pressable
              onPress={() => router.push('/map')}
              style={styles.mapBtn}
              accessibilityRole="button"
              accessibilityLabel="Open Adventure Map"
            >
              <Text style={styles.mapBtnIcon}>🗺️</Text>
              <Text style={styles.mapBtnText}>Map</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/setup')}
              style={styles.editProfileBtn}
              accessibilityRole="button"
              accessibilityLabel="Edit child details"
            >
              <Text style={styles.editProfileIcon}>✏️</Text>
              <Text style={styles.editProfileText}>Edit</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Stats Pill Row */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statNum}>{totalMapStars} Stars</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statIcon}>🎁</Text>
            <Text style={styles.statNum}>{stickers.length} Stickers</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statNum}>{profile.dailyGoal}m Goal</Text>
          </View>
        </View>
      </View>

      {/* ─────────────────── CHILD'S ACTIVE LEVEL BANNER ─────────────────── */}
      <View style={styles.levelBanner}>
        <View style={styles.levelBannerHeader}>
          <Text style={styles.levelBannerEmoji}>{currentLevelInfo.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.levelBannerTitle}>
              {profile.name || 'Child'}’s Level: {currentLevelInfo.name} ({currentLevelInfo.ages})
            </Text>
            <Text style={styles.levelBannerDesc}>{currentLevelInfo.desc}</Text>
          </View>
        </View>
      </View>

      {/* ─────────────────── LEVEL-SPECIFIC ACTIVITIES ─────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🎮 Level {currentLevel} Interactive Activities</Text>
        <Text style={styles.sectionSub}>
          All 7 core games open with 3 progressive rounds for {currentLevelInfo.name} ({currentLevelInfo.ages})
        </Text>
      </View>

      <View style={[styles.grid, compact && styles.gridCompact]}>
        {GAMES.map((item) => {
          const detail = getGameLevelDetail(item.id, currentLevel);
          const isDone = hasCompletedGame(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() => {
                playSfx('tap');
                router.push(item.route as never);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${isDone ? 'Completed' : 'Play'}`}
              style={[
                styles.gameCard,
                { backgroundColor: item.color },
                isDone && styles.gameCardDone,
                compact && styles.gameCardCompact,
              ]}
            >
              <View style={[styles.gameIcon, compact && styles.gameIconCompact]}>
                <Pic
                  emoji={
                    item.id === 'spell' ? '🔤' :
                    item.id === 'pick' ? '👉' :
                    item.id === 'sound' ? '🔊' :
                    item.id === 'match' ? '🖼️' :
                    item.id === 'vowel' ? '🅰️' :
                    item.id === 'rhyme' ? '🎵' : '🧠'
                  }
                  size={compact ? 28 : 36}
                />
              </View>
              <View style={styles.gameTextBox}>
                <View style={styles.gameTitleRow}>
                  <Text style={[styles.gameTitle, compact && styles.gameTitleCompact]}>
                    {item.title}
                  </Text>
                  {isDone ? (
                    <Text style={styles.doneCheck}>✓</Text>
                  ) : null}
                </View>
                <Text style={[styles.gameDesc, compact && styles.gameDescCompact]}>
                  {detail}
                </Text>
                <View style={styles.activityBadgeRow}>
                  {isDone ? (
                    <View style={styles.activityBadgeDone}>
                      <Text style={styles.activityBadgeDoneText}>✓ Completed · Replay</Text>
                    </View>
                  ) : (
                    <View style={styles.activityBadge}>
                      <Text style={styles.activityBadgeText}>Level {currentLevel} Fit</Text>
                    </View>
                  )}
                  <View style={styles.roundBadge}>
                    <Text style={styles.roundBadgeText}>3 Rounds ➔</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <BloomFocusPromoCard onPress={() => router.push('/bloom-focus')} />
      <HopeBridgePublisherCard onPress={() => router.push('/about-hope-bridge')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  /* Child Profile Hub */
  childHub: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FDE68A',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  childHubMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: '#FEF9C3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  childInfoBox: {
    flex: 1,
  },
  childNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  childName: {
    fontSize: 24,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  agePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  agePillText: {
    fontSize: 12,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#4F46E5',
  },
  levelActiveBadge: {
    fontSize: 14,
    color: '#059669',
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    marginTop: 2,
  },
  childActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 4,
  },
  mapBtnIcon: {
    fontSize: 14,
  },
  mapBtnText: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#92400E',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 4,
  },
  editProfileIcon: {
    fontSize: 13,
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 7,
    gap: 5,
  },
  statIcon: {
    fontSize: 14,
  },
  statNum: {
    fontSize: 13,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },

  /* Section Headers */
  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  sectionSub: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 2,
  },

  /* Level Banner */
  levelBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  levelBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  levelBannerEmoji: {
    fontSize: 30,
  },
  levelBannerTitle: {
    fontSize: 17,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#065F46',
  },
  levelBannerDesc: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
    lineHeight: 17,
  },

  /* Activities Grid */
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  gridCompact: {
    gap: 10,
    marginBottom: 14,
  },
  gameCard: {
    width: '48%',
    minHeight: 110,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(43,42,82,0.10)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameCardCompact: {
    width: '100%',
    minHeight: 76,
    padding: 12,
  },
  gameIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  gameIconCompact: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginRight: 8,
  },
  gameTextBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  gameTitle: {
    fontSize: 19,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 23,
  },
  gameTitleCompact: {
    fontSize: 17,
    lineHeight: 21,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  gameDesc: {
    fontSize: 13,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    lineHeight: 16,
    marginTop: 2,
  },
  gameDescCompact: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
  },
  activityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  activityBadge: {
    backgroundColor: '#ffffffbb',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(43,42,82,0.08)',
  },
  activityBadgeText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  roundBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  roundBadgeText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#B45309',
  },
  activityProgressPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  activityProgressText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#15803D',
  },
  gameCardDone: {
    borderColor: '#86EFAC',
  },
  gameCardLocked: {
    opacity: 0.72,
    borderColor: '#CBD5E1',
  },
  gameIconLocked: {
    backgroundColor: '#E2E8F0',
  },
  gameTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneCheck: {
    fontSize: 15,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#16A34A',
  },
  gameTitleLocked: {
    color: colors.muted,
  },
  gameDescLocked: {
    color: '#94A3B8',
  },
  activityBadgeDone: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  activityBadgeDoneText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#15803D',
  },
  activityBadgeLocked: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  activityBadgeLockedText: {
    fontSize: 11,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#64748B',
  },
  browseAllGamesBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  browseAllGamesText: {
    fontSize: 14,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
});
