import { ThemeProvider } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Image } from 'react-native';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(Platform.OS === 'web');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // 1초 후 페이드아웃 시작
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1000);

      // 1.5초 후 완전히 제거 (페이드아웃 애니메이션 0.5초)
      const hideTimer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="category/[category]" />
        <Stack.Screen name="details/[id]" />
      </Stack>

      {showSplash && (
        <View style={[
          styles.splashContainer,
          fadeOut && styles.splashFadeOut
        ]}>
          <Image
            source={require('../assets/images/logo-round.png')}
            style={styles.splashLogo}
            resizeMode="contain"
          />
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    opacity: 1,
    transition: 'opacity 0.5s ease-out',
  },
  splashFadeOut: {
    opacity: 0,
  },
  splashLogo: {
    width: 150,
    height: 150,
  },
});