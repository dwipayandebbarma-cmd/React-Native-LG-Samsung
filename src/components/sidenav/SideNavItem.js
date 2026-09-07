import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { StyleSheet, Text, View } from 'react-native';

export function SideNavItem({ focusKey, icon, label, isActive, onEnterPress }) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress,
  });

  return (
    <View
      ref={ref}
      style={[
        styles.item,
        isActive && !focused && styles.itemSection,
        focused && styles.itemActive,
        focused && styles.itemFocused,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      collapsable={false}
      focusable
    >
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  itemSection: {
    backgroundColor: 'rgba(217, 70, 140, 0.35)',
  },
  itemActive: {
    backgroundColor: '#d9468c',
  },
  itemFocused: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  icon: {
    fontSize: 22,
    lineHeight: 26,
    color: '#ffffff',
    opacity: 0.9,
  },
  iconFocused: {
    opacity: 1,
  },
});
