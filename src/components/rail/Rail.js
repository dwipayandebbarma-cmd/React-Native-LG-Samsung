import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PaginationDots } from '../pagination/PaginationDots';
import { ContentCard } from './ContentCard';

export function Rail({ title, items, variant, focusKeyPrefix, onCardPress, onCardFocus }) {
  const [viewportW, setViewportW] = useState(0);
  const [contentW, setContentW] = useState(0);
  const [hPage, setHPage] = useState(0);

  const onHLayout = useCallback((e) => {
    setViewportW(e.nativeEvent.layout.width);
  }, []);

  const onHScroll = useCallback(
    (e) => {
      const w = e.nativeEvent.layoutMeasurement.width;
      if (w <= 0) {
        return;
      }
      const x = e.nativeEvent.contentOffset.x;
      const cw = e.nativeEvent.contentSize.width;
      setContentW(cw);
      const pages = Math.max(1, Math.ceil(cw / w));
      const page = Math.min(pages - 1, Math.max(0, Math.round(x / w)));
      setHPage(page);
    },
    []
  );

  const hTotalPages = viewportW > 0 && contentW > 0 ? Math.max(1, Math.ceil(contentW / viewportW)) : 1;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onLayout={onHLayout}
        onScroll={onHScroll}
        onContentSizeChange={(w) => setContentW(w)}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
        decelerationRate="fast"
      >
        {items.map((item, index) => (
          <ContentCard
            key={item.id}
            focusKey={`${focusKeyPrefix}_${index}`}
            title={item.title}
            imageUri={item.imageUri}
            variant={variant}
            railTitle={title}
            onEnterPress={() => onCardPress?.(title, item, index)}
            onCardFocus={onCardFocus}
          />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        <PaginationDots current={hPage} total={hTotalPages} orientation="horizontal" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f5f5f7',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingRight: 48,
    paddingVertical: 4,
  },
  pagination: {
    marginTop: 10,
    alignItems: 'center',
  },
});
