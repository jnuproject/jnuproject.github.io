import { ThemeProvider } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

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

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const vendor = navigator.vendor || '';
    const userAgent = navigator.userAgent || '';
    const isAppleVendor = vendor.includes('Apple');
    const hasTouch =
      typeof navigator.maxTouchPoints === 'number'
        ? navigator.maxTouchPoints > 0
        : /Mobile|iP(hone|od|ad)/i.test(userAgent);
    const isiOSFamily = /iP(hone|od|ad)/i.test(userAgent) || (isAppleVendor && hasTouch);
    const isSafariEngine = /Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/FxiOS/i.test(userAgent);

    if (!(isiOSFamily && isAppleVendor && isSafariEngine)) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    const previous = {
      htmlHeight: html.style.height,
      htmlMinHeight: html.style.minHeight,
      bodyOverflowY: body.style.overflowY,
      bodyHeight: body.style.height,
      bodyMinHeight: body.style.minHeight,
      rootHeight: root?.style.height,
      rootMinHeight: root?.style.minHeight,
      webkitOverflowScrolling: body.style.getPropertyValue('-webkit-overflow-scrolling'),
    };

    html.style.height = 'auto';
    html.style.minHeight = '100vh';
    body.style.overflowY = 'auto';
    body.style.height = 'auto';
    body.style.minHeight = '100vh';
    body.style.setProperty('-webkit-overflow-scrolling', 'touch');

    if (root) {
      root.style.height = 'auto';
      root.style.minHeight = '100vh';
    }

    return () => {
      html.style.height = previous.htmlHeight;
      html.style.minHeight = previous.htmlMinHeight;
      body.style.overflowY = previous.bodyOverflowY;
      body.style.height = previous.bodyHeight;
      body.style.minHeight = previous.bodyMinHeight;
      body.style.setProperty('-webkit-overflow-scrolling', previous.webkitOverflowScrolling || '');

      if (root) {
        root.style.height = previous.rootHeight || '';
        root.style.minHeight = previous.rootMinHeight || '';
      }
    };
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
            resizeMode="cover"
          />
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Platform.OS === 'web' ? '100vw' : '100%',
    height: Platform.OS === 'web' ? '100vh' : '100%',
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
    width: '100%',
    height: '100%',
  },
});
