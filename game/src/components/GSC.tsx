import React from 'react';
import { Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  title?: string;
  uri: string;
};

export default function GameScreen({ title = '🎮 Dream Console', uri }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const isWeb = Platform.OS === 'web';
  const readableTitle = title || '🎮 Dream Console';

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const WebViewComponent = !isWeb ? require('react-native-webview').WebView : null;

  return (
    <LinearGradient
      colors={['#A8D5D5', '#E8DFF5']}
      style={styles.container}
    >
      <TouchableOpacity onPress={handleBack} style={styles.floatingBackButton} activeOpacity={0.8}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      {isWeb ? (
        <iframe
          src={uri}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={readableTitle}
        />
      ) : (
        WebViewComponent && <WebViewComponent source={{ uri }} style={styles.webview} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  floatingBackButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
});
