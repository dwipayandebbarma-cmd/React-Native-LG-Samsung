import { LinearGradient } from 'expo-linear-gradient';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

export function Banner({
  focusKey,
  title,
  metaLine,
  subLine,
  description,
  imageUri,
  onWatchPress,
}) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: onWatchPress,
  });

  return (
    <View style={styles.shell}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(5,0,18,0.97)', 'rgba(5,0,18,0.65)', 'rgba(5,0,18,0.15)', 'transparent']}
          locations={[0, 0.28, 0.55, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>{metaLine}</Text>
          <Text style={styles.sub}>{subLine}</Text>
          <Text style={styles.desc} numberOfLines={3}>
            {description}
          </Text>
          <View
            ref={ref}
            style={[styles.cta, focused && styles.ctaFocused]}
            accessibilityRole="button"
            accessibilityLabel="Watch now"
            collapsable={false}
            focusable
          >
            <Text style={[styles.ctaText, focused && styles.ctaTextFocused]}>Watch now</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#050012',
  },
  bg: {
    minHeight: 320,
    justifyContent: 'flex-end',
  },
  bgImage: {
    borderRadius: 8,
  },
  content: {
    maxWidth: '46%',
    paddingVertical: 36,
    paddingHorizontal: 28,
    paddingRight: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: '#d0d0d5',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 14,
  },
  desc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#aeaeb2',
    marginBottom: 22,
  },
  cta: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ctaFocused: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#c8c8cd',
  },
  ctaTextFocused: {
    color: '#ffffff',
  },
});
