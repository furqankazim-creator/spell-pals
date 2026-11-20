import React, { useEffect, useState, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions, ScrollView } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import {
  MAP_WORLDS,
  getStagesForLevel,
  isStageUnlocked,
  getCurrentLockIndex,
  MapStage,
} from '../data/mapStages';
import { speak, playSfx } from '../lib/audio';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import BigButton from '../components/BigButton';
import Pic from '../components/Pic';

const X_PATTERN = [0.5, 0.22, 0.78, 0.25, 0.75, 0.23, 0.77, 0.26, 0.74, 0.5];
const TOP = 96;
const GAP = 120;
const PANEL_H = TOP + GAP * 9 + 44 + 80;

/** Background scenery for a world panel */
function WorldArt({ kind, w, h }: { kind: 'hills' | 'mountains' | 'beach'; w: number; h: number }) {
  const cloud = (cx: number, cy: number, k = 1) => (
    <React.Fragment key={`${cx}-${cy}`}>
      <Ellipse cx={cx} cy={cy} rx={30 * k} ry={12 * k} fill="#fff" opacity={0.75} />
      <Ellipse cx={cx - 18 * k} cy={cy + 4 * k} rx={18 * k} ry={9 * k} fill="#fff" opacity={0.75} />
      <Ellipse cx={cx + 20 * k} cy={cy + 5 * k} rx={20 * k} ry={9 * k} fill="#fff" opacity={0.75} />
    </React.Fragment>
  );

  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill} pointerEvents="none">
      {kind === 'hills' ? (
        <>
          <Circle cx={w - 56} cy={70} r={30} fill="#FFE27A" opacity={0.9} />
          {cloud(70, 84)}
          {cloud(w * 0.55, 140, 0.8)}
          <Path
            d={`M0 ${h - 90} Q ${w * 0.25} ${h - 150} ${w * 0.5} ${h - 95} T ${w} ${h - 110} V ${h} H 0 Z`}
            fill="#B9E5A5"
            opacity={0.8}
          />
          <Path
            d={`M0 ${h - 50} Q ${w * 0.3} ${h - 100} ${w * 0.6} ${h - 55} T ${w} ${h - 70} V ${h} H 0 Z`}
            fill="#9ED98A"
          />
        </>
      ) : null}
      {kind === 'mountains' ? (
        <>
          <Circle cx={w - 60} cy={72} r={24} fill="#fff" opacity={0.85} />
          <Circle cx={w - 52} cy={66} r={22} fill="#EDE6FF" />
          {[[40, 90], [w * 0.35, 130], [w * 0.7, 100], [w - 30, 160], [24, 220]].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.9} />
          ))}
          <Path
            d={`M0 ${h - 40} L ${w * 0.18} ${h - 150} L ${w * 0.34} ${h - 60} L ${w * 0.52} ${h - 170} L ${w * 0.72} ${h - 70} L ${w * 0.88} ${h - 140} L ${w} ${h - 60} V ${h} H 0 Z`}
            fill="#C9B8FF"
            opacity={0.85}
          />
          <Path
            d={`M0 ${h - 20} L ${w * 0.25} ${h - 90} L ${w * 0.45} ${h - 30} L ${w * 0.68} ${h - 100} L ${w} ${h - 30} V ${h} H 0 Z`}
            fill="#B39DFF"
          />
        </>
      ) : null}
      {kind === 'beach' ? (
        <>
          <Circle cx={w - 56} cy={70} r={30} fill="#FFD24D" opacity={0.95} />
          {cloud(80, 84, 0.9)}
          <Path
            d={`M0 ${h - 90} Q ${w * 0.2} ${h - 110} ${w * 0.4} ${h - 88} T ${w * 0.8} ${h - 92} T ${w} ${h - 84} V ${h} H 0 Z`}
            fill="#8ED8F0"
            opacity={0.85}
          />
          <Path
            d={`M0 ${h - 55} Q ${w * 0.2} ${h - 75} ${w * 0.4} ${h - 53} T ${w * 0.8} ${h - 57} T ${w} ${h - 50} V ${h} H 0 Z`}
            fill="#6CC8EA"
          />
          <Path
            d={`M0 ${h - 22} Q ${w * 0.25} ${h - 40} ${w * 0.5} ${h - 20} T ${w} ${h - 24} V ${h} H 0 Z`}
            fill="#F7D98B"
          />
        </>
      ) : null}
    </Svg>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const stars = useStore((s) => s.mapStars);
  const profile = useStore((s) => s.profile);
  const W = Math.min(width - (width >= 900 ? 48 : 32), 520);

  // Focus exclusively on the level selected for the child on the main page
  const worldIndex = Math.min(Math.max(profile.level - 1, 0), MAP_WORLDS.length - 1);
  const world = MAP_WORLDS[worldIndex];
  const stages: MapStage[] = useMemo(() => getStagesForLevel(world.level), [world.level]);

  const activeLockIdx = useMemo(() => getCurrentLockIndex(stars, stages), [stars, stages]);
  const totalStarsInWorld = useMemo(
    () => stages.reduce((n, s) => n + (stars[s.id] ?? 0), 0),
    [stages, stars]
  );
  const locksOpened = useMemo(
    () => stages.filter((s) => (stars[s.id] ?? 0) > 0).length,
    [stages, stars]
  );

  const openQuest = (stage: MapStage) => {
    const unlocked = isStageUnlocked(stage.lockNumber, stars, stages);
    if (!unlocked) {
      playSfx('wrong');
      speak(`Lock ${stage.lockNumber} is locked! Finish Lock ${stage.lockNumber - 1} first.`);
      return;
    }
    playSfx('tap');
    router.push({
      pathname: '/quest',
      params: { stage: stage.id, level: `${world.level}` },
    } as never);
  };

  // Node coordinates inside the panel
  const pts = stages.map((s, idx) => ({
    x: X_PATTERN[idx] * (W - 140) + 70,
    y: TOP + idx * GAP + 44,
  }));

  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const m = (b.y - a.y) / 2;
    return ` C ${a.x} ${a.y + m} ${b.x} ${b.y - m} ${b.x} ${b.y}`;
  };

  let fullPath = `M ${pts[0].x} ${pts[0].y}`;
  let goldPath = fullPath;
  for (let i = 1; i < pts.length; i++) {
    const seg = curve(pts[i - 1], pts[i]);
    fullPath += seg;
    if (i <= activeLockIdx) {
      goldPath += seg;
    }
  }

  return (
    <ScreenShell max={560} onBack={() => router.replace('/')} backLabel="← Back">
      <View>
        <Text style={styles.title}>🗺️ 10 Locks Adventure Map</Text>
        <Text style={styles.sub}>
          Conquer each lock in {world.name} to crack the trail and earn all 30 stars!
        </Text>
      </View>

      {/* Summary Box */}
      <View style={styles.summary}>
        <View style={styles.sumBox}>
          <Pic emoji="⭐" size={32} />
          <Text style={styles.sumNum}>
            {totalStarsInWorld}
            <Text style={styles.sumOf}> / 30</Text>
          </Text>
          <Text style={styles.sumLabel}>stars</Text>
        </View>
        <View style={styles.sumBox}>
          <Pic emoji="🔓" size={32} />
          <Text style={styles.sumNum}>
            {locksOpened}
            <Text style={styles.sumOf}> / 10</Text>
          </Text>
          <Text style={styles.sumLabel}>locks open</Text>
        </View>
        <View style={{ flex: 1.4 }}>
          <BigButton
            label={locksOpened === 0 ? 'Start Lock 1!' : locksOpened === 10 ? 'Replay' : `Continue Lock ${activeLockIdx + 1}`}
            onPress={() => openQuest(stages[activeLockIdx])}
            color={colors.amber}
          />
        </View>
      </View>

      {/* Focused Level Realm Hero Card (Only the active level selected on the main page) */}
      <View style={[styles.realmShowcaseCard, { borderColor: world.accent }]}>
        <LinearGradient colors={world.cardGrad} style={StyleSheet.absoluteFill} />
        <View style={styles.realmShowcaseAvatar}>
          <Pic emoji={world.pic} size={64} />
        </View>
        <View style={styles.realmShowcaseInfo}>
          <View style={styles.realmLevelTagRow}>
            <View style={styles.realmLevelTag}>
              <Text style={styles.realmLevelTagText}>LEVEL {world.level}</Text>
            </View>
            <View style={styles.realmActivePill}>
              <Text style={styles.realmActivePillText}>🎯 Active Level</Text>
            </View>
          </View>
          <Text style={[styles.realmShowcaseTitle, { color: world.dark }]}>
            {world.emoji} {world.name}
          </Text>
          <Text style={styles.realmShowcaseDesc}>{world.desc}</Text>
        </View>
      </View>

      {/* 10-Locks Winding Adventure Trail Panel */}
      <View style={[styles.panel, { width: W, height: PANEL_H, borderColor: world.accent }]}>
        <LinearGradient colors={world.grad} style={StyleSheet.absoluteFill} />
        <WorldArt kind={world.art} w={W - 8} h={PANEL_H - 8} />

        {/* Panel Header */}
        <View style={styles.panelTitle}>
          <Text style={[styles.panelName, { color: world.dark }]}>
            {world.emoji} {world.name} (Level {world.level})
          </Text>
          <Text style={styles.panelDesc}>{world.desc}</Text>
        </View>

        {/* Path SVG */}
        <Svg width={W} height={PANEL_H} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Path
            d={fullPath}
            stroke="#FFFFFF"
            strokeOpacity={0.95}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={fullPath}
            stroke="#CBD5E1"
            strokeWidth={4}
            strokeDasharray="1 14"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={goldPath}
            stroke="#F59E0B"
            strokeWidth={12}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        {/* Scenery Decorations along the path */}
        {stages.map((s, k) => {
          const p = pts[k];
          const left = p.x < W / 2;
          return (
            <View
              key={`deco-${s.id}`}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: left ? W - 78 : 14,
                top: p.y - 24,
              }}
            >
              <Pic emoji={world.deco[k % world.deco.length]} size={s.boss ? 56 : 46} />
            </View>
          );
        })}

        {/* 10 Lock Nodes */}
        {stages.map((s, k) => {
          const p = pts[k];
          const r = s.boss ? 56 : 46;
          const got = stars[s.id] ?? 0;
          const unlocked = isStageUnlocked(s.lockNumber, stars, stages);
          const isCur = k === activeLockIdx && unlocked;
          const nodeLeft = p.x < W / 2;

          return (
            <View
              key={s.id}
              style={{
                position: 'absolute',
                left: p.x - 70,
                top: p.y - r,
                width: 140,
                alignItems: 'center',
              }}
            >
              {/* "You are here!" badge */}
              {isCur ? (
                <View
                  style={[
                    styles.hereBadge,
                    nodeLeft ? { left: 70 + r + 6 } : { right: 70 + r + 6 },
                  ]}
                >
                  <View style={styles.hereAvatar}>
                    <Pic emoji={profile.avatar || '🐼'} size={36} />
                  </View>
                  <Text style={styles.hereText}>You are here!</Text>
                </View>
              ) : null}

              {/* Lock Node Button */}
              <Pressable
                onPress={() => openQuest(s)}
                accessibilityRole="button"
                accessibilityLabel={`Lock ${s.lockNumber}, ${s.title}, ${unlocked ? `${got} stars` : 'locked'}`}
                style={[
                  styles.node,
                  { width: r * 2, height: r * 2, borderRadius: r },
                  got > 0
                    ? styles.nodeCleared
                    : unlocked
                    ? { backgroundColor: '#FFFFFF', borderColor: world.accent }
                    : styles.nodeLocked,
                  isCur && styles.nodeCurrent,
                ]}
              >
                <Pic emoji={unlocked ? s.character : '🔒'} size={unlocked ? (s.boss ? 60 : 48) : 44} />

                {/* Lock Badge Pill on the node */}
                <View
                  style={[
                    styles.lockPill,
                    { backgroundColor: unlocked ? (s.boss ? '#D97706' : world.accent) : '#94A3B8' },
                  ]}
                >
                  <Text style={styles.lockPillText}>
                    {s.boss ? '👑 10' : `${s.lockNumber}`}
                  </Text>
                </View>
              </Pressable>

              {/* 3 Adventure Stars */}
              <View style={styles.starRow}>
                {[1, 2, 3].map((n) => (
                  <View key={n} style={{ opacity: n <= got ? 1 : 0.25 }}>
                    <Pic emoji="⭐" size={20} />
                  </View>
                ))}
              </View>

              {/* Quest Title Label */}
              <Text
                style={[
                  styles.nodeTitle,
                  !unlocked && { opacity: 0.55 },
                  s.boss && styles.nodeTitleBoss,
                ]}
                numberOfLines={1}
              >
                {s.boss ? `👑 ${s.title}` : `Lock ${s.lockNumber}: ${s.title}`}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.footerNote}>
        Every lock features level-specific story quests for Level {world.level} ({world.name}).
      </Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  sub: {
    fontSize: 14,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },

  summary: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    alignItems: 'stretch',
  },
  sumBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  sumNum: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  sumOf: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },
  sumLabel: {
    fontSize: 11,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
  },

  realmShowcaseCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  realmShowcaseAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  realmShowcaseInfo: {
    flex: 1,
  },
  realmLevelTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  realmLevelTag: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  realmLevelTagText: {
    fontSize: 10,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: 'rgba(43,42,82,0.85)',
  },
  realmActivePill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  realmActivePillText: {
    fontSize: 10,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  realmShowcaseTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    marginTop: 2,
  },
  realmShowcaseDesc: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 16,
    marginTop: 2,
  },

  panel: {
    alignSelf: 'center',
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 4,
    shadowColor: '#5B8DB8',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  panelTitle: {
    position: 'absolute',
    top: 14,
    left: 18,
    right: 18,
  },
  panelName: {
    fontSize: 20,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
  },
  panelDesc: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.ink,
    marginTop: 1,
  },

  node: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderBottomWidth: 9,
    shadowColor: '#3B4BDB',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  nodeCleared: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  nodeLocked: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  nodeCurrent: {
    borderColor: '#EF4444',
    transform: [{ scale: 1.1 }],
  },
  lockPill: {
    position: 'absolute',
    top: -8,
    left: -8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockPillText: {
    fontSize: 12,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  starRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 6,
  },
  nodeTitle: {
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.ink,
    marginTop: 3,
    textAlign: 'center',
  },
  nodeTitleBoss: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: '#B45309',
  },

  hereBadge: {
    position: 'absolute',
    top: 18,
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 3,
    shadowColor: '#3B4BDB',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 5,
  },
  hereAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hereText: {
    fontSize: 12,
    fontFamily: 'Baloo2_800ExtraBold',
    fontWeight: '800',
    color: colors.ink,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Baloo2_700Bold',
    fontWeight: '700',
    color: colors.muted,
    marginTop: 14,
  },
});
