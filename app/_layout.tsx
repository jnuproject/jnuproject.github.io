import { ThemeProvider } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="category/[category]" />
        <Stack.Screen name="details/[id]" />
      </Stack>
    </ThemeProvider>
  );
}