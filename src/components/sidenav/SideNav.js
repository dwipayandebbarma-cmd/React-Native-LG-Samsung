import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { StyleSheet, View } from 'react-native';
import { SideNavItem } from './SideNavItem';

export const SIDENAV_ITEMS = [
  { focusKey: 'SN_SEARCH', id: 'search', label: 'Search', icon: '⌕' },
  { focusKey: 'SN_HOME', id: 'home', label: 'Home', icon: '⌂' },
  { focusKey: 'SN_MOVIES', id: 'movies', label: 'Movies', icon: '▶' },
  { focusKey: 'SN_SHOWS', id: 'shows', label: 'Shows', icon: '▣' },
  { focusKey: 'SN_SPORTS', id: 'sports', label: 'Sports', icon: '◎' },
  { focusKey: 'SN_KIDS', id: 'kids', label: 'Kids', icon: '☺' },
  { focusKey: 'SN_LIVE', id: 'live', label: 'Live TV', icon: '●' },
  { focusKey: 'SN_LIBRARY', id: 'library', label: 'Library', icon: '≡' },
  { focusKey: 'SN_SETTINGS', id: 'settings', label: 'Settings', icon: '⚙' },
  { focusKey: 'SN_DOWNLOADS', id: 'downloads', label: 'Downloads', icon: '↓' },
];

export function SideNav({ activeNavId, onSelectNav }) {
  const { ref, focusKey } = useFocusable({
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <View ref={ref} style={styles.column} collapsable={false}>
        {SIDENAV_ITEMS.map((item) => (
          <SideNavItem
            key={item.focusKey}
            focusKey={item.focusKey}
            icon={item.icon}
            label={item.label}
            isActive={item.id === activeNavId}
            onEnterPress={() => onSelectNav(item.id)}
          />
        ))}
      </View>
    </FocusContext.Provider>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 76,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#1c1c24',
  },
});
