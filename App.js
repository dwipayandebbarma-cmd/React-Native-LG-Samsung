import 'react-native-gesture-handler';
import { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { initSpatialNavigation } from './src/spatial/initSpatialNavigation';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerWebTvBackHandler } from './src/platform/registerWebTvBackHandler';

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    initSpatialNavigation();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    return registerWebTvBackHandler(() => navigationRef.current);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }
    const styleId = 'norigin-data-focused-styles';
    if (document.getElementById(styleId)) {
      return;
    }
    const el = document.createElement('style');
    el.id = styleId;
    el.textContent = `
      [data-focused="true"] {
        outline: none !important;
      }
    `;
    document.head.appendChild(el);
  }, []);

  return (
    <View style={styles.root}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
});
