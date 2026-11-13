import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { STAGES, WORLDS, currentStageIndex, isUnlocked } from '../data/mapStages';
import { GAME_ICONS } from '../components/AppIcon';
import { speak, playSfx } from '../lib/audio';
import { colors } from '../theme/colors';
import ScreenShell from '../components/ScreenShell';
import BigButton from '../components/BigButton';
import Pic from '../components/Pic';

const BOSS_PIC = ['🐉', '🧙', '👑'];
const X_PATTERN = [0.5, 0.24, 0.74, 0.3, 0.5];
const TOP = 96;          // space above the first stage (world title)
const GAP = 132;         // distance between stages
const PANEL_H = TOP + GAP * 4 + 44 + 110;

/** Background scenery for a world panel (drawn behind the path). */
function WorldArt({ kind, w, h }: { kind: 'hills' | 'mountains' | 'beach'; w: number; h: number }) {
  const cloud = (cx: number, cy: number, k = 1) => (
    <>
      <Ellipse cx={cx} cy={cy} rx={30 * k} ry={12 * k} fill="#fff" opacity={0.75} />
      <Ellipse cx={cx - 18 * k} cy={cy + 4 * k} rx={18 * k} ry={9 * k} fill="#fff" opacity={0.75} />
      <Ellipse cx={cx + 20 * k} cy={cy + 5 * k} rx={20 * k} ry={9 * k} fill="#fff" opacity={0.75} />
    </>
  );
  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill} pointerEvents="none">
      {kind === 'hills' ? (
        <>
          <Circle cx={w - 56} cy={70} r={30} fill="#FFE27A" opacity={0.9} />
          {cloud(70, 84)}
          {cloud(w * 0.55, 140, 0.8)}
          <Path d={`M0 ${h - 90} Q ${w * 0.25} ${h - 150} ${w * 0.5} ${h - 95} T ${w} ${h - 110} V ${h} H 0 Z`} fill="#B9E5A5" opacity={0.8} />
          <Path d={`M0 ${h - 50} Q ${w * 0.3} ${h - 100} ${w * 0.6} ${h - 55} T ${w} ${h - 70} V ${h} H 0 Z`} fill="#9ED98A" />
        </>
      ) : null}
      {kind === 'mountains' ? (
        <>
          <Circle cx={w - 60} cy={72} r={24} fill="#fff" opacity={0.85} />
          <Circle cx={w - 52} cy={66} r={22} fill="#EDE6FF" />
          {[[40, 90], [w * 0.35, 130], [w * 0.7, 100], [w - 30, 160], [24, 220]].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.9} />
          ))}
          <Path d={`M0 ${h - 40} L ${w * 0.18} ${h - 150} L ${w * 0.34} ${h - 60} L ${w * 0.52} ${h - 170} L ${w * 0.72} ${h - 70} L ${w * 0.88} ${h - 140} L ${w} ${h - 60} V ${h} H 0 Z`} fill="#C9B8FF" opacity={0.85} />
          <Path d={`M0 ${h - 20} L ${w * 0.25} ${h - 90} L ${w * 0.45} ${h - 30} L ${w * 0.68} ${h - 100} L ${w} ${h - 30} V ${h} H 0 Z`} fill="#B39DFF" />
        </>
      ) : null}
      {kind === 'beach' ? (
        <>
          <Circle cx={w - 56} cy={70} r={30} fill="#FFD24D" opacity={0.95} />
          {cloud(80, 84, 0.9)}
          <Path d={`M0 ${h - 90} Q ${w * 0.2} ${h - 110} ${w * 0.4} ${h - 88} T ${w * 0.8} ${h - 92} T ${w} ${h - 84} V ${h} H 0 Z`} fill="#8ED8F0" opacity={0.85} />
          <Path d={`M0 ${h - 55} Q ${w * 0.2} ${h - 75} ${w * 0.4} ${h - 53} T ${w * 0.8} ${h - 57} T ${w} ${h - 50} V ${h} H 0 Z`} fill="#6CC8EA" />
          <Path d={`M0 ${h - 22} Q ${w * 0.25} ${h - 40} ${w * 0.5} ${h - 20} T ${w} ${h - 24} V ${h} H 0 Z`} fill="#F7D98B" />
        </>
      ) : null}
    </Svg>
  );
}

/** Adventure map: three big picture cards pick a world; the winding path of its 5 stages shows below. */
export default function MapScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const stars = useStore((s) => s.mapStars);
  const profile = useStore((s) => s.profile);
  const W = Math.min(width - (width >= 900 ? 48 : 32), 520);

  const cur = currentStageIndex(stars);
  const [sel, setSel] = useState(STAGES[cur].world);
  useEffect(() => { setSel(STAGES[cur].world); }, [cur]);

  const total = STAGES.reduce((n, s) => n + (stars[s.id] ?? 0), 0);
  const done = STAGES.filter((s) => (stars[s.id] ?? 0) > 0).length;
  const world = WORLDS[sel];
  const stages = STAGES.filter((s) => s.world === sel);

  const open = (i: number) => {
    const s = STAGES[i];
    if (!isUnlocked(i, stars)) {
      playSfx('wrong');
      speak(`Finish stage ${i} first to open this one.`);
      return;
    }
    playSfx('tap');
    router.push({ pathname: s.route, params: { stage: s.id, ...(s.boss ? { boss: '1' } : {}) } } as never);
  };

  const worldState = (wi: number) => {
    const ws = STAGES.filter((s) => s.world === wi);
    const first = STAGES.findIndex((s) => s.world === wi);
    const got = ws.reduce((n, s) => n + (stars[s.id] ?? 0), 0);
    return { got, locked: !isUnlocked(first, stars), complete: ws.every((s) => (stars[s.id] ?? 0) > 0) };
  };
  const pickWorld = (wi: number) => {
    if (worldState(wi).locked) {
      playSfx('wrong');
      speak(`Finish ${WORLDS[wi - 1].name} first to open ${WORLDS[wi].name}.`);
      return;
    }
    playSfx('tap');
    setSel(wi);
  };

  // stage centre points inside the panel
  const pts = stages.map((s) => ({ x: X_PATTERN[s.index] * (W - 140) + 70, y: TOP + s.index * GAP + 44 }));
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const m = (b.y - a.y) / 2;
    return ` C ${a.x} ${a.y + m} ${b.x} ${b.y - m} ${b.x} ${b.y}`;
  };
  const firstIdx = STAGES.findIndex((s) => s.world === sel);
  let full = `M ${pts[0].x} ${pts[0].y}`;
  let gold = full;
  for (let i = 1; i < pts.length; i++) {
    const seg = curve(pts[i - 1], pts[i]);
    full += seg;
    if (firstIdx + i <= cur) gold += seg;
  }

  const cardW = (W - 20) / 3;

  return (
    <ScreenShell max={560}>
      <Text style={styles.title}>🗺️ My Adventure Map</Text>
      <Text style={styles.sub}>Pick a world, then play each stage to open the next one.</Text>

      <View style={styles.summary}>
        <View style={styles.sumBox}><Pic emoji="⭐" size={34} /><Text style={styles.sumNum}>{total}<Text style={styles.sumOf}> / {STAGES.length * 3}</Text></Text><Text style={styles.sumLabel}>stars</Text></View>
        <View style={styles.sumBox}><Pic emoji="🚩" size={34} /><Text style={styles.sumNum}>{done}<Text style={styles.sumOf}> / {STAGES.length}</Text></Text><Text style={styles.sumLabel}>stages</Text></View>
        <View style={{ flex: 1.4 }}>
          <BigButton label={done === 0 ? 'Start!' : done === STAGES.length ? 'Play again' : 'Continue'} onPress={() => open(cur)} color={colors.amber} />
        </View>
      </View>

      {/* three big picture cards */}
      <View style={[styles.cards, { width: W }]}>
        {WORLDS.map((w, wi) => {
          const st = worldState(wi);
          const on = sel === wi;
          return (
            <Pressable
              key={w.id}
              onPress={() => pickWorld(wi)}
              accessibilityRole="button"
              accessibilityLabel={`${w.name}, ${st.locked ? 'locked' : `${st.got} of 15 stars`}`}
              style={[styles.card, { width: cardW, borderColor: on ? w.accent : '#fff' }, on ? styles.cardOn : null]}
            >
              <View style={styles.cardTop}>
                <LinearGradient colors={w.cardGrad} style={StyleSheet.absoluteFill} />
                <Text style={styles.cardNo}>WORLD {wi + 1}</Text>
                <View style={[styles.badgeCircle, st.locked ? { opacity: 0.6 } : null]}><Pic emoji={w.pic} size={cardW > 120 ? 62 : 52} /></View>
                {st.locked ? <View style={styles.lockBadge}><Pic emoji="🔒" size={22} /></View> : null}
                {st.complete ? <View style={styles.lockBadge}><Pic emoji="✅" size={22} /></View> : null}
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardName, { color: w.dark }]} numberOfLines={2}>{w.name}</Text>
                <View style={styles.track}><View style={[styles.fillBar, { width: `${(st.got / 15) * 100}%`, backgroundColor: w.accent }]} /></View>
                <Text style={styles.cardStars}>⭐ {st.got}/15</Text>
              </View>
              <View style={[styles.cardBtn, { backgroundColor: st.locked ? '#D5DBE8' : w.accent, borderBottomColor: st.locked ? '#BCC5D6' : w.dark }]}>
                <Text style={[styles.cardBtnText, st.locked ? { color: '#7B8499' } : null]}>{st.locked ? '🔒 Locked' : on ? 'Playing' : st.complete ? 'Replay' : 'Open'}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* selected world: winding path of 5 stages */}
      <View style={[styles.panel, { width: W, height: PANEL_H, borderColor: world.accent }]}>
        <LinearGradient colors={world.grad} style={StyleSheet.absoluteFill} />
        <WorldArt kind={world.art} w={W - 8} h={PANEL_H - 8} />
        <View style={styles.panelTitle}>
          <Text style={[styles.panelName, { color: world.dark }]}>{world.emoji} {world.name}</Text>
          <Text style={styles.panelDesc}>{world.desc}</Text>
        </View>

        <Svg width={W} height={PANEL_H} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Path d={full} stroke="#FFFFFF" strokeOpacity={0.95} strokeWidth={26} strokeLinecap="round" fill="none" />
          <Path d={full} stroke="#C9D6EA" strokeWidth={4} strokeDasharray="1 14" strokeLinecap="round" fill="none" />
          <Path d={gold} stroke="#FFC93C" strokeWidth={12} strokeLinecap="round" fill="none" />
        </Svg>

        {stages.map((s, k) => {
          const p = pts[k];
          const left = p.x < W / 2;
          return (
            <View key={`d${s.id}`} pointerEvents="none" style={{ position: 'absolute', left: left ? W - 82 : 12, top: p.y - 28 }}>
              <Pic emoji={world.deco[s.index]} size={s.boss ? 64 : 56} />
            </View>
          );
        })}

        {stages.map((s, k) => {
          const i = firstIdx + k;
          const p = pts[k];
          const r = s.boss ? 50 : 40;
          const got = stars[s.id] ?? 0;
          const unlocked = isUnlocked(i, stars);
          const isCur = i === cur && unlocked;
          const nodeLeft = p.x < W / 2;
          const icon = s.boss ? BOSS_PIC[s.world] : GAME_ICONS[s.game].icon;
          return (
            <View key={s.id} style={{ position: 'absolute', left: p.x - 70, top: p.y - r, width: 140, alignItems: 'center' }}>
              {isCur ? (
                <View style={[styles.here, nodeLeft ? { left: 70 + r + 6 } : { right: 70 + r + 6 }]}>
                  <View style={styles.hereAvatar}><Pic emoji={profile.avatar} size={36} /></View>
                  <Text style={styles.hereText} numberOfLines={1}>You are here!</Text>
                </View>
              ) : null}
              <Pressable
                onPress={() => open(i)}
                accessibilityRole="button"
                accessibilityLabel={`Stage ${i + 1}, ${s.label}${unlocked ? '' : ', locked'}`}
                style={[
                  styles.node,
                  { width: r * 2, height: r * 2, borderRadius: r },
                  got > 0 ? { backgroundColor: '#FFD24D', borderColor: '#fff' } : unlocked ? { backgroundColor: '#fff', borderColor: world.accent } : styles.nodeLocked,
                  isCur ? styles.nodeCur : null,
                ]}
              >
                <Pic emoji={unlocked ? icon : '🔒'} size={s.boss ? 56 : 44} />
                <View style={[styles.num, { backgroundColor: unlocked ? world.accent : '#B9C2D3' }]}><Text style={styles.numText}>{i + 1}</Text></View>
              </Pressable>
              <View style={styles.starRow}>
                {[1, 2, 3].map((n) => (<View key={n} style={{ opacity: n <= got ? 1 : 0.28 }}><Pic emoji="⭐" size={20} /></View>))}
              </View>
              <Text style={[styles.label, !unlocked ? { opacity: 0.55 } : null]} numberOfLines={1}>{s.boss ? 'Boss stage!' : s.label}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.foot}>The words in every stage match your level (Level {profile.level}).</Text>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sub: { fontSize: 15, color: colors.ink, marginBottom: 14 },
  summary: { flexDirection: 'row', gap: 10, marginBottom: 16, alignItems: 'stretch' },
  sumBox: { flex: 1, backgroundColor: '#fff', borderRadius: 22, paddingVertical: 8, alignItems: 'center' },
  sumNum: { fontSize: 22, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', color: colors.ink },
  sumOf: { fontSize: 13, color: colors.muted },
  sumLabel: { fontSize: 12, color: colors.muted },

  cards: { flexDirection: 'row', gap: 10, alignSelf: 'center', marginBottom: 18, alignItems: 'stretch' },
  card: { backgroundColor: '#fff', borderRadius: 26, borderWidth: 4, overflow: 'hidden', shadowColor: '#5B8DB8', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  cardOn: { shadowOpacity: 0.35, shadowRadius: 16 },
  cardTop: { height: 118, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  badgeCircle: { width: 84, height: 84, borderRadius: 42, marginTop: 16, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  cardNo: { position: 'absolute', top: 8, left: 8, fontSize: 10, letterSpacing: 1, color: '#fff', backgroundColor: 'rgba(43,42,82,0.55)', borderRadius: 999, paddingHorizontal: 7, paddingVertical: 1, overflow: 'hidden', fontFamily: 'Baloo2_800ExtraBold' },
  lockBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: 3 },
  cardBody: { paddingHorizontal: 8, paddingTop: 8, paddingBottom: 6, alignItems: 'center' },
  cardName: { fontSize: 16, lineHeight: 18, textAlign: 'center', fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900', minHeight: 34 },
  track: { height: 8, borderRadius: 4, backgroundColor: '#E9EEF6', marginTop: 4, alignSelf: 'stretch', overflow: 'hidden' },
  fillBar: { height: 8, borderRadius: 4 },
  cardStars: { fontSize: 12, color: colors.ink, marginTop: 3 },
  cardBtn: { margin: 8, marginTop: 2, borderRadius: 16, paddingVertical: 7, alignItems: 'center', borderBottomWidth: 4 },
  cardBtnText: { fontSize: 14, color: '#fff', fontFamily: 'Baloo2_800ExtraBold' },

  panel: { alignSelf: 'center', borderRadius: 36, overflow: 'hidden', borderWidth: 4, shadowColor: '#5B8DB8', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  panelTitle: { position: 'absolute', top: 14, left: 18, right: 18 },
  panelName: { fontSize: 22, fontFamily: 'Baloo2_800ExtraBold', fontWeight: '900' },
  panelDesc: { fontSize: 13, color: colors.ink },
  node: { alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderBottomWidth: 9, shadowColor: '#3B4BDB', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  nodeLocked: { backgroundColor: '#E4E9F2', borderColor: '#CBD3E2' },
  nodeCur: { borderColor: '#FF6B6B' },
  num: { position: 'absolute', top: -6, left: -6, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  numText: { fontSize: 13, color: '#fff', fontFamily: 'Baloo2_800ExtraBold' },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 6 },
  label: { fontSize: 12, color: colors.ink, marginTop: 1, textAlign: 'center' },
  here: { position: 'absolute', top: 18, width: 124, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 999, paddingRight: 10, paddingLeft: 3, paddingVertical: 3, shadowColor: '#3B4BDB', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4, zIndex: 3 },
  hereAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1C2', alignItems: 'center', justifyContent: 'center' },
  hereText: { flexShrink: 0, fontSize: 12, color: colors.ink, fontFamily: 'Baloo2_800ExtraBold' },
  foot: { textAlign: 'center', fontSize: 13, color: colors.ink, marginTop: 12 },
});
