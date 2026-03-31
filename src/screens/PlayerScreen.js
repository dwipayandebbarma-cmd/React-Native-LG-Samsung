import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { loadShakaPlayer } from '../player/loadShaka';
import media from '../data/media.json';
import { PlayerOverlay } from './player/PlayerOverlay';

function pickVideoByIndex(index) {
  const videos = media?.categories?.[0]?.videos ?? [];
  if (!videos.length) {
    return null;
  }
  const i = Math.abs(index || 0) % videos.length;
  return videos[i];
}

function normalizeSourceUrl(url) {
  if (typeof url !== 'string') return '';
  // Most TV/web environments require HTTPS for these samples.
  if (url.startsWith('http://commondatastorage.googleapis.com/')) {
    return url.replace('http://', 'https://');
  }
  return url;
}

function isProgressiveMp4(url) {
  return typeof url === 'string' && url.toLowerCase().includes('.mp4');
}

export function PlayerScreen({ route, navigation }) {
  const index = route?.params?.videoIndex ?? 0;
  const initial = useMemo(() => pickVideoByIndex(index), [index]);

  const videoRef = useRef(null);
  const shakaPlayerRef = useRef(null);

  const [title, setTitle] = useState(initial?.title ?? 'Player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionSec, setPositionSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [errorText, setErrorText] = useState('');
  const [isBuffering, setIsBuffering] = useState(true);

  const togglePlayPause = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      const p = el.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    } else {
      el.pause();
    }
  }, []);

  const tryAutoPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const p = el.play();
    if (p && typeof p.catch === 'function') {
      // Autoplay policies vary; TV browsers usually allow this, desktop may block.
      p.catch(() => {});
    }
  }, []);

  const seekBy = useCallback((delta) => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.currentTime)) return;
    const next = Math.max(0, Math.min((el.duration || 0) || 0, el.currentTime + delta));
    el.currentTime = next;
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    const el = videoRef.current;
    if (!el) return;

    let mounted = true;
    let cleanupPlayer = null;

    (async () => {
      try {
        const video = pickVideoByIndex(index);
        if (!video?.sources?.[0]) {
          setErrorText('No playable source found in media.json');
          return;
        }

        setTitle(video.title || 'Player');

        setErrorText('');
        setIsBuffering(true);
        const src = normalizeSourceUrl(video.sources[0]);

        // For plain MP4, skip Shaka and use native <video>.
        if (isProgressiveMp4(src)) {
          if (shakaPlayerRef.current) {
            try {
              await shakaPlayerRef.current.destroy();
            } catch (_) {}
            shakaPlayerRef.current = null;
          }
          el.src = src;
          el.load?.();
          tryAutoPlay();
          cleanupPlayer = async () => {};
          return;
        }

        const shaka = await loadShakaPlayer();
        if (!mounted || !shaka) return;

        const player = new shaka.Player(el);
        shakaPlayerRef.current = player;

        player.addEventListener('error', (evt) => {
          const detail = evt?.detail;
          const data = Array.isArray(detail?.data) ? detail.data : [];
          const tail = data.length ? ` (${data.map((d) => String(d)).join(' | ')})` : '';
          setErrorText(`Shaka error ${detail?.code ?? ''}${tail}`.trim());
        });

        await player.load(src);
        tryAutoPlay();

        cleanupPlayer = async () => {
          try {
            await player.destroy();
          } catch (_) {}
        };
      } catch (e) {
        setErrorText(e?.message || 'Failed to initialize player');
      }
    })();

    return () => {
      mounted = false;
      try {
        el.pause();
      } catch (_) {}
      if (cleanupPlayer) {
        cleanupPlayer();
      }
      shakaPlayerRef.current = null;
    };
  }, [index]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onTimeUpdate = () => {
      setPositionSec(el.currentTime || 0);
      setDurationSec(el.duration || 0);
    };
    const onPlay = () => {
      setIsPlaying(true);
      // If autoplay resumes after buffering, hide loader.
      setIsBuffering(false);
    };
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => {
      setDurationSec(el.duration || 0);
    };
    const onWaiting = () => setIsBuffering(true);
    const onStalled = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onCanPlay = () => {
      // If the video is ready but hasn't started yet, keep buffering state until 'playing'.
      setDurationSec(el.duration || 0);
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('waiting', onWaiting);
    el.addEventListener('stalled', onStalled);
    el.addEventListener('playing', onPlaying);
    el.addEventListener('canplay', onCanPlay);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('waiting', onWaiting);
      el.removeEventListener('stalled', onStalled);
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    const onKeyDown = (e) => {
      // Back: return to previous screen (Home)
      // Covers: Browser back keys, Escape, Backspace, and common TV remote keyCodes (LG webOS / Samsung Tizen).
      if (
        e.key === 'Escape' ||
        e.key === 'Backspace' ||
        e.key === 'BrowserBack' ||
        e.key === 'GoBack' ||
        e.keyCode === 8 ||
        e.keyCode === 27 ||
        e.keyCode === 461 ||
        e.keyCode === 10009
      ) {
        e.preventDefault();
        navigation?.goBack?.();
        return;
      }
      // Enter: toggle play/pause
      if (e.key === 'Enter') {
        e.preventDefault();
        togglePlayPause();
        return;
      }
      // ArrowLeft / ArrowRight: seek
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekBy(-10);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekBy(10);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigation, seekBy, togglePlayPause]);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Player is implemented for web/TV builds (Shaka).</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.videoWrap} collapsable={false}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <video
          ref={videoRef}
          style={styles.video}
          playsInline
          crossOrigin="anonymous"
          autoPlay
          preload="auto"
        />
      </View>

      {isBuffering ? (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>Loading…</Text>
        </View>
      ) : null}

      <PlayerOverlay
        title={title}
        isPlaying={isPlaying}
        positionSec={positionSec}
        durationSec={durationSec}
      />

      {errorText ? (
        <View style={styles.errorWrap} pointerEvents="none">
          <Text style={styles.errorText} numberOfLines={3}>
            {errorText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoWrap: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  loaderText: {
    marginTop: 10,
    color: '#d0d0d5',
    fontSize: 13,
    fontWeight: '600',
  },
  errorWrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 64,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,0,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.25)',
  },
  errorText: {
    color: '#ffd1d1',
    fontSize: 12,
    fontWeight: '600',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 24,
  },
  fallbackText: {
    color: '#d0d0d5',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

