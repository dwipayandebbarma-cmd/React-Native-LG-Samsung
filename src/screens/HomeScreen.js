import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { FocusContext, setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Banner } from '../components/banner/Banner';
import { PaginationDots } from '../components/pagination/PaginationDots';
import { Rail } from '../components/rail/Rail';
import { SideNav } from '../components/sidenav/SideNav';
import { BANNER_MOCK, HOME_RAILS, INITIAL_CARD_FOCUS_KEY } from '../data/homeMocks';

function MainColumn({ banner, scrollChildren, onVerticalScroll, verticalPage, verticalTotal }) {
  const { ref, focusKey } = useFocusable({
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <View ref={ref} style={styles.main} collapsable={false}>
        <View style={styles.stickyBannerWrap} collapsable={false}>
          {banner}
        </View>
        <ScrollView
          pagingEnabled
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScroll={onVerticalScroll}
          contentContainerStyle={styles.mainScrollContent}
          style={styles.mainScroll}
        >
          {scrollChildren}
        </ScrollView>
        <View style={styles.verticalPagination} pointerEvents="none">
          <PaginationDots current={verticalPage} total={verticalTotal} orientation="vertical" />
        </View>
      </View>
    </FocusContext.Provider>
  );
}

function buildBannerFromCard({ title, imageUri, variant, railTitle }) {
  return {
    title,
    imageUri,
    metaLine: railTitle,
    subLine: variant === 'landscape' ? 'Landscape · Featured pick' : 'Portrait · Featured pick',
    description: `Previewing "${title}" from ${railTitle}. Use Watch now to start playback.`,
  };
}

export function HomeScreen({ navigation }) {
  const [activeNavId, setActiveNavId] = useState('home');
  const [verticalPage, setVerticalPage] = useState(0);
  const [verticalTotal, setVerticalTotal] = useState(1);
  const [cardBanner, setCardBanner] = useState(null);
  const { ref, focusKey } = useFocusable({
    trackChildren: true,
  });

  const bannerProps = useMemo(() => {
    if (cardBanner) {
      return cardBanner;
    }
    return {
      title: BANNER_MOCK.title,
      metaLine: BANNER_MOCK.metaLine,
      subLine: BANNER_MOCK.subLine,
      description: BANNER_MOCK.description,
      imageUri: BANNER_MOCK.imageUri,
    };
  }, [cardBanner]);

  const handleVerticalScroll = useCallback((e) => {
    const h = e.nativeEvent.layoutMeasurement.height;
    if (h <= 0) {
      return;
    }
    const y = e.nativeEvent.contentOffset.y;
    const ch = e.nativeEvent.contentSize.height;
    const pages = Math.max(1, Math.ceil(ch / h));
    const page = Math.min(pages - 1, Math.max(0, Math.round(y / h)));
    setVerticalPage(page);
    setVerticalTotal(pages);
  }, []);

  const onCardFocus = useCallback((props) => {
    if (!props?.imageUri) {
      return;
    }
    setCardBanner(buildBannerFromCard(props));
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFocus(INITIAL_CARD_FOCUS_KEY);
      });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const onSelectNav = useCallback((id) => {
    setActiveNavId(id);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Home] Nav:', id);
    }
  }, []);

  const onCardPress = useCallback((railTitle, item, index) => {
    navigation?.navigate?.('Player', { videoIndex: index ?? 0 });
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Home] Card:', railTitle, item.id);
    }
  }, [navigation]);

  const onWatchPress = useCallback(() => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Home] Watch banner');
    }
  }, []);

  const bannerEl = (
    <Banner
      key={bannerProps.imageUri}
      focusKey="HOME_BANNER_WATCH"
      title={bannerProps.title}
      metaLine={bannerProps.metaLine}
      subLine={bannerProps.subLine}
      description={bannerProps.description}
      imageUri={bannerProps.imageUri}
      onWatchPress={onWatchPress}
    />
  );

  const railsEl = (
    <View style={styles.mainInner}>
      {HOME_RAILS.map((rail) => (
        <Rail
          key={rail.id}
          title={rail.title}
          items={rail.items}
          variant={rail.variant}
          focusKeyPrefix={`HOME_RAIL_${rail.id}`}
          onCardPress={onCardPress}
          onCardFocus={onCardFocus}
        />
      ))}
      {Platform.OS === 'web' ? (
        <Text style={styles.hint}>Arrow keys · Enter · Banner previews focused card</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.outer}>
      <FocusContext.Provider value={focusKey}>
        <View ref={ref} style={styles.pageRow} collapsable={false}>
          <SideNav activeNavId={activeNavId} onSelectNav={onSelectNav} />
          <MainColumn
            banner={bannerEl}
            scrollChildren={railsEl}
            onVerticalScroll={handleVerticalScroll}
            verticalPage={verticalPage}
            verticalTotal={verticalTotal}
          />
        </View>
      </FocusContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#050012',
  },
  pageRow: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  stickyBannerWrap: {
    paddingTop: 20,
    paddingHorizontal: 8,
    paddingRight: 40,
    marginBottom: 16,
    flexShrink: 0,
  },
  mainScroll: {
    flex: 1,
    minHeight: 0,
  },
  mainScrollContent: {
    paddingBottom: 48,
  },
  mainInner: {
    paddingRight: 40,
    paddingLeft: 8,
  },
  verticalPagination: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  hint: {
    marginTop: 16,
    fontSize: 13,
    color: '#636366',
  },
});
