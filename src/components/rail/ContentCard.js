import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Image, StyleSheet, Text, View } from 'react-native';

export const CARD_MARGIN_RIGHT = 14;

export const CARD_WIDTH_PORTRAIT = 132;
export const CARD_HEIGHT_PORTRAIT = 198;

export const CARD_WIDTH_LANDSCAPE = 220;
export const CARD_HEIGHT_LANDSCAPE = 124;

export function getCardStride(variant) {
  const w = variant === 'landscape' ? CARD_WIDTH_LANDSCAPE : CARD_WIDTH_PORTRAIT;
  return w + CARD_MARGIN_RIGHT;
}

export function ContentCard({
  focusKey,
  title,
  imageUri,
  variant = 'portrait',
  railTitle,
  onEnterPress,
  onCardFocus,
  style,
}) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress,
    extraProps: { title, imageUri, variant, railTitle },
    onFocus: (_layout, props) => {
      onCardFocus?.(props);
    },
  });

  const width = variant === 'landscape' ? CARD_WIDTH_LANDSCAPE : CARD_WIDTH_PORTRAIT;
  const imageH = variant === 'landscape' ? CARD_HEIGHT_LANDSCAPE : CARD_HEIGHT_PORTRAIT;

  return (
    <View
      ref={ref}
      style={[styles.wrap, { width }, focused && styles.wrapFocused, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
      collapsable={false}
      focusable
    >
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { height: imageH }]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      {title ? (
        <Text style={styles.caption} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginRight: CARD_MARGIN_RIGHT,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1a1a22',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  wrapFocused: {
    borderColor: '#ffffff',
  },
  image: {
    width: '100%',
    backgroundColor: '#2a2a33',
  },
  caption: {
    fontSize: 11,
    color: '#a1a1a6',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
});
