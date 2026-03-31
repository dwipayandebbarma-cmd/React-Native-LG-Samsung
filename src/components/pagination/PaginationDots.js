import { StyleSheet, Text, View } from 'react-native';

const MAX_DOTS = 9;

/**
 * @param {'horizontal' | 'vertical'} orientation
 */
export function PaginationDots({ current, total, orientation = 'horizontal' }) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal - 1);

  if (safeTotal > MAX_DOTS) {
    return (
      <View style={[styles.numeric, orientation === 'vertical' && styles.numericVertical]}>
        <Text style={styles.numericText}>
          {safeCurrent + 1} / {safeTotal}
        </Text>
      </View>
    );
  }

  const dots = Array.from({ length: safeTotal }, (_, i) => i);

  return (
    <View style={[styles.row, orientation === 'vertical' && styles.col]}>
      {dots.map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            orientation === 'vertical' ? styles.dotVertical : styles.dotHorizontal,
            i === safeCurrent && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  col: {
    flexDirection: 'column',
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotHorizontal: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotVertical: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginVertical: 3,
  },
  dotActive: {
    backgroundColor: '#ffffff',
    transform: [{ scale: 1.25 }],
  },
  numeric: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  numericVertical: {
    paddingVertical: 8,
  },
  numericText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d0d0d5',
  },
});
