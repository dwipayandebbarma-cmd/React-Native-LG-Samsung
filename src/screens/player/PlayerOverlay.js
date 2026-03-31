import { StyleSheet, Text, View } from 'react-native';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function PlayerOverlay({ title, isPlaying, positionSec, durationSec }) {
  const safeDuration = Number.isFinite(durationSec) && durationSec > 0 ? durationSec : 0;
  const pct = safeDuration > 0 ? Math.min(1, Math.max(0, positionSec / safeDuration)) : 0;

  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.state}>{isPlaying ? 'Playing' : 'Paused'}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(positionSec)}</Text>
          <Text style={styles.time}>{formatTime(durationSec)}</Text>
        </View>
        <Text style={styles.hint} numberOfLines={1}>
          Enter: Play/Pause · ←/→: Seek 10s
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  state: {
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#d0d0d5',
  },
  bottom: {
    paddingBottom: 10,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
  timeRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: '#d0d0d5',
    fontWeight: '600',
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#8e8e93',
  },
});

