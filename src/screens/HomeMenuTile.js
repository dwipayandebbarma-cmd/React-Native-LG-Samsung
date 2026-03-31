import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { StyleSheet, Text, View } from 'react-native';

export function HomeMenuTile({ focusKey, label, onEnterPress, style }) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress,
  });

  return (
    <View
      ref={ref}
      style={[styles.tile, focused && styles.tileFocused, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
      collapsable={false}
      // RN Web: role=button already gets tabIndex 0; keep explicit for TV-style focus().
      focusable
    >
      <Text style={[styles.tileLabel, focused && styles.tileLabelFocused]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: 200,
    marginRight: 20,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: '#1c1c24',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileFocused: {
    borderColor: '#5ac8fa',
    backgroundColor: '#252530',
  },
  tileLabel: {
    fontSize: 18,
    color: '#aeaeb2',
    fontWeight: '600',
  },
  tileLabelFocused: {
    color: '#f5f5f7',
  },
});
